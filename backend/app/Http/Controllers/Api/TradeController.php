<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Analysis;
use App\Models\Trade;
use Illuminate\Http\Request;

class TradeController extends Controller
{
    // A trade is always created from an existing analysis (see 7. in the spec:
    // an analysis can exist without ever becoming a trade).
    public function store(Request $request, Analysis $analysis)
    {
        $data = $request->validate([
            'activated' => ['required', 'boolean'],
            'activation_time' => ['nullable', 'date'],
            'entry_price' => ['nullable', 'numeric'],
            'sl_price' => ['nullable', 'numeric'],
            'tp_price' => ['nullable', 'numeric'],
        ]);

        $trade = $analysis->trade()->create($data);

        return response()->json($trade, 201);
    }

    public function update(Request $request, Trade $trade)
    {
        $data = $request->validate([
            'mae_pips' => ['nullable', 'numeric'],
            'mfe_pips' => ['nullable', 'numeric'],
            'be_touched' => ['boolean'],
            'be_time' => ['nullable', 'date'],
            'result_type' => ['nullable', 'in:tp,sl,be,manual_close'],
            'result_pips' => ['nullable', 'numeric'],
            'result_usd' => ['nullable', 'numeric'],
            'result_r' => ['nullable', 'numeric'],
            'exit_time' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $trade->update($data);

        return response()->json($trade);
    }
}
