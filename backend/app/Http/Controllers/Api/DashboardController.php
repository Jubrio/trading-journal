<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Trade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;

        // Analyses de l'utilisateur
        $analysesQuery = $request->user()->analyses();

        // Trades de l'utilisateur uniquement (jointure via analyses)
        $tradesQuery = Trade::query()
            ->whereHas('analysis', fn ($q) => $q->where('user_id', $userId));

        $totalAnalyses = (clone $analysesQuery)->count();
        $totalTrades = (clone $tradesQuery)->where('activated', true)->count();

        // Win rate : parmi les trades activés ET clôturés
        $closedTrades = (clone $tradesQuery)
            ->where('activated', true)
            ->whereNotNull('result_type')
            ->get();

        $wins = $closedTrades->where('result_type', 'tp')->count();
        $losses = $closedTrades->where('result_type', 'sl')->count();
        $decided = $wins + $losses;

        $winRate = $decided > 0 ? round(($wins / $decided) * 100, 1) : 0.0;

        // R net réel (sur trades activés + clôturés)
        $realR = $closedTrades->sum(fn ($t) => (float) ($t->result_r ?? 0));

        // Opportunités manquées : analyses non activées avec résultat hypothétique
        $missedR = $request->user()->analyses()
            ->whereDoesntHave('trade', fn ($q) => $q->where('activated', true))
            ->whereNotNull('hypothetical_result')
            ->get()
            ->sum(function ($analysis) {
                $rr = (float) ($analysis->planned_rr ?? 0);
                return match ($analysis->hypothetical_result) {
                    'tp' => $rr,
                    'sl' => -1.0,
                    default => 0.0,
                };
            });

        // RR moyen (trades activés + clôturés, sur result_r absolu des wins)
        $avgR = $closedTrades->count() > 0
            ? round($closedTrades->avg('result_r'), 2)
            : 0.0;

        // Profit / perte en R
        $profitR = $closedTrades->where('result_r', '>', 0)->sum('result_r');
        $lossR = $closedTrades->where('result_r', '<', 0)->sum('result_r');

        return response()->json([
            'total_analyses' => $totalAnalyses,
            'total_trades' => $totalTrades,               // ← nouveau : nombre de trades pris
            'win_rate' => $winRate,
            'avg_rr' => $avgR,
            'profit_r' => round($profitR, 2),
            'loss_r' => round($lossR, 2),
            'net_r' => round($realR, 2),
            'missed_r' => round($missedR, 2),
        ]);
    }

    public function performanceBySetup(Request $request)
    {
        $userId = $request->user()->id;

        // PostgreSQL : STRING_AGG au lieu de GROUP_CONCAT
        $rows = DB::table('analyses')
            ->join('analysis_zone_type', 'analyses.id', '=', 'analysis_zone_type.analysis_id')
            ->join('zone_types', 'zone_types.id', '=', 'analysis_zone_type.zone_type_id')
            ->join('trades', 'trades.analysis_id', '=', 'analyses.id')
            ->where('analyses.user_id', $userId)
            ->where('trades.activated', true)
            ->whereNotNull('trades.result_type')
            ->groupBy('analyses.id')
            ->select([
                'analyses.id',
                DB::raw("STRING_AGG(zone_types.code, '+' ORDER BY zone_types.code) as setup_combo"),
                'trades.result_type',
                'trades.result_r',
            ])
            ->get();

        // Regroupe par combinaison
        $grouped = $rows->groupBy('setup_combo')->map(function ($group, $combo) {
            $wins = $group->where('result_type', 'tp')->count();
            $losses = $group->where('result_type', 'sl')->count();
            $decided = $wins + $losses;
            $winRate = $decided > 0 ? round(($wins / $decided) * 100, 1) : 0;
            $avgR = $group->count() > 0 ? round($group->avg('result_r'), 2) : 0;

            // Expectancy = (winRate% * avgWinR) - (lossRate% * avgLossR)
            $winR = $group->where('result_r', '>', 0)->avg('result_r') ?? 0;
            $lossR = abs($group->where('result_r', '<', 0)->avg('result_r') ?? 0);
            $expectancy = round(
                ($winRate / 100) * $winR - (1 - $winRate / 100) * $lossR,
                2
            );

            return [
                'setup' => $combo,
                'trades' => $group->count(),
                'win_rate' => $winRate,
                'avg_rr' => $avgR,
                'expectancy' => $expectancy,
            ];
        })->values();

        return response()->json($grouped);
    }

    public function equityCurve(Request $request)
    {
        $userId = $request->user()->id;

        $trades = Trade::query()
            ->whereHas('analysis', fn ($q) => $q->where('user_id', $userId))
            ->where('activated', true)
            ->whereNotNull('result_r')
            ->orderBy('exit_time')
            ->get(['exit_time', 'result_r']);

        $cumulative = 0;
        $curve = $trades->map(function ($trade) use (&$cumulative) {
            $cumulative += (float) $trade->result_r;
            return [
                'date' => $trade->exit_time,
                'cumulative_r' => round($cumulative, 2),
            ];
        });

        return response()->json($curve);
    }
}