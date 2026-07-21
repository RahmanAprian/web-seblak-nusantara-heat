<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Ringkasan untuk dashboard admin: total pesanan hari ini, pendapatan,
     * pesanan pending, dan bahan baku yang menipis.
     */
    public function summary()
    {
        $todayOrders = Order::whereDate('created_at', now()->toDateString())->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $todayRevenue = Order::whereDate('created_at', now()->toDateString())
            ->where('status', '!=', 'dibatalkan')
            ->sum('total_price');

        $lowStockIngredients = Ingredient::whereColumn('stock_quantity', '<=', 'min_threshold')->get();
        $lowStockProducts = Product::where('stock', '<=', 5)->get();

        return response()->json([
            'today_orders' => $todayOrders,
            'pending_orders' => $pendingOrders,
            'today_revenue' => $todayRevenue,
            'total_products' => Product::count(),
            'total_ingredients' => Ingredient::count(),
            'low_stock_ingredients' => $lowStockIngredients,
            'low_stock_products' => $lowStockProducts,
        ]);
    }
}
