<?php

use App\Http\Controllers\Api\AnalysisController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TradeController;
use Illuminate\Support\Facades\Route;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('analyses', AnalysisController::class);

    Route::post('analyses/{analysis}/trade', [TradeController::class, 'store']);
    Route::patch('trades/{trade}', [TradeController::class, 'update']);

    Route::get('dashboard/summary', [DashboardController::class, 'summary']);
    Route::get('dashboard/performance-by-setup', [DashboardController::class, 'performanceBySetup']);
    Route::get('dashboard/equity-curve', [DashboardController::class, 'equityCurve']);
});