<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Akun admin default (aman dijalankan berkali-kali, gak akan duplikat)
        User::firstOrCreate(
            ['email' => 'admin@seblak.test'],
            [
                'name' => 'Admin Seblak',
                'no_hp' => '081200000000',
                'alamat' => 'Kantor Pusat Seblak Nusantara Heat',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        // Akun pelanggan contoh
        User::firstOrCreate(
            ['email' => 'pelanggan@seblak.test'],
            [
                'name' => 'Pelanggan Contoh',
                'no_hp' => '081211112222',
                'alamat' => 'Jl. Contoh No. 1, Palembang',
                'password' => Hash::make('password123'),
                'role' => 'customer',
            ]
        );

        // Menu seblak
        $products = [
            [
                'name' => 'Seblak Original',
                'description' => 'Kerupuk kenyal dengan bumbu rempah khas, telur, dan sosis.',
                'price' => 15000,
                'stock' => 50,
                'category' => 'seblak',
                'image' => '/img/SeblakOriginal.jpg',
            ],
            [
                'name' => 'Seblak Ceker',
                'description' => 'Seblak original ditambah ceker ayam empuk pedas menggigit.',
                'price' => 20000,
                'stock' => 40,
                'category' => 'seblak',
                'image' => '/img/SeblakCeker.jpg',
            ],
            [
                'name' => 'Seblak Mie',
                'description' => 'Perpaduan kerupuk dan mie kuning dengan kuah pedas gurih.',
                'price' => 18000,
                'stock' => 45,
                'category' => 'seblak',
                'image' => '/img/SeblakMie.jpg',
            ],
            [
                'name' => 'Seblak Seafood',
                'description' => 'Seblak dengan topping udang, bakso ikan, dan cumi segar.',
                'price' => 25000,
                'stock' => 30,
                'category' => 'seblak',
                'image' => '/img/SeblakSeafood.jpg',
            ],
            [
                'name' => 'Seblak Kwetiau',
                'description' => 'Kwetiau kenyal dipadukan bumbu seblak pedas beraroma bawang.',
                'price' => 19000,
                'stock' => 35,
                'category' => 'seblak',
                'image' => '/img/SeblakKwetiau.jpg',
            ],
            [
                'name' => 'Es Teh Manis',
                'description' => 'Penyeimbang rasa pedas, segar dan manis pas.',
                'price' => 5000,
                'stock' => 100,
                'category' => 'minuman',
                'image' => '/img/EsTehManis.jpg',
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['name' => $product['name']],
                $product
            );
        }

        // Bahan baku
        $ingredients = [
            ['name' => 'Kerupuk Mentah', 'unit' => 'kg', 'stock_quantity' => 25, 'min_threshold' => 5],
            ['name' => 'Ceker Ayam', 'unit' => 'kg', 'stock_quantity' => 10, 'min_threshold' => 3],
            ['name' => 'Mie Kuning', 'unit' => 'kg', 'stock_quantity' => 15, 'min_threshold' => 4],
            ['name' => 'Cabai Rawit', 'unit' => 'kg', 'stock_quantity' => 8, 'min_threshold' => 2],
            ['name' => 'Bawang Putih', 'unit' => 'kg', 'stock_quantity' => 6, 'min_threshold' => 2],
            ['name' => 'Kencur', 'unit' => 'kg', 'stock_quantity' => 3, 'min_threshold' => 1],
            ['name' => 'Telur Ayam', 'unit' => 'butir', 'stock_quantity' => 120, 'min_threshold' => 20],
            ['name' => 'Sosis', 'unit' => 'pcs', 'stock_quantity' => 60, 'min_threshold' => 15],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::firstOrCreate(
                ['name' => $ingredient['name']],
                $ingredient
            );
        }
    }
}