<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Analysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'trading_account_id',
        'symbol',
        'analysis_date',
        'analysis_time',
        'session',
        'killzone',
        'zone_timeframe',
        'entry_method',
        'entry_distance_pips',
        'planned_sl_pips',
        'planned_tp_pips',
        'planned_rr',
        'missed_distance_pips',
        'hypothetical_result',
        'notes',
    ];

    protected $casts = [
        'analysis_date' => 'date',
        'entry_distance_pips' => 'float',
        'planned_sl_pips' => 'float',
        'planned_tp_pips' => 'float',
        'planned_rr' => 'float',
        'missed_distance_pips' => 'float',
    ];

    /* ------------------------------------------------------------------
     |  Relations
     | ------------------------------------------------------------------ */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tradingAccount()
    {
        return $this->belongsTo(TradingAccount::class);
    }

    public function zoneTypes()
    {
        return $this->belongsToMany(ZoneType::class, 'analysis_zone_type');
    }

    public function tradingSetups()
    {
        return $this->belongsToMany(TradingSetup::class, 'analysis_trading_setup');
    }

    public function marketContext()
    {
        return $this->hasOne(MarketContext::class);
    }

    public function trade()
    {
        return $this->hasOne(Trade::class);
    }

    public function screenshots()
    {
        return $this->hasMany(Screenshot::class);
    }

    public function tradeEvents()
    {
        return $this->hasManyThrough(TradeEvent::class, Trade::class);
    }

    /* ------------------------------------------------------------------
     |  Accessors / helpers
     | ------------------------------------------------------------------ */

    /**
     * Indique si un trade a réellement été activé pour cette analyse.
     */
    public function getIsActivatedAttribute(): bool
    {
        return (bool) ($this->trade?->activated ?? false);
    }
}