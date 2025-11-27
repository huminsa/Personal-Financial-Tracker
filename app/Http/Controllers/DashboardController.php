<?php
// app/Http/Controllers/DashboardController.php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\Budget;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display dashboard with financial overview
     */
   public function index()
    {
        $user = auth()->user();
        $now = now();

        // Monthly stats
        $currentMonthIncome = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereMonth('transaction_date', $now->month)
            ->whereYear('transaction_date', $now->year)
            ->sum('amount');

        $currentMonthExpense = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', $now->month)
            ->whereYear('transaction_date', $now->year)
            ->sum('amount');

        // Account balances - FIX: Pastikan ini ada
        $accounts = Account::where('user_id', $user->id)
            ->where('include_in_net_worth', true)
            ->get();

        $netWorth = $accounts->sum('balance');

        // Recent transactions
        $recentTransactions = Transaction::where('user_id', $user->id)
            ->with(['category', 'fromAccount', 'toAccount'])
            ->orderBy('transaction_date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        // Expense by category (current month)
        $expenseByCategory = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', $now->month)
            ->whereYear('transaction_date', $now->year)
            ->with('category')
            ->get()
            ->groupBy('category_id')
            ->map(function ($transactions, $categoryId) {
                $category = $transactions->first()->category;
                return [
                    'name' => $category->name,
                    'amount' => $transactions->sum('amount'),
                    'color' => $category->color,
                    'icon' => $category->icon
                ];
            })
            ->values();

        // Budget progress
        $budgets = Budget::where('user_id', $user->id)
            ->where('month', $now->month)
            ->where('year', $now->year)
            ->with('category')
            ->get()
            ->map(function ($budget) {
                $actual = Transaction::where('user_id', auth()->id())
                    ->where('category_id', $budget->category_id)
                    ->where('type', 'expense')
                    ->whereMonth('transaction_date', $budget->month)
                    ->whereYear('transaction_date', $budget->year)
                    ->sum('amount');

                return [
                    'category' => $budget->category->name,
                    'budget' => $budget->amount,
                    'actual' => $actual,
                    'progress' => $budget->amount > 0 ? min(($actual / $budget->amount) * 100, 100) : 0,
                    'status' => $actual > $budget->amount ? 'over' : 'under'
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => [
                'current_month_income' => $currentMonthIncome,
                'current_month_expense' => $currentMonthExpense,
                'net_worth' => $netWorth,
                'account_count' => $accounts->count(),
                'savings_rate' => $currentMonthIncome > 0 ? 
                    (($currentMonthIncome - $currentMonthExpense) / $currentMonthIncome) * 100 : 0,
            ],
            'accounts' => $accounts, // ← PASTIKAN INI ADA
            'recentTransactions' => $recentTransactions,
            'expenseByCategory' => $expenseByCategory,
            'budgets' => $budgets,
        ]);
    }
}