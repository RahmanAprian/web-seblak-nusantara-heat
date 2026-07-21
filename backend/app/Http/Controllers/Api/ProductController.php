<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * List semua produk - bisa dilihat publik (tanpa login), sesuai
     * permintaan agar landing page bisa dilihat sebelum login.
     */
    public function index()
    {
        return response()->json(
            Product::orderBy('category')->orderBy('name')->get()
        );
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }

    /**
     * Hanya admin yang bisa menambah produk baru.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'string'],
            'stock' => ['required', 'integer', 'min:0'],
            'category' => ['required', 'string'],
            'is_available' => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->all());

        return response()->json(['message' => 'Produk berhasil ditambahkan', 'product' => $product], 201);
    }

    /**
     * Hanya admin yang bisa mengubah produk (termasuk stok).
     */
    public function update(Request $request, Product $product)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'image' => ['nullable', 'string'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'category' => ['sometimes', 'string'],
            'is_available' => ['boolean'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $product->update($request->all());

        return response()->json(['message' => 'Produk berhasil diperbarui', 'product' => $product]);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus']);
    }
}
