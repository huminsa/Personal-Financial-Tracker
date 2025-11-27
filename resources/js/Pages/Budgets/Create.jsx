import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Calendar } from 'lucide-react';

export default function BudgetsCreate({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        is_recurring: true
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('budgets.store'));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Filter hanya kategori expense
    const expenseCategories = categories.filter(category => category.type === 'expense');

    // Months untuk dropdown
    const months = {
        1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April',
        5: 'Mei', 6: 'Juni', 7: 'Juli', 8: 'Agustus',
        9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
    };

    // Years untuk dropdown (2 tahun ke belakang, 1 tahun ke depan)
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Budget" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <Link
                            href={route('budgets.index')}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Tambah Budget Baru
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Set budget untuk kategori pengeluaran
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kategori Pengeluaran *
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {expenseCategories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                                    )}
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Jumlah Budget *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', parseFloat(e.target.value) || '')}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="0"
                                            step="0.01"
                                            min="0.01"
                                        />
                                    </div>
                                    {data.amount && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {formatCurrency(data.amount)}
                                        </p>
                                    )}
                                    {errors.amount && (
                                        <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
                                    )}
                                </div>

                                {/* Month and Year */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Bulan *
                                        </label>
                                        <select
                                            value={data.month}
                                            onChange={(e) => setData('month', parseInt(e.target.value))}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            {Object.entries(months).map(([key, month]) => (
                                                <option key={key} value={key}>
                                                    {month}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.month && (
                                            <p className="text-red-600 text-sm mt-1">{errors.month}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tahun *
                                        </label>
                                        <select
                                            value={data.year}
                                            onChange={(e) => setData('year', parseInt(e.target.value))}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            {years.map(year => (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.year && (
                                            <p className="text-red-600 text-sm mt-1">{errors.year}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Recurring */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_recurring"
                                        checked={data.is_recurring}
                                        onChange={(e) => setData('is_recurring', e.target.checked)}
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <label htmlFor="is_recurring" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                        Budget berulang setiap bulan
                                    </label>
                                </div>

                                {/* Preview */}
                                {data.amount && data.category_id && (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            Preview Budget
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Kategori:</span>
                                                <span className="font-medium">
                                                    {expenseCategories.find(c => c.id == data.category_id)?.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                                                <span className="font-bold text-purple-600">
                                                    {formatCurrency(data.amount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Periode:</span>
                                                <span className="font-medium">
                                                    {months[data.month]} {data.year}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route('budgets.index')}
                                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md flex items-center space-x-2 disabled:opacity-50 font-medium"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>{processing ? 'Menyimpan...' : 'Simpan Budget'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}