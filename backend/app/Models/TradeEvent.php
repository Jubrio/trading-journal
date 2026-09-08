<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TradeEvent extends Model
{
    use HasFactory;

    protected $fillable = ['trade_id', 'occurred_at', 'type', 'description'];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    public function trade(): BelongsTo
    {
        return $this->belongsTo(Trade::class);
    }
}
