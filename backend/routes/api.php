<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Sistem Penjualan Seblak
|--------------------------------------------------------------------------
*/

// ---------- PUBLIK (bisa diakses tanpa login, termasuk landing page) ----------
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ---------- WAJIB LOGIN ----------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Pelanggan: checkout & riwayat pesanan
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // ---------- KHUSUS ADMIN ----------
    Route::middleware('admin')->group(function () {
        Route::get('/orders', [OrderController::class, 'index']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        Route::get('/ingredients', [IngredientController::class, 'index']);
        Route::post('/ingredients', [IngredientController::class, 'store']);
        Route::put('/ingredients/{ingredient}', [IngredientController::class, 'update']);
        Route::delete('/ingredients/{ingredient}', [IngredientController::class, 'destroy']);

        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    });
});
