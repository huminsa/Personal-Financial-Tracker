<?php
// app/Http/Controllers/BudgetController.php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Category;
use App\Models\Transaction; // JANGAN LUPA IMPORT INI
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class BudgetController extends Controller
{
    use AuthorizesRequests;
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $currentMonth = $request->get('month', now()->month);
    $currentYear = $request->get('year', now()->year);

    $budgets = Budget::where('user_id', auth()->id())
        ->where('month', $currentMonth)
        ->where('year', $currentYear)
        ->with(['category'])
        ->get();

    // Budget vs Actual data - FIX PERHITUNGAN
    $budgetData = [];
    foreach ($budgets as $budget) {
        $actual = Transaction::where('user_id', auth()->id())
            ->where('category_id', $budget->category_id)
            ->where('type', 'expense')
            ->whereMonth('transaction_date', $currentMonth)
            ->whereYear('transaction_date', $currentYear)
            ->sum('amount');

        // Pastikan nilai tidak null
        $budgetAmount = $budget->amount ?? 0;
        $actualAmount = $actual ?? 0;
        $difference = $budgetAmount - $actualAmount;

        $budgetData[] = [
            'id' => $budget->id,
            'category_id' => $budget->category_id,
            'category' => $budget->category->name,
            'budget_amount' => (float) $budgetAmount,
            'actual_amount' => (float) $actualAmount,
            'difference' => (float) $difference,
            'status' => $actualAmount > $budgetAmount ? 'over_budget' : 
                       ($actualAmount == $budgetAmount ? 'on_budget' : 'under_budget')
        ];
    }

    return Inertia::render('Budgets/Index', [
        'budgets' => $budgets,
        'budgetData' => $budgetData,
        'categories' => Category::where('user_id', auth()->id())
            ->where('type', 'expense')
            ->get(),
        'filters' => [
            'month' => (int)$currentMonth,
            'year' => (int)$currentYear
        ],
        'months' => $this->getMonths(),
        'years' => range(now()->year - 1, now()->year + 1)
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Budgets/Create', [
            'categories' => Category::where('user_id', auth()->id())
                ->where('type', 'expense')
                ->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0',
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2020|max:2030',
        ]);

        // Cek apakah budget sudah ada
        $existing = Budget::where('user_id', auth()->id())
            ->where('category_id', $request->category_id)
            ->where('month', $request->month)
            ->where('year', $request->year)
            ->first();

        if ($existing) {
            return back()->withErrors(['category_id' => 'Budget untuk kategori ini sudah ada di bulan dan tahun yang dipilih.']);
        }

        Budget::create([
            'user_id' => auth()->id(),
            'category_id' => $request->category_id,
            'amount' => $request->amount,
            'month' => $request->month,
            'year' => $request->year,
        ]);

        return redirect()->route('budgets.index')
            ->with('success', 'Budget berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Budget $budget)
    {
        $this->authorize('view', $budget);

        return Inertia::render('Budgets/Show', [
            'budget' => $budget->load('category')
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Budget $budget)
    {
        $this->authorize('update', $budget);

        return Inertia::render('Budgets/Edit', [
            'budget' => $budget->load('category'),
            'categories' => Category::where('user_id', auth()->id())
                ->where('type', 'expense')
                ->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Budget $budget)
    {
        $this->authorize('update', $budget);

        $request->validate([
            'amount' => 'required|numeric|min:0',
        ]);

        $budget->update(['amount' => $request->amount]);

        return redirect()->route('budgets.index')
            ->with('success', 'Budget berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Budget $budget)
    {
        $this->authorize('delete', $budget);

        $budget->delete();

        return redirect()->route('budgets.index')
            ->with('success', 'Budget berhasil dihapus!');
    }

    /**
     * Copy budgets from previous month
     */
    public function copyFromPrevious(Request $request)
    {
        $currentMonth = $request->month;
        $currentYear = $request->year;

        $previousMonth = $currentMonth - 1;
        $previousYear = $currentYear;

        if ($previousMonth === 0) {
            $previousMonth = 12;
            $previousYear = $currentYear - 1;
        }

        $previousBudgets = Budget::where('user_id', auth()->id())
            ->where('month', $previousMonth)
            ->where('year', $previousYear)
            ->get();

        $copied = 0;
        foreach ($previousBudgets as $budget) {
            // Cek apakah sudah ada budget untuk bulan ini
            $existing = Budget::where('user_id', auth()->id())
                ->where('category_id', $budget->category_id)
                ->where('month', $currentMonth)
                ->where('year', $currentYear)
                ->first();

            if (!$existing) {
                Budget::create([
                    'user_id' => auth()->id(),
                    'category_id' => $budget->category_id,
                    'amount' => $budget->amount,
                    'month' => $currentMonth,
                    'year' => $currentYear,
                ]);
                $copied++;
            }
        }

        return back()->with('success', "Berhasil menyalin {$copied} budget dari bulan sebelumnya!");
    }

    private function getMonths()
    {
        return [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
    }
}