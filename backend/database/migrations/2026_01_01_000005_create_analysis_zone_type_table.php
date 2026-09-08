<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Pivot: an analysis can match several zone types at once (OB + FVG + OTE + BOS...)
    public function up(): void
    {
        Schema::create('analysis_zone_type', function (Blueprint $table) {
            $table->foreignId('analysis_id')->constrained()->cascadeOnDelete();
            $table->foreignId('zone_type_id')->constrained()->cascadeOnDelete();
            $table->primary(['analysis_id', 'zone_type_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analysis_zone_type');
    }
};
