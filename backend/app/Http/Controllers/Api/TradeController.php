<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trade;
use App\Models\Analysis;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TradeController extends Controller
{
    public function store(Request $request, Analysis $analysis)
    {
        abort_unless($analysis->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'activated' => ['required', 'boolean'],
            'activation_time' => ['nullable', 'date'],
            'entry_price' => ['nullable', 'numeric'],
            'sl_price' => ['nullable', 'numeric'],
            'tp_price' => ['nullable', 'numeric'],
            'mae' => ['nullable', 'numeric'],
            'mfe' => ['nullable', 'numeric'],
            'be_touched' => ['boolean'],
            'be_time' => ['nullable', 'date'],
            'exit_price' => ['nullable', 'numeric'],
            'exit_time' => ['nullable', 'date'],
            'result_type' => ['nullable', Rule::in(['tp', 'sl', 'be', 'manual'])],
            'result_pips' => ['nullable', 'numeric'],
            'result_r' => ['nullable', 'numeric'],
            'result_usd' => ['nullable', 'numeric'],
            'duration_minutes' => ['nullable', 'integer'],
        ]);

        // Empêche d'avoir deux trades pour la même analyse
        $trade = $analysis->trade()->updateOrCreate(
            ['analysis_id' => $analysis->id],
            $data
        );

        return response()->json($trade, 201);
    }

    public function update(Request $request, Trade $trade)
    {
        abort_unless($trade->analysis->user_id === $request->user()->id, 403);

        $data = $request->validate([
            'activated' => ['sometimes', 'boolean'],
            'activation_time' => ['nullable', 'date'],
            'entry_price' => ['nullable', 'numeric'],
            'sl_price' => ['nullable', 'numeric'],
            'tp_price' => ['nullable', 'numeric'],
            'mae' => ['nullable', 'numeric'],
            'mfe' => ['nullable', 'numeric'],
            'be_touched' => ['sometimes', 'boolean'],
            'be_time' => ['nullable', 'date'],
            'exit_price' => ['nullable', 'numeric'],
            'exit_time' => ['nullable', 'date'],
            'result_type' => ['nullable', Rule::in(['tp', 'sl', 'be', 'manual'])],
            'result_pips' => ['nullable', 'numeric'],
            'result_r' => ['nullable', 'numeric'],
            'result_usd' => ['nullable', 'numeric'],
            'duration_minutes' => ['nullable', 'integer'],
        ]);

        $trade->update($data);

        return response()->json($trade->fresh());
    }
}