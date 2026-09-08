<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MarketContext extends Model
{
    use HasFactory;

    protected $fillable = [
        'analysis_id', 'major_news', 'news_name', 'news_impact', 'news_time',
        'volatility', 'market_direction', 'phase', 'trades_before', 'notes',
    ];

    protected $casts = [
        'major_news' => 'boolean',
    ];

    public function analysis(): BelongsTo
    {
        return $this->belongsTo(Analysis::class);
    }
}
