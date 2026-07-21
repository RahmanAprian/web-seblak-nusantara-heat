<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'unit',
        'stock_quantity',
        'min_threshold',
    ];

    protected function casts(): array
    {
        return [
            'stock_quantity' => 'decimal:2',
            'min_threshold' => 'decimal:2',
        ];
    }

    public function isLow(): bool
    {
        return $this->stock_quantity <= $this->min_threshold;
    }
}
