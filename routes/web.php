<?php
// routes/web.php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Categories
    Route::resource('categories', CategoryController::class);
    Route::post('/categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
    
    // Accounts
    Route::resource('accounts', AccountController::class);
    Route::patch('/accounts/{account}/set-default', [AccountController::class, 'setDefault'])->name('accounts.set-default');
    Route::patch('/accounts/{account}/update-balance', [AccountController::class, 'updateBalance'])->name('accounts.update-balance');
    
    // Transactions
    Route::resource('transactions', TransactionController::class);
    Route::post('/transactions/quick-add', [TransactionController::class, 'quickAdd'])->name('transactions.quick-add');
    
    // Budgets
    Route::resource('budgets', BudgetController::class);
    Route::post('/budgets/copy-previous', [BudgetController::class, 'copyFromPrevious'])->name('budgets.copy-previous');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.delete');

        // routes/web.php - PASTIKAN ada routes terpisah:

    Route::get('/report', [ReportController::class, 'index'])->name('report.index');
    Route::get('/report/monthly-trends', [ReportController::class, 'monthlyTrends'])->name('report.monthly-trends');
    Route::get('/report/spending-category', [ReportController::class, 'spendingCategory'])->name('report.spending-category');
    Route::get('/report/budget-actuals', [ReportController::class, 'budgetActuals'])->name('report.budget-actuals');
    Route::get('/report/net-worth', [ReportController::class, 'netWorth'])->name('report.net-worth');
    Route::match(['get', 'post'], '/report/export', [ReportController::class, 'export'])->name('report.export');
    // Reports
    // Route::get('/report/index', [ReportController::class, 'index'])->name('report.index');
    // Route::get('/report/monthly-trends', [ReportController::class, 'monthlyTrends'])->name('report.monthly-trends');
    // Route::get('/report/spending-category', [ReportController::class, 'spendingCategory'])->name('report.spending-category');
    // Route::get('/report/budget-actuals', [ReportController::class, 'budgetActuals'])->name('report.budget-actuals');
    // Route::get('/report/net-worth', [ReportController::class, 'netWorth'])->name('report.net-worth');
    // // allow both GET and POST so direct links (GET) and programmatic exports (POST) work
    // Route::match(['get', 'post'], '/report/export', [ReportController::class, 'export'])->name('report.export');

});

require __DIR__.'/auth.php';