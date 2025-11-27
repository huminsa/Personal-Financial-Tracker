import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Plus, 
    Edit3, 
    Trash2, 
    Filter,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    XCircle,
    AlertCircle,
    Copy
} from 'lucide-react';

export default function BudgetsIndex({ budgets, budgetData, categories, filters, months, years }) {
    const [localFilters, setLocalFilters] = useState({
        month: filters.month || new Date().getMonth() + 1,
        year: filters.year || new Date().getFullYear()
    });

    const { delete: destroy, post } = useForm();

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return 'Rp 0';
        }
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getProgressColor = (status) => {
        const colors = {
            over_budget: 'bg-red-500',
            on_budget: 'bg-yellow-500',
            under_budget: 'bg-green-500'
        };
        return colors[status] || 'bg-gray-500';
    };

    const getStatusIcon = (status) => {
        const icons = {
            over_budget: <XCircle className="h-5 w-5 text-red-500" />,
            on_budget: <AlertCircle className="h-5 w-5 text-yellow-500" />,
            under_budget: <CheckCircle className="h-5 w-5 text-green-500" />
        };
        return icons[status];
    };

    const getStatusText = (status) => {
        const texts = {
            over_budget: 'Over Budget',
            on_budget: 'On Budget',
            under_budget: 'Under Budget'
        };
        return texts[status];
    };

    // Apply filters
    const applyFilters = () => {
        router.get(route('budgets.index'), localFilters, {
            preserveState: true,
            replace: true
        });
    };

    // Copy from previous month
    const copyFromPrevious = () => {
        post(route('budgets.copy-previous'), localFilters, {
            preserveState: true,
            onSuccess: () => {
                router.reload();
            }
        });
    };

    // Handle delete
    const handleDelete = (budget) => {
        if (confirm(`Hapus budget untuk ${budget.category?.name}?`)) {
            destroy(route('budgets.destroy', budget.id));
        }
    };

    // Calculate totals - FIX NaN ISSUE
    const totalBudget = budgetData.reduce((sum, item) => sum + (parseFloat(item.budget_amount) || 0), 0);
    const totalActual = budgetData.reduce((sum, item) => sum + (parseFloat(item.actual_amount) || 0), 0);
    const totalDifference = totalBudget - totalActual;

    // Safe percentage calculation
    const calculatePercentage = (actual, budget) => {
        if (!budget || budget === 0) return 0;
        return Math.min((actual / budget) * 100, 100);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Budgets" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Budgets
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Kelola budget pengeluaran bulanan Anda
                            </p>
                        </div>
                        <Link
                            href={route('budgets.create')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Tambah Budget</span>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-sm p-6 mb-6 text-white transform transition-transform duration-300 hover:scale-[1.01] motion-safe:animate-pulse/60">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Month Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bulan
                                </label>
                                <select
                                    value={localFilters.month}
                                    onChange={(e) => setLocalFilters({...localFilters, month: parseInt(e.target.value)})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {Object.entries(months).map(([key, month]) => (
                                        <option key={key} value={parseInt(key)}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Year Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tahun
                                </label>
                                <select
                                    value={localFilters.year}
                                    onChange={(e) => setLocalFilters({...localFilters, year: parseInt(e.target.value)})}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    {years.map(year => (
                                        <option key={year} value={parseInt(year)}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Actions */}
                            <div className="flex items-end space-x-3">
                                <button
                                    onClick={applyFilters}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>Terapkan</span>
                                </button>
                                <button
                                    onClick={copyFromPrevious}
                                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md flex items-center space-x-2"
                                >
                                    <Copy className="h-4 w-4" />
                                    <span>Salin dari Bulan Sebelumnya</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Total Budget */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                                    <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(totalBudget)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total Actual */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                                    <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(totalActual)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Difference */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-4 ${
                                    totalDifference >= 0 
                                        ? 'bg-green-100 dark:bg-green-900' 
                                        : 'bg-red-100 dark:bg-red-900'
                                }`}>
                                    {totalDifference >= 0 ? (
                                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Sisa Budget</p>
                                    <p className={`text-2xl font-bold ${
                                        totalDifference >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {formatCurrency(totalDifference)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budgets List */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Budgets {months[localFilters.month]} {localFilters.year}
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {budgetData.length > 0 ? (
                                budgetData.map((item, index) => {
                                    const budgetItem = budgets.find(b => b.category_id === item.category_id);
                                    const percentage = calculatePercentage(item.actual_amount, item.budget_amount);
                                    
                                    return (
                                        <div key={index} className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {item.category}
                                                        </h4>
                                                        <div className="flex items-center space-x-2">
                                                            {getStatusIcon(item.status)}
                                                            <span className={`text-sm font-medium ${
                                                                item.status === 'over_budget' ? 'text-red-600' :
                                                                item.status === 'on_budget' ? 'text-yellow-600' :
                                                                'text-green-600'
                                                            }`}>
                                                                {getStatusText(item.status)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="mb-2">
                                                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                            <span>{formatCurrency(item.actual_amount)}</span>
                                                            <span>{formatCurrency(item.budget_amount)}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                            <div 
                                                                className={`h-3 rounded-full ${getProgressColor(item.status)}`}
                                                                style={{ 
                                                                    width: `${percentage}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Amount Details */}
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            {Math.round(percentage)}% digunakan
                                                        </span>
                                                        <span className={`font-semibold ${
                                                            item.difference >= 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                            {item.difference >= 0 ? '+' : ''}{formatCurrency(item.difference)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                {budgetItem && (
                                                    <div className="flex space-x-2 ml-4">
                                                        <Link
                                                            href={route('budgets.edit', budgetItem.id)}
                                                            className="p-2 text-green-600 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(budgetItem)}
                                                            className="p-2 text-red-600 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-6 text-center">
                                    <div className="text-gray-400 dark:text-gray-500 mb-4">
                                        <TrendingUp className="h-12 w-12 mx-auto" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        Belum ada budget
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        Mulai dengan membuat budget pertama Anda
                                    </p>
                                    <Link
                                        href={route('budgets.create')}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Tambah Budget Pertama</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}