<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi ini dipakai agar frontend React (berjalan di domain/port
    | berbeda, misal http://localhost:5173 atau domain Vercel) bisa mengakses
    | API Laravel ini. Sesuaikan 'allowed_origins' dengan domain frontend
    | kamu saat deploy (contoh: https://seblak-kamu.vercel.app).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
         'https://web-seblak-nusantara-heat.vercel.app'  
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
