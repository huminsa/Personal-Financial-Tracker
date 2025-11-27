<?php
// routes/api.php

use App\Http\Controllers\Api\TransactionApiController;
use App\Http\Controllers\Api\ReportApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    // Transaction API
    Route::get('/transactions', [TransactionApiController::class, 'index']);
    Route::post('/transactions', [TransactionApiController::class, 'store']);
    Route::get('/transactions/{transaction}', [TransactionApiController::class, 'show']);
    Route::put('/transactions/{transaction}', [TransactionApiController::class, 'update']);
    Route::delete('/transactions/{transaction}', [TransactionApiController::class, 'destroy']);
    
    // Reports API
    Route::get('/reports/expense-by-category', [ReportApiController::class, 'expenseByCategory']);
    Route::get('/reports/income-vs-expense', [ReportApiController::class, 'incomeVsExpense']);
    Route::get('/reports/net-worth-history', [ReportApiController::class, 'netWorthHistory']);
    Route::get('/reports/budget-vs-actual', [ReportApiController::class, 'budgetVsActual']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});