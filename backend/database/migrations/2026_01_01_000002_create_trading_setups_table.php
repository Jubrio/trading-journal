<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Setup components: OB, FVG, OTE, BOS, CHoCH, Liquidity Sweep, Confluence...
    // Stored as a lookup table so stats can be grouped by combination (analysis_setup pivot).
    public function up(): void
    {
        Schema::create('trading_setups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('code');   // OB, FVG, OTE, BOS, CHoCH, LIQUIDITY_SWEEP, CONFLUENCE...
            $table->string('label');  // Order Block, Fair Value Gap...
            $table->string('color', 16)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trading_setups');
    }
};
