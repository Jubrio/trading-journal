<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Analysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'trading_account_id', 'symbol', 'analysis_date', 'analysis_time',
        'session', 'killzone', 'zone_timeframe', 'entry_method',
        'entry_distance_pips', 'planned_sl_pips', 'planned_tp_pips', 'planned_rr',
        'missed_distance_pips', 'hypothetical_result', 'notes',
    ];

    protected $casts = [
        'analysis_date' => 'date',
        'entry_distance_pips' => 'decimal:1',
        'planned_sl_pips' => 'decimal:1',
        'planned_tp_pips' => 'decimal:1',
        'planned_rr' => 'decimal:2',
        'missed_distance_pips' => 'decimal:1',
    ];

    protected static function booted(): void
    {
        // Keep planned_rr consistent with planned_tp_pips / planned_sl_pips whenever either changes.
        static::saving(function (Analysis $analysis) {
            if ($analysis->planned_sl_pips > 0) {
                $analysis->planned_rr = round($analysis->planned_tp_pips / $analysis->planned_sl_pips, 2);
            }
        });
    }

    public function tradingAccount(): BelongsTo
    {
        return $this->belongsTo(TradingAccount::class);
    }

    public function trade(): HasOne
    {
        return $this->hasOne(Trade::class);
    }

    public function marketContext(): HasOne
    {
        return $this->hasOne(MarketContext::class);
    }

    public function screenshots(): HasMany
    {
        return $this->hasMany(Screenshot::class);
    }

    public function zoneTypes(): BelongsToMany
    {
        return $this->belongsToMany(ZoneType::class, 'analysis_zone_type');
    }

    public function tradingSetups(): BelongsToMany
    {
        return $this->belongsToMany(TradingSetup::class, 'analysis_trading_setup');
    }

    // A trade only counts toward real performance once it was actually activated.
    public function scopeActivated($query)
    {
        return $query->whereHas('trade', fn ($q) => $q->where('activated', true));
    }

    // Analyses whose setup was valid but never triggered — the "missed opportunities" bucket.
    public function scopeMissed($query)
    {
        return $query->whereDoesntHave('trade', fn ($q) => $q->where('activated', true));
    }
}
