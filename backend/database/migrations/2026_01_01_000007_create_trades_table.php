<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // One-to-one with analyses: only created when the setup is actually activated.
    // Kept separate from `analyses` on purpose so "missed opportunity" stats never mix
    // with real executed performance (see README: Performance reelle vs Opportunites manquees).
    public function up(): void
    {
        Schema::create('trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('analysis_id')->unique()->constrained()->cascadeOnDelete();

            $table->boolean('activated')->default(false);
            $table->dateTime('activation_time')->nullable();

            $table->decimal('entry_price', 12, 5)->nullable();
            $table->decimal('sl_price', 12, 5)->nullable();
            $table->decimal('tp_price', 12, 5)->nullable();

            $table->decimal('mae_pips', 8, 1)->nullable(); // Maximum Adverse Excursion
            $table->decimal('mfe_pips', 8, 1)->nullable(); // Maximum Favorable Excursion

            $table->boolean('be_touched')->default(false);
            $table->dateTime('be_time')->nullable();

            $table->enum('result_type', ['tp', 'sl', 'be', 'manual_close'])->nullable();
            $table->decimal('result_pips', 8, 1)->nullable();
            $table->decimal('result_usd', 12, 2)->nullable();
            $table->decimal('result_r', 6, 2)->nullable(); // actual RR achieved

            $table->dateTime('exit_time')->nullable();
            $table->unsignedInteger('duration_seconds')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('activated');
            $table->index('result_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trades');
    }
};
