<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class AccountController extends Controller
{
        use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $accounts = Account::where('user_id', auth()->id())
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalBalance = $accounts->where('include_in_net_worth', true)->sum('balance');

        return Inertia::render('Accounts/Index', [
            'accounts' => $accounts,
            'totalBalance' => $totalBalance
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Accounts/Create', [
            'accountTypes' => [
                'cash' => 'Cash',
                'bank' => 'Bank Account', 
                'ewallet' => 'E-Wallet',
                'credit_card' => 'Credit Card',
                'investment' => 'Investment'
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:cash,bank,ewallet,credit_card,investment',
            'balance' => 'required|numeric|min:0',
            'color' => 'required|string|max:7',
            'description' => 'nullable|string|max:500',
        ]);

        // Jika ini akun pertama, jadikan default
        $isFirstAccount = Account::where('user_id', auth()->id())->count() === 0;

        Account::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'type' => $request->type,
            'balance' => $request->balance,
            'color' => $request->color,
            'description' => $request->description,
            'is_default' => $isFirstAccount,
            'include_in_net_worth' => $request->get('include_in_net_worth', true),
        ]);

        return redirect()->route('accounts.index')
            ->with('success', 'Akun berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        $this->authorize('view', $account);

        // Ambil semua transaksi yang berkaitan dengan akun ini (sebagai from atau to)
        $transactions = Transaction::where(function ($q) use ($account) {
                $q->where('from_account_id', $account->id)
                  ->orWhere('to_account_id', $account->id);
            })
            ->with(['category', 'fromAccount', 'toAccount'])
            ->orderBy('transaction_date', 'desc')
            ->paginate(15);

        return Inertia::render('Accounts/Show', [
            'account' => $account,
            'transactions' => $transactions
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        $this->authorize('update', $account);

        return Inertia::render('Accounts/Edit', [
            'account' => $account,
            'accountTypes' => [
                'cash' => 'Cash',
                'bank' => 'Bank Account',
                'ewallet' => 'E-Wallet', 
                'credit_card' => 'Credit Card',
                'investment' => 'Investment'
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        $this->authorize('update', $account);

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:cash,bank,ewallet,credit_card,investment',
            'color' => 'required|string|max:7',
            'description' => 'nullable|string|max:500',
        ]);

        $account->update($request->only([
            'name', 'type', 'color', 'description', 'include_in_net_worth'
        ]));

        return redirect()->route('accounts.index')
            ->with('success', 'Akun berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        $this->authorize('delete', $account);

        // Cek apakah akun punya transaksi
        if ($account->fromTransactions()->exists() || $account->toTransactions()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus akun yang memiliki transaksi.');
        }

        $account->delete();

        return redirect()->route('accounts.index')
            ->with('success', 'Akun berhasil dihapus!');
    }

    /**
     * Set default account
     */
    public function setDefault(Account $account)
    {
        $this->authorize('update', $account);

        // Reset semua akun default
        Account::where('user_id', auth()->id())->update(['is_default' => false]);

        // Set akun ini sebagai default
        $account->update(['is_default' => true]);

        return back()->with('success', 'Akun default berhasil diubah!');
    }
}