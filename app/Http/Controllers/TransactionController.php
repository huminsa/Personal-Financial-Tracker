<?php
// app/Http/Controllers/TransactionController.php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Category;
use App\Models\Account;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TransactionController extends Controller
{
        use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
{
    $query = Transaction::where('user_id', auth()->id())
        ->with(['category', 'fromAccount', 'toAccount'])
        ->orderBy('transaction_date', 'desc')
        ->orderBy('created_at', 'desc');

    // Filters
    if ($request->has('type') && $request->type !== 'all') {
        $query->where('type', $request->type);
    }

    if ($request->has('category_id') && $request->category_id) {
        $query->where('category_id', $request->category_id);
    }

    if ($request->has('account_id') && $request->account_id) {
        $query->where(function($q) use ($request) {
            $q->where('from_account_id', $request->account_id)
              ->orWhere('to_account_id', $request->account_id);
        });
    }

    if ($request->has('date_from') && $request->date_from) {
        $query->where('transaction_date', '>=', $request->date_from);
    }

    if ($request->has('date_to') && $request->date_to) {
        $query->where('transaction_date', '<=', $request->date_to);
    }

    $transactions = $query->paginate(20);

    // ✅ Stats DENGAN filter yang sama
    $statsQuery = Transaction::where('user_id', auth()->id());
    
    // Apply same filters to stats
    if ($request->has('date_from') && $request->date_from) {
        $statsQuery->where('transaction_date', '>=', $request->date_from);
    }
    
    if ($request->has('date_to') && $request->date_to) {
        $statsQuery->where('transaction_date', '<=', $request->date_to);
    }

    $stats = [
        'total_income' => (clone $statsQuery)->where('type', 'income')->sum('amount'),
        'total_expense' => (clone $statsQuery)->where('type', 'expense')->sum('amount'),
    ];

    return Inertia::render('Transactions/Index', [
        'transactions' => $transactions,
        'categories' => Category::where('user_id', auth()->id())
            ->orWhere('is_default', true)
            ->get(),
        'accounts' => Account::where('user_id', auth()->id())->get(),
        'filters' => $request->only(['type', 'category_id', 'account_id', 'date_from', 'date_to']),
        'stats' => $stats
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Transactions/Create', [
            'categories' => Category::where('user_id', auth()->id())
                ->orWhere('is_default', true)
                ->get(),
            'accounts' => Account::where('user_id', auth()->id())->get(),
            'defaultAccount' => Account::where('user_id', auth()->id())
                ->where('is_default', true)
                ->first()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required_if:type,transfer|nullable|exists:accounts,id',
            'transaction_date' => 'required|date',
        ]);

        // Validasi tambahan
        if ($request->type === 'transfer' && $request->from_account_id === $request->to_account_id) {
            return back()->withErrors(['to_account_id' => 'Akun asal dan tujuan tidak boleh sama.']);
        }

        $transaction = Transaction::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'from_account_id' => $request->from_account_id,
            'to_account_id' => $request->type === 'transfer' ? $request->to_account_id : null,
            'transaction_date' => $request->transaction_date,
        ]);

        // Update account balances
        $this->updateAccountBalances($transaction);

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction->load(['category', 'fromAccount', 'toAccount'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'categories' => Category::where('user_id', auth()->id())
                ->orWhere('is_default', true)
                ->get(),
            'accounts' => Account::where('user_id', auth()->id())->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $request->validate([
            'type' => 'required|in:income,expense,transfer',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'from_account_id' => 'required|exists:accounts,id',
            'to_account_id' => 'required_if:type,transfer|nullable|exists:accounts,id',
            'transaction_date' => 'required|date',
        ]);

        if ($request->type === 'transfer' && $request->from_account_id === $request->to_account_id) {
            return back()->withErrors(['to_account_id' => 'Akun asal dan tujuan tidak boleh sama.']);
        }

        // Reverse old balances
        $this->reverseAccountBalances($transaction);

        $transaction->update([
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'from_account_id' => $request->from_account_id,
            'to_account_id' => $request->type === 'transfer' ? $request->to_account_id : null,
            'transaction_date' => $request->transaction_date,
        ]);

        // Apply new balances
        $this->updateAccountBalances($transaction);

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        // Reverse balances sebelum hapus
        $this->reverseAccountBalances($transaction);

        $transaction->delete();

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil dihapus!');
    }

    /**
     * Update account balances based on transaction
     */
    private function updateAccountBalances(Transaction $transaction)
    {
        $fromAccount = Account::find($transaction->from_account_id);
        $toAccount = $transaction->to_account_id ? Account::find($transaction->to_account_id) : null;

        switch ($transaction->type) {
            case 'income':
                $fromAccount->balance += $transaction->amount;
                $fromAccount->save();
                break;

            case 'expense':
                $fromAccount->balance -= $transaction->amount;
                $fromAccount->save();
                break;

            case 'transfer':
                $fromAccount->balance -= $transaction->amount;
                $toAccount->balance += $transaction->amount;
                $fromAccount->save();
                $toAccount->save();
                break;
        }
    }

    /**
     * Reverse account balances (for updates/deletes)
     */
    private function reverseAccountBalances(Transaction $transaction)
    {
        $fromAccount = Account::find($transaction->from_account_id);
        $toAccount = $transaction->to_account_id ? Account::find($transaction->to_account_id) : null;

        switch ($transaction->type) {
            case 'income':
                $fromAccount->balance -= $transaction->amount;
                $fromAccount->save();
                break;

            case 'expense':
                $fromAccount->balance += $transaction->amount;
                $fromAccount->save();
                break;

            case 'transfer':
                $fromAccount->balance += $transaction->amount;
                $toAccount->balance -= $transaction->amount;
                $fromAccount->save();
                $toAccount->save();
                break;
        }
    }

    /**
     * Quick add transaction (for modal/form)
     */
    public function quickAdd(Request $request)
    {
        $request->validate([
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'account_id' => 'required|exists:accounts,id',
        ]);

        $transaction = Transaction::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'amount' => $request->amount,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'from_account_id' => $request->account_id,
            'transaction_date' => now(),
        ]);

        $this->updateAccountBalances($transaction);

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil ditambahkan!',
            'transaction' => $transaction
        ]);
    }
}