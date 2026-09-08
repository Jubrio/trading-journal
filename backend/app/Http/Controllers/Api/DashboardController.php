<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Analysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    // Global summary: real performance vs missed opportunities, kept strictly separate
    // (see spec point 7) so stats never conflate what happened with what could have happened.
    public function summary(Request $request)
    {
        $accountId = $request->trading_account_id;

        $activated = Analysis::activated()
            ->when($accountId, fn ($q) => $q->where('trading_account_id', $accountId))
            ->with('trade')
            ->get()
            ->pluck('trade');

        $missed = Analysis::missed()
            ->when($accountId, fn ($q) => $q->where('trading_account_id', $accountId))
            ->get();

        $wins = $activated->where('result_type', 'tp')->count();
        $losses = $activated->where('result_type', 'sl')->count();
        $totalClosed = $activated->whereNotNull('result_type')->count();

        return response()->json([
            'real_performance' => [
                'trades' => $activated->count(),
                'win_rate' => $totalClosed ? round($wins / $totalClosed * 100, 1) : null,
                'net_r' => round($activated->sum('result_r'), 2),
                'avg_rr_planned' => round($activated->count()
                    ? $activated->avg(fn ($t) => optional($t->analysis)->planned_rr)
                    : 0, 2),
            ],
            'missed_opportunities' => [
                'analyses' => $missed->count(),
                // hypothetical_result 'tp' assumed to have hit planned_rr; a naive but explicit estimate.
                'potential_r' => round($missed->where('hypothetical_result', 'tp')->sum('planned_rr'), 2)
                    - round($missed->where('hypothetical_result', 'sl')->count(), 2),
            ],
        ]);
    }

    // Groups closed trades by the combination of setup ingredients (OTE+FVG+BOS, OB seul, ...)
    // so the user can see which confluence actually has positive expectancy.
    public function performanceBySetup(Request $request)
    {
        $rows = DB::table('trades')
            ->join('analyses', 'analyses.id', '=', 'trades.analysis_id')
            ->join('analysis_trading_setup', 'analysis_trading_setup.analysis_id', '=', 'analyses.id')
            ->join('trading_setups', 'trading_setups.id', '=', 'analysis_trading_setup.trading_setup_id')
            ->where('trades.activated', true)
            ->whereNotNull('trades.result_type')
            ->when($request->trading_account_id, fn ($q, $v) => $q->where('analyses.trading_account_id', $v))
            ->select(
                'analyses.id as analysis_id',
                'trades.result_type',
                'trades.result_r',
                DB::raw("GROUP_CONCAT(trading_setups.code ORDER BY trading_setups.code SEPARATOR '+') as combo")
            )
            ->groupBy('analyses.id', 'trades.result_type', 'trades.result_r')
            ->get()
            ->groupBy('combo')
            ->map(function ($group) {
                $wins = $group->where('result_type', 'tp')->count();
                $total = $group->count();

                return [
                    'trades' => $total,
                    'win_rate' => $total ? round($wins / $total * 100, 1) : 0,
                    'avg_rr' => round($group->avg('result_r'), 2),
                    'expectancy_r' => round($group->avg('result_r'), 2),
                ];
            });

        return response()->json($rows);
    }

    // Cumulative R over time, for the equity curve chart.
    public function equityCurve(Request $request)
    {
        $points = DB::table('trades')
            ->join('analyses', 'analyses.id', '=', 'trades.analysis_id')
            ->where('trades.activated', true)
            ->whereNotNull('trades.exit_time')
            ->when($request->trading_account_id, fn ($q, $v) => $q->where('analyses.trading_account_id', $v))
            ->orderBy('trades.exit_time')
            ->select('trades.exit_time', 'trades.result_r')
            ->get();

        $cumulative = 0;
        $curve = $points->map(function ($p) use (&$cumulative) {
            $cumulative += (float) $p->result_r;

            return ['date' => $p->exit_time, 'cumulative_r' => round($cumulative, 2)];
        });

        return response()->json($curve);
    }
}
