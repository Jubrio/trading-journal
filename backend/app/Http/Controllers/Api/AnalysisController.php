<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Analysis;
use Illuminate\Http\Request;

class AnalysisController extends Controller
{
    public function index(Request $request)
    {
        $analyses = Analysis::query()
            ->with(['trade', 'marketContext', 'zoneTypes', 'tradingSetups'])
            ->when($request->symbol, fn ($q, $v) => $q->where('symbol', $v))
            ->when($request->session, fn ($q, $v) => $q->where('session', $v))
            ->when($request->from, fn ($q, $v) => $q->whereDate('analysis_date', '>=', $v))
            ->when($request->to, fn ($q, $v) => $q->whereDate('analysis_date', '<=', $v))
            ->latest('analysis_date')
            ->latest('analysis_time')
            ->paginate(25);

        return response()->json($analyses);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'trading_account_id' => ['required', 'exists:trading_accounts,id'],
            'symbol' => ['required', 'string', 'max:16'],
            'analysis_date' => ['required', 'date'],
            'analysis_time' => ['required'],
            'session' => ['nullable', 'in:asia,london,new_york'],
            'killzone' => ['nullable', 'string', 'max:64'],
            'zone_timeframe' => ['required', 'string', 'max:8'],
            'entry_method' => ['required', 'string', 'max:64'],
            'entry_distance_pips' => ['nullable', 'numeric'],
            'planned_sl_pips' => ['required', 'numeric', 'min:0'],
            'planned_tp_pips' => ['required', 'numeric', 'min:0'],
            'missed_distance_pips' => ['nullable', 'numeric'],
            'hypothetical_result' => ['nullable', 'in:tp,sl,be,no_move,other'],
            'notes' => ['nullable', 'string'],
            'zone_type_ids' => ['array'],
            'zone_type_ids.*' => ['exists:zone_types,id'],
            'trading_setup_ids' => ['array'],
            'trading_setup_ids.*' => ['exists:trading_setups,id'],
        ]);

        $analysis = Analysis::create($data);
        $analysis->zoneTypes()->sync($data['zone_type_ids'] ?? []);
        $analysis->tradingSetups()->sync($data['trading_setup_ids'] ?? []);

        return response()->json($analysis->load(['zoneTypes', 'tradingSetups']), 201);
    }

    public function show(Analysis $analysis)
    {
        return response()->json(
            $analysis->load(['trade.events', 'marketContext', 'zoneTypes', 'tradingSetups', 'screenshots'])
        );
    }

    public function update(Request $request, Analysis $analysis)
    {
        $data = $request->validate([
            'symbol' => ['sometimes', 'string', 'max:16'],
            'planned_sl_pips' => ['sometimes', 'numeric', 'min:0'],
            'planned_tp_pips' => ['sometimes', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            // ...same optional fields as store()
        ]);

        $analysis->update($data);

        return response()->json($analysis);
    }

    public function destroy(Analysis $analysis)
    {
        $analysis->delete();

        return response()->json(null, 204);
    }
}
