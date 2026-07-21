<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Riwayat pesanan milik pelanggan yang sedang login.
     */
    public function myOrders(Request $request)
    {
        $orders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * Detail satu pesanan (invoice) - pelanggan hanya boleh lihat miliknya sendiri,
     * admin boleh lihat semua.
     */
    public function show(Request $request, Order $order)
    {
        if (! $request->user()->isAdmin() && $order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Kamu tidak punya akses ke pesanan ini.'], 403);
        }

        return response()->json($order->load('items', 'user'));
    }

    /**
     * Buat pesanan baru (checkout). Wajib login (route pakai middleware auth:sanctum).
     * Payload: items: [{product_id, quantity, spice_level}], delivery_address, phone, notes
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.spice_level' => ['required', 'integer', 'min:1', 'max:5'],
            'delivery_address' => ['required', 'string', 'max:500'],
            'phone' => ['required', 'string', 'max:20'],
            'notes' => ['nullable', 'string'],
            'payment_method' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        try {
            $order = DB::transaction(function () use ($request) {
                $totalPrice = 0;
                $itemsData = [];

                foreach ($request->items as $item) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    if (! $product->is_available) {
                        throw new \Exception("Produk '{$product->name}' sedang tidak tersedia.");
                    }

                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Stok '{$product->name}' tidak mencukupi. Sisa stok: {$product->stock}.");
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $totalPrice += $subtotal;

                    $itemsData[] = [
                        'product' => $product,
                        'quantity' => $item['quantity'],
                        'spice_level' => $item['spice_level'],
                        'subtotal' => $subtotal,
                    ];

                    // Kurangi stok produk
                    $product->decrement('stock', $item['quantity']);
                }

                $order = Order::create([
                    'user_id' => $request->user()->id,
                    'order_number' => 'ORD-'.now()->format('Ymd').'-'.strtoupper(Str::random(6)),
                    'status' => 'pending',
                    'total_price' => $totalPrice,
                    'delivery_address' => $request->delivery_address,
                    'phone' => $request->phone,
                    'notes' => $request->notes,
                    'payment_method' => $request->payment_method ?? 'cod',
                ]);

                foreach ($itemsData as $data) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $data['product']->id,
                        'product_name' => $data['product']->name,
                        'quantity' => $data['quantity'],
                        'spice_level' => $data['spice_level'],
                        'price' => $data['product']->price,
                        'subtotal' => $data['subtotal'],
                    ]);
                }

                return $order;
            });
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Pesanan berhasil dibuat',
            'order' => $order->load('items'),
        ], 201);
    }

    /**
     * List semua pesanan - khusus admin, untuk dashboard admin.
     */
    public function index(Request $request)
    {
        $query = Order::with('items', 'user')->latest();

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    /**
     * Update status pesanan - khusus admin.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', 'in:pending,diproses,diantar,selesai,dibatalkan'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $order->update(['status' => $request->status]);

        return response()->json(['message' => 'Status pesanan berhasil diperbarui', 'order' => $order->load('items')]);
    }
}
