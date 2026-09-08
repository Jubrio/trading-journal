<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ZoneType extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'code', 'label'];

    public function analyses(): BelongsToMany
    {
        return $this->belongsToMany(Analysis::class, 'analysis_zone_type');
    }
}
