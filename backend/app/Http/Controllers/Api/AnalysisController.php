<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Analysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AnalysisController extends Controller
{
    public function index(Request $request)
    {
        $analyses = Analysis::query()
            ->where('user_id', $request->user()->id)   // ← isolation
            ->with(['zoneTypes', 'tradingSetups', 'marketContext', 'trade'])
            ->latest('analysis_date')
            ->get();

        return response()->json($analyses);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'symbol' => ['required', 'string', 'max:20'],
            'analysis_date' => ['required', 'date'],
            'analysis_time' => ['nullable', 'string'],
            'session' => ['nullable', Rule::in(['asia', 'london', 'new_york'])],
            'killzone' => ['nullable', 'string'],
            'zone_timeframe' => ['required', 'string'],
            'entry_method' => ['required', 'string'],
            'entry_distance_pips' => ['nullable', 'numeric'],
            'planned_sl_pips' => ['required', 'numeric'],
            'planned_tp_pips' => ['required', 'numeric'],
            'planned_rr' => ['nullable', 'numeric'],
            'missed_distance_pips' => ['nullable', 'numeric'],
            'hypothetical_result' => ['nullable', Rule::in(['tp', 'sl', 'be', 'none'])],
            'notes' => ['nullable', 'string'],
            'trading_account_id' => ['required', 'exists:trading_accounts,id'],
            'zone_type_ids' => ['required', 'array', 'min:1'],
            'zone_type_ids.*' => ['exists:zone_types,id'],
            'trading_setup_ids' => ['nullable', 'array'],
            'trading_setup_ids.*' => ['exists:trading_setups,id'],
            'market_context' => ['nullable', 'array'],
        ]);

        // Sécurité : le compte de trading doit appartenir à l'utilisateur
        $accountBelongsToUser = $request->user()
            ->tradingAccounts()
            ->whereKey($data['trading_account_id'])
            ->exists();

        abort_unless($accountBelongsToUser, 403, 'Compte de trading invalide.');

        return DB::transaction(function () use ($data, $request) {
            $analysis = $request->user()->analyses()->create([
                'trading_account_id' => $data['trading_account_id'],
                'symbol' => $data['symbol'],
                'analysis_date' => $data['analysis_date'],
                'analysis_time' => $data['analysis_time'] ?? null,
                'session' => $data['session'] ?? null,
                'killzone' => $data['killzone'] ?? null,
                'zone_timeframe' => $data['zone_timeframe'],
                'entry_method' => $data['entry_method'],
                'entry_distance_pips' => $data['entry_distance_pips'] ?? null,
                'planned_sl_pips' => $data['planned_sl_pips'],
                'planned_tp_pips' => $data['planned_tp_pips'],
                'planned_rr' => $data['planned_rr'] ?? null,
                'missed_distance_pips' => $data['missed_distance_pips'] ?? null,
                'hypothetical_result' => $data['hypothetical_result'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            $analysis->zoneTypes()->sync($data['zone_type_ids']);
            $analysis->tradingSetups()->sync($data['trading_setup_ids'] ?? []);

            if (!empty($data['market_context'])) {
                $analysis->marketContext()->create($data['market_context']);
            }

            return response()->json(
                $analysis->load(['zoneTypes', 'tradingSetups', 'marketContext', 'trade']),
                201
            );
        });
    }

    public function show(Request $request, Analysis $analysis)
    {
        abort_unless($analysis->user_id === $request->user()->id, 403);

        return response()->json(
            $analysis->load(['zoneTypes', 'tradingSetups', 'marketContext', 'trade', 'screenshots'])
        );
    }

    public function update(Request $request, Analysis $analysis)
    {
        abort_unless($analysis->user_id === $request->user()->id, 403);

        // ... (même logique de validation que store, à adapter)
        $analysis->update($request->all());

        return response()->json($analysis->fresh());
    }

    public function destroy(Request $request, Analysis $analysis)
    {
        abort_unless($analysis->user_id === $request->user()->id, 403);

        $analysis->delete();

        return response()->json(null, 204);
    }
}