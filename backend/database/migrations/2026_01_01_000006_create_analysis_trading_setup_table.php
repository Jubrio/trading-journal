<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Pivot: which setup ingredients (OB, FVG, OTE, BOS, CHoCH, Liquidity Sweep, Confluence)
    // made up this analysis, so the dashboard can group performance by combination.
    public function up(): void
    {
        Schema::create('analysis_trading_setup', function (Blueprint $table) {
            $table->foreignId('analysis_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trading_setup_id')->constrained()->cascadeOnDelete();
            $table->primary(['analysis_id', 'trading_setup_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analysis_trading_setup');
    }
};
