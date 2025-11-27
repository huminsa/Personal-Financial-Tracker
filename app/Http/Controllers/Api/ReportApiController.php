<?php
// app/Http/Controllers/Api/ReportApiController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Account;
use App\Models\Budget;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportApiController extends Controller
{
    public function expenseByCategory(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());

        $expenses = Transaction::where('user_id', auth()->id())
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->with('category')
            ->get()
            ->groupBy('category_id')
            ->map(function ($transactions, $categoryId) {
                $category = $transactions->first()->category;
                return [
                    'name' => $category->name,
                    'amount' => $transactions->sum('amount'),
                    'color' => $category->color,
                    'icon' => $category->icon,
                    'count' => $transactions->count()
                ];
            })
            ->values()
            ->sortByDesc('amount')
            ->values();

        return response()->json([
            'data' => $expenses,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }

    public function incomeVsExpense(Request $request)
    {
        $year = $request->get('year', now()->year);
        
        $data = [];
        for ($month = 1; $month <= 12; $month++) {
            $income = Transaction::where('user_id', auth()->id())
                ->where('type', 'income')
                ->whereYear('transaction_date', $year)
                ->whereMonth('transaction_date', $month)
                ->sum('amount');

            $expense = Transaction::where('user_id', auth()->id())
                ->where('type', 'expense')
                ->whereYear('transaction_date', $year)
                ->whereMonth('transaction_date', $month)
                ->sum('amount');

            $data[] = [
                'month' => $month,
                'month_name' => Carbon::create()->month($month)->format('M'),
                'income' => $income,
                'expense' => $expense,
                'savings' => $income - $expense
            ];
        }

        return response()->json([
            'year' => $year,
            'data' => $data
        ]);
    }

    public function netWorthHistory(Request $request)
    {
        $months = $request->get('months', 12);
        $endDate = now();
        $startDate = now()->subMonths($months - 1)->startOfMonth();

        $history = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $assets = Account::where('user_id', auth()->id())
                ->where('include_in_net_worth', true)
                ->where('created_at', '<=', $currentDate->endOfMonth())
                ->get()
                ->sum('balance');

            // Untuk simplicity, kita asumsikan liabilities adalah credit card balances yang negative
            $liabilities = Account::where('user_id', auth()->id())
                ->where('type', 'credit_card')
                ->where('created_at', '<=', $currentDate->endOfMonth())
                ->get()
                ->sum('balance');

            $history[] = [
                'date' => $currentDate->format('Y-m-d'),
                'month' => $currentDate->format('M Y'),
                'assets' => $assets,
                'liabilities' => abs($liabilities), // Convert to positive for display
                'net_worth' => $assets + $liabilities // liabilities sudah negative
            ];

            $currentDate->addMonth();
        }

        return response()->json($history);
    }

    public function budgetVsActual(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $budgets = Budget::where('user_id', auth()->id())
            ->where('month', $month)
            ->where('year', $year)
            ->with('category')
            ->get()
            ->map(function ($budget) use ($month, $year) {
                $actual = Transaction::where('user_id', auth()->id())
                    ->where('category_id', $budget->category_id)
                    ->where('type', 'expense')
                    ->whereMonth('transaction_date', $month)
                    ->whereYear('transaction_date', $year)
                    ->sum('amount');

                return [
                    'category' => $budget->category->name,
                    'budget' => $budget->amount,
                    'actual' => $actual,
                    'difference' => $budget->amount - $actual,
                    'progress' => $budget->amount > 0 ? min(($actual / $budget->amount) * 100, 100) : 0,
                    'status' => $actual > $budget->amount ? 'over_budget' : 
                               ($actual == $budget->amount ? 'on_budget' : 'under_budget')
                ];
            });

        return response()->json([
            'month' => $month,
            'year' => $year,
            'data' => $budgets
        ]);
    }
}