import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    TrendingUp, 
    TrendingDown, 
    Wallet, 
    PiggyBank,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

export default function Dashboard(props) {
    // Safe fallback untuk semua props
    const stats = props.stats || {
        current_month_income: 0,
        current_month_expense: 0,
        net_worth: 0,
        account_count: 0,
        savings_rate: 0
    };
    
    const accounts = props.accounts || [];
    const recentTransactions = props.recentTransactions || [];
    const expenseByCategory = props.expenseByCategory || [];
    const budgets = props.budgets || [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatPercentage = (value) => {
        return `${value.toFixed(1)}%`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Net Worth */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Net Worth
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {formatCurrency(stats.net_worth)}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                        </div>

                        {/* Monthly Income */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Pendapatan Bulan Ini
                                    </p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                        {formatCurrency(stats.current_month_income)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                        </div>

                        {/* Monthly Expense */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Pengeluaran Bulan Ini
                                    </p>
                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                        {formatCurrency(stats.current_month_expense)}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </div>

                        {/* Savings Rate */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Rasio Tabungan
                                    </p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                        {formatPercentage(stats.savings_rate)}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <PiggyBank className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Transactions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Transaksi Terbaru
                            </h3>
                            <div className="space-y-3">
                                {recentTransactions.length > 0 ? (
                                    recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                            <div className="flex items-center space-x-3">
                                                <div 
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                                                    style={{ backgroundColor: transaction.category?.color || '#6B7280' }}
                                                >
                                                    {transaction.category?.icon || '💰'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {transaction.description}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {transaction.category?.name} • {transaction.from_account?.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`font-semibold ${
                                                transaction.type === 'income' 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {transaction.type === 'income' ? '+' : '-'}
                                                {formatCurrency(transaction.amount)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        Belum ada transaksi
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Accounts Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Ringkasan Akun
                            </h3>
                            <div className="space-y-3">
                                {accounts.length > 0 ? (
                                    accounts.map((account) => (
                                        <div key={account.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                            <div className="flex items-center space-x-3">
                                                <div 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: account.color }}
                                                ></div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {account.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {account.type}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(account.balance)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                        Belum ada akun
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Budget Progress */}
                    {budgets.length > 0 && (
                        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Progress Budget
                            </h3>
                            <div className="space-y-4">
                                {budgets.map((budget, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700 dark:text-gray-300">
                                                {budget.category}
                                            </span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {formatCurrency(budget.actual)} / {formatCurrency(budget.budget)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className={`h-2 rounded-full ${
                                                    budget.status === 'over' 
                                                        ? 'bg-red-500' 
                                                        : 'bg-green-500'
                                                }`}
                                                style={{ width: `${Math.min(budget.progress, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}