<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('market_contexts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('analysis_id')->unique()->constrained()->cascadeOnDelete();

            $table->boolean('major_news')->default(false);
            $table->string('news_name')->nullable();
            $table->enum('news_impact', ['low', 'medium', 'high'])->nullable();
            $table->time('news_time')->nullable();

            $table->enum('volatility', ['low', 'normal', 'high', 'extreme'])->nullable();
            $table->enum('market_direction', ['bullish', 'bearish', 'range'])->nullable();
            $table->enum('phase', ['trend', 'accumulation', 'manipulation', 'distribution', 'expansion'])->nullable();

            $table->unsignedSmallInteger('trades_before')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_contexts');
    }
};
