<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trade extends Model
{
    use HasFactory;

    protected $fillable = [
        'analysis_id', 'activated', 'activation_time',
        'entry_price', 'sl_price', 'tp_price', 'mae_pips', 'mfe_pips',
        'be_touched', 'be_time', 'result_type', 'result_pips', 'result_usd',
        'result_r', 'exit_time', 'duration_seconds', 'notes',
    ];

    protected $casts = [
        'activated' => 'boolean',
        'be_touched' => 'boolean',
        'activation_time' => 'datetime',
        'be_time' => 'datetime',
        'exit_time' => 'datetime',
        'entry_price' => 'decimal:5',
        'sl_price' => 'decimal:5',
        'tp_price' => 'decimal:5',
        'result_r' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function (Trade $trade) {
            if ($trade->activation_time && $trade->exit_time) {
                $trade->duration_seconds = $trade->activation_time->diffInSeconds($trade->exit_time);
            }
        });
    }

    public function analysis(): BelongsTo
    {
        return $this->belongsTo(Analysis::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(TradeEvent::class);
    }

    public function screenshots(): HasMany
    {
        return $this->hasMany(Screenshot::class);
    }
}
