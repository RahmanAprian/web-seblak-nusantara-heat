<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IngredientController extends Controller
{
    public function index()
    {
        return response()->json(Ingredient::orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', 'string', 'max:20'],
            'stock_quantity' => ['required', 'numeric', 'min:0'],
            'min_threshold' => ['required', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $ingredient = Ingredient::create($request->all());

        return response()->json(['message' => 'Bahan baku berhasil ditambahkan', 'ingredient' => $ingredient], 201);
    }

    public function update(Request $request, Ingredient $ingredient)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'unit' => ['sometimes', 'string', 'max:20'],
            'stock_quantity' => ['sometimes', 'numeric', 'min:0'],
            'min_threshold' => ['sometimes', 'numeric', 'min:0'],
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $validator->errors()], 422);
        }

        $ingredient->update($request->all());

        return response()->json(['message' => 'Stok bahan baku berhasil diperbarui', 'ingredient' => $ingredient]);
    }

    public function destroy(Ingredient $ingredient)
    {
        $ingredient->delete();

        return response()->json(['message' => 'Bahan baku berhasil dihapus']);
    }
}
