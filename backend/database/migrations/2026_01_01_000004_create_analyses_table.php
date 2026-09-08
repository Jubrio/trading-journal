<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Fiche d'analyse — created for every setup found, whether or not it is traded.
    public function up(): void
    {
        Schema::create('analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trading_account_id')->constrained()->cascadeOnDelete();
            $table->string('symbol', 16);
            $table->date('analysis_date');
            $table->time('analysis_time');

            $table->enum('session', ['asia', 'london', 'new_york'])->nullable();
            $table->string('killzone', 64)->nullable();

            $table->string('zone_timeframe', 8); // M1, M5, M15, M30, H1, H4, D1
            $table->string('entry_method', 64);  // Fibo OTE, cloture FVG, retest OB...

            $table->decimal('entry_distance_pips', 8, 1)->nullable(); // distance prix actuel -> entree
            $table->decimal('planned_sl_pips', 8, 1);
            $table->decimal('planned_tp_pips', 8, 1);
            // planned_rr is stored (not DB-generated, for Postgres/MySQL portability) and
            // recomputed in the Analysis model's saving() hook: tp_pips / sl_pips.
            $table->decimal('planned_rr', 6, 2)->nullable();

            $table->decimal('missed_distance_pips', 8, 1)->nullable();
            $table->enum('hypothetical_result', ['tp', 'sl', 'be', 'no_move', 'other'])->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['trading_account_id', 'analysis_date']);
            $table->index('symbol');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analyses');
    }
};
