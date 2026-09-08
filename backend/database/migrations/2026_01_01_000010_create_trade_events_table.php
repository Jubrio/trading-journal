<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Append-only timeline of what happened on a trade (BE moved, partial close, news hit...).
    // Powers a trade's history view without overloading the `trades` table with more columns.
    public function up(): void
    {
        Schema::create('trade_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trade_id')->constrained()->cascadeOnDelete();
            $table->dateTime('occurred_at');
            $table->string('type', 64); // be_moved, partial_close, news_spike, manual_note...
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trade_events');
    }
};
