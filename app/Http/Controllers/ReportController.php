<?php
namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Account;
use App\Models\Budget;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf; // Jika menggunakan DomPDF
use Maatwebsite\Excel\Facades\Excel; // Pastikan ini ada
use App\Exports\ReportsExport;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ReportController extends Controller
{   
    use AuthorizesRequests;
    /**
     * Display reports dashboard
     */
    
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());
        $reportType = $request->get('type', 'overview');

        $data = [];

        switch ($reportType) {
            case 'overview':
                $data = $this->getOverviewData($startDate, $endDate);
                break;
            
            case 'expense_analysis':
                $data = $this->getExpenseAnalysisData($startDate, $endDate);
                break;
                
            case 'income_analysis':
                $data = $this->getIncomeAnalysisData($startDate, $endDate);
                break;
                
            case 'cash_flow':
                $data = $this->getCashFlowData($startDate, $endDate);
                break;
                
            case 'net_worth':
                $data = $this->getNetWorthData();
                break;
        }

        return Inertia::render('Report/Index', array_merge($data, [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => $reportType
            ]
        ]));
    }

    /**
     * Get overview report data
     */
    private function getOverviewData($startDate, $endDate)
    {
        $userId = auth()->id();

        // Total Income
        $totalIncome = Transaction::where('user_id', $userId)
            ->where('type', 'income')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        // Total Expense
        $totalExpense = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        // Expense by Category
        $expenseByCategory = Transaction::where('user_id', $userId)
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
                    'percentage' => 0 // Will calculate below
                ];
            })
            ->sortByDesc('amount')
            ->values();

        // Calculate percentages
        $totalExpenseAmount = $expenseByCategory->sum('amount');
        $expenseByCategory = $expenseByCategory->map(function ($item) use ($totalExpenseAmount) {
            $item['percentage'] = $totalExpenseAmount > 0 ? round(($item['amount'] / $totalExpenseAmount) * 100, 1) : 0;
            return $item;
        });

        // Top 5 Categories
        $topCategories = $expenseByCategory->take(5);

        return [
            'total_income' => $totalIncome,
            'total_expense' => $totalExpense,
            'net_flow' => $totalIncome - $totalExpense,
            'expense_by_category' => $expenseByCategory,
            'top_categories' => $topCategories
        ];
    }

    /**
     * Get expense analysis data
     */
    private function getExpenseAnalysisData($startDate, $endDate)
    {
        // Implement detailed expense analysis
        return [
            'message' => 'Expense analysis data'
        ];
    }

    /**
     * Get income analysis data
     */
    private function getIncomeAnalysisData($startDate, $endDate)
    {
        // Implement income analysis
        return [
            'message' => 'Income analysis data'
        ];
    }

    /**
     * Get cash flow data
     */
    private function getCashFlowData($startDate, $endDate)
    {
        // Implement cash flow analysis
        return [
            'message' => 'Cash flow data'
        ];
    }

    /**
     * Get net worth data
     */
    private function getNetWorthData()
    {
        $userId = auth()->id();
        
        // Total assets (accounts with positive balance included in net worth)
        $totalAssets = Account::where('user_id', $userId)
            ->where('include_in_net_worth', true)
            ->sum('balance');

        // Total liabilities (credit cards with negative balance)
        $totalLiabilities = Account::where('user_id', $userId)
            ->where('type', 'credit_card')
            ->sum('balance');

        // Net worth
        $netWorth = $totalAssets + $totalLiabilities; // liabilities are negative

        return [
            'total_assets' => $totalAssets,
            'total_liabilities' => abs($totalLiabilities),
            'net_worth' => $netWorth
        ];
    }

    /**
     * Export report to PDF/Excel
     */
    public function export(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());
        $reportType = $request->get('type', 'overview');
        $format = $request->get('format', 'pdf');

        // Get report data
        $data = $this->getReportData($reportType, $startDate, $endDate);
        
        $fileName = "report-{$reportType}-{$startDate}-to-{$endDate}." . ($format === 'excel' ? 'xlsx' : $format);

        try {
            if ($format === 'excel') {
                // Pastikan class ReportsExport sudah dibuat
                if (class_exists(\App\Exports\ReportsExport::class)) {
                    return Excel::download(new ReportsExport($data, $reportType), $fileName);
                }
                return back()->with('error', 'Excel export belum tersedia.');
            } elseif ($format === 'csv') {
                if (class_exists(\App\Exports\ReportsExport::class)) {
                    return Excel::download(new ReportsExport($data, $reportType), $fileName, \Maatwebsite\Excel\Excel::CSV);
                }
                return back()->with('error', 'CSV export belum tersedia.');
            } else {
                // PDF Export
                if (class_exists(\Barryvdh\DomPDF\Facade\Pdf::class)) {
                    $pdf = Pdf::loadView('exports.report', [
                        'data' => $data,
                        'reportType' => $reportType,
                        'startDate' => $startDate,
                        'endDate' => $endDate
                    ]);
                    
                    return $pdf->download($fileName);
                }
                // Fallback: return JSON
                return response()->json($data)->header('Content-Disposition', "attachment; filename={$fileName}.json");
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Export gagal: ' . $e->getMessage());
        }
    }

    /**
     * Get monthly trends data
     */
    private function getMonthlyTrendsData($startDate, $endDate)
    {
        $userId = auth()->id();
        $start = Carbon::parse($startDate)->startOfMonth();
        $end = Carbon::parse($endDate)->endOfMonth();
        
        $data = [];
        $current = $start->copy();
        
        // Generate data untuk setiap bulan dalam range
        while ($current <= $end) {
            $monthStart = $current->copy()->startOfMonth()->toDateString();
            $monthEnd = $current->copy()->endOfMonth()->toDateString();
            
            $income = Transaction::where('user_id', $userId)
                ->where('type', 'income')
                ->whereBetween('transaction_date', [$monthStart, $monthEnd])
                ->sum('amount');

            $expense = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->whereBetween('transaction_date', [$monthStart, $monthEnd])
                ->sum('amount');

            $data[] = [
                'month' => $current->format('F Y'),
                'month_short' => $current->format('M'),
                'income' => (float) $income,
                'expense' => (float) $expense,
                'savings' => (float) ($income - $expense)
            ];
            
            $current->addMonth();
        }

        $summary = [
            'total_income' => collect($data)->sum('income'),
            'total_expense' => collect($data)->sum('expense'),
            'total_savings' => collect($data)->sum('savings'),
        ];

        return [
            'monthly_trends' => [
                'data' => $data,
                'summary' => $summary
            ]
        ];
    }

    /**
     * Get spending category data
     */
    private function getSpendingCategoryData($startDate, $endDate)
    {
        $userId = auth()->id();

        $expenses = Transaction::where('user_id', $userId)
            ->where('type', 'expense')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->with('category')
            ->get();

        $categoryData = $expenses->groupBy('category_id')->map(function ($transactions, $categoryId) {
            $category = $transactions->first()->category;
            $total = $transactions->sum('amount');
            $count = $transactions->count();
            $average = $count > 0 ? $total / $count : 0;

            return [
                'id' => $categoryId,
                'name' => $category->name,
                'amount' => (float) $total,
                'count' => $count,
                'average' => (float) $average,
                'color' => $category->color,
                'icon' => $category->icon ?? 'tag',
                'transactions' => $transactions->sortByDesc('transaction_date')->take(5)->values()
            ];
        })->values()->sortByDesc('amount')->values();

        $totalAmount = $categoryData->sum('amount');
        $categoryData = $categoryData->map(function ($item) use ($totalAmount) {
            $item['percentage'] = $totalAmount > 0 ? round(($item['amount'] / $totalAmount) * 100, 1) : 0;
            return $item;
        })->values();

        $summary = [
            'total_spent' => (float) $totalAmount,
            'total_transactions' => $expenses->count(),
            'average_per_transaction' => $expenses->count() > 0 ? (float) ($totalAmount / $expenses->count()) : 0,
            'top_category' => $categoryData->first()
        ];

        return [
            'spending_categories' => [
                'data' => $categoryData,
                'summary' => $summary
            ]
        ];
    }

    /**
     * Get budget actuals data
     */
    private function getBudgetActualsData($startDate, $endDate)
    {
        $userId = auth()->id();
        $month = Carbon::parse($startDate)->month;
        $year = Carbon::parse($startDate)->year;

        $budgets = Budget::where('user_id', $userId)
            ->where('month', $month)
            ->where('year', $year)
            ->with('category')
            ->get();

        $budgetData = [];
        foreach ($budgets as $budget) {
            $actual = Transaction::where('user_id', $userId)
                ->where('category_id', $budget->category_id)
                ->where('type', 'expense')
                ->whereMonth('transaction_date', $month)
                ->whereYear('transaction_date', $year)
                ->sum('amount');

            $budgetAmount = $budget->amount ?? 0;
            $actualAmount = $actual ?? 0;
            $difference = $budgetAmount - $actualAmount;
            $progress = $budgetAmount > 0 ? min(($actualAmount / $budgetAmount) * 100, 100) : 0;

            $budgetData[] = [
                'category_id' => $budget->category_id,
                'category_name' => $budget->category->name,
                'budget_amount' => (float) $budgetAmount,
                'actual_amount' => (float) $actualAmount,
                'difference' => (float) $difference,
                'progress' => (float) $progress,
                'status' => $actualAmount > $budgetAmount ? 'over_budget' :
                    ($actualAmount == $budgetAmount ? 'on_budget' : 'under_budget'),
                'color' => $budget->category->color
            ];
        }

        $summary = [
            'total_budget' => collect($budgetData)->sum('budget_amount'),
            'total_actual' => collect($budgetData)->sum('actual_amount'),
            'total_difference' => collect($budgetData)->sum('difference'),
            'budget_categories' => count($budgetData)
        ];

        return [
            'budget_actuals' => [
                'data' => $budgetData,
                'period' => [
                    'month' => $month,
                    'year' => $year,
                    'month_name' => Carbon::create()->month($month)->format('F')
                ],
                'summary' => $summary
            ]
        ];
    }

    /**
     * Get report data for export
     */
    private function getReportData($reportType, $startDate, $endDate)
    {
        switch ($reportType) {
            case 'overview':
                return $this->getOverviewData($startDate, $endDate);
            case 'monthly_trends':
                return $this->getMonthlyTrendsData($startDate, $endDate);
            case 'spending_category':
                return $this->getSpendingCategoryData($startDate, $endDate);
            case 'budget_actuals':
                return $this->getBudgetActualsData($startDate, $endDate);
            case 'expense_analysis':
                return $this->getExpenseAnalysisData($startDate, $endDate);
            case 'income_analysis':
                return $this->getIncomeAnalysisData($startDate, $endDate);
            case 'cash_flow':
                return $this->getCashFlowData($startDate, $endDate);
            case 'net_worth':
                return $this->getNetWorthData();
            default:
                return [];
        }
    }

    /**
     * Monthly Trends Report Page
     */
    public function monthlyTrends(Request $request)
    {
        $startDate = $request->get('start_date', now()->subMonths(5)->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());
        
        $data = $this->getMonthlyTrendsData($startDate, $endDate);
        
        return Inertia::render('Report/MonthlyTrends', array_merge($data, [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => 'monthly_trends'
            ]
        ]));
    }

    /**
     * Spending Category Report Page
     */
    public function spendingCategory(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());
        
        $data = $this->getSpendingCategoryData($startDate, $endDate);
        
        return Inertia::render('Report/SpendingCategory', array_merge($data, [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => 'spending_category'
            ]
        ]));
    }

    /**
     * Budget Actuals Report Page
     */
    public function budgetActuals(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->get('end_date', now()->endOfMonth()->toDateString());
        
        $data = $this->getBudgetActualsData($startDate, $endDate);
        
        return Inertia::render('Report/BudgetActuals', array_merge($data, [
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => 'budget_actuals'
            ]
        ]));
    }

    /**
     * Net Worth Report Page
     */
    public function netWorth(Request $request)
    {
        $data = $this->getNetWorthData();
        
        return Inertia::render('Report/NetWorth', array_merge($data, [
            'filters' => [
                'type' => 'net_worth'
            ]
        ]));
    }

}