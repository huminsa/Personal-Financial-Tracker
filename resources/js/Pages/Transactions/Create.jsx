import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ArrowLeft, 
    Save, 
    Calendar,
    Wallet,
    Tag,
    TrendingUp,
    TrendingDown,
    RefreshCw
} from 'lucide-react';

export default function TransactionsCreate({ categories, accounts, defaultAccount }) {
    const [transactionType, setTransactionType] = useState('expense');
    
    const { data, setData, post, processing, errors } = useForm({
        type: 'expense',
        amount: '',
        description: '',
        category_id: '',
        from_account_id: defaultAccount?.id || '',
        to_account_id: '',
        transaction_date: new Date().toISOString().split('T')[0] // Today's date
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('transactions.store'));
    };

    // Filter categories based on transaction type
    const filteredCategories = categories.filter(category => 
        category.type === transactionType || category.type === 'transfer'
    );

    // Filter accounts for transfer (exclude from account in to account dropdown)
    const filteredToAccounts = accounts.filter(account => 
        account.id !== data.from_account_id
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const transactionTypes = [
        {
            value: 'income',
            label: 'Pendapatan',
            description: 'Uang masuk ke akun',
            icon: TrendingUp,
            color: 'text-green-600 bg-green-100 dark:bg-green-900'
        },
        {
            value: 'expense',
            label: 'Pengeluaran',
            description: 'Uang keluar dari akun',
            icon: TrendingDown,
            color: 'text-red-600 bg-red-100 dark:bg-red-900'
        },
        {
            value: 'transfer',
            label: 'Transfer',
            description: 'Pindah uang antar akun',
            icon: RefreshCw,
            color: 'text-blue-600 bg-blue-100 dark:bg-blue-900'
        }
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Transaksi" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <Link
                            href={route('transactions.index')}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4 "
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Tambah Transaksi Baru
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Catat transaksi keuangan Anda
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                {/* Transaction Type Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                        Jenis Transaksi *
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {transactionTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => {
                                                    setTransactionType(type.value);
                                                    setData('type', type.value);
                                                    // Reset category when type changes
                                                    setData('category_id', '');
                                                    // Reset to_account for non-transfer
                                                    if (type.value !== 'transfer') {
                                                        setData('to_account_id', '');
                                                    }
                                                }}
                                                className={`p-4 border-2 rounded-lg text-left transition-all ${
                                                    transactionType === type.value
                                                        ? `${type.color} border-current`
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded-lg ${type.color}`}>
                                                        <type.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">
                                                            {type.label}
                                                        </div>
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            {type.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.type && (
                                        <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                                    )}
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Jumlah *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            value={data.amount}
                                            onChange={(e) => setData('amount', parseFloat(e.target.value) || '')}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg font-semibold"
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

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Deskripsi *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder={`Contoh: ${transactionType === 'income' ? 'Gaji Bulan Ini' : transactionType === 'expense' ? 'Makan Siang' : 'Transfer ke Tabungan'}`}
                                    />
                                    {errors.description && (
                                        <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kategori *
                                    </label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {filteredCategories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.category_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.category_id}</p>
                                    )}
                                </div>

                                {/* From Account */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {transactionType === 'income' ? 'Akun Tujuan' : 
                                         transactionType === 'expense' ? 'Akun Sumber' : 
                                         'Dari Akun'} *
                                    </label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <select
                                            value={data.from_account_id}
                                            onChange={(e) => {
                                                setData('from_account_id', e.target.value);
                                                // If transfer, reset to_account if same as from_account
                                                if (transactionType === 'transfer' && data.to_account_id === e.target.value) {
                                                    setData('to_account_id', '');
                                                }
                                            }}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Pilih Akun</option>
                                            {accounts.map(account => (
                                                <option key={account.id} value={account.id}>
                                                    {account.name} - {formatCurrency(account.balance)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.from_account_id && (
                                        <p className="text-red-600 text-sm mt-1">{errors.from_account_id}</p>
                                    )}
                                </div>

                                {/* To Account (Only for Transfer) */}
                                {transactionType === 'transfer' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ke Akun *
                                        </label>
                                        <div className="relative">
                                            <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <select
                                                value={data.to_account_id}
                                                onChange={(e) => setData('to_account_id', e.target.value)}
                                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="">Pilih Akun Tujuan</option>
                                                {filteredToAccounts.map(account => (
                                                    <option key={account.id} value={account.id}>
                                                        {account.name} - {formatCurrency(account.balance)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.to_account_id && (
                                            <p className="text-red-600 text-sm mt-1">{errors.to_account_id}</p>
                                        )}
                                        {data.from_account_id && data.to_account_id && data.from_account_id === data.to_account_id && (
                                            <p className="text-red-600 text-sm mt-1">
                                                Akun asal dan tujuan tidak boleh sama
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Transaction Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tanggal Transaksi *
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="date"
                                            value={data.transaction_date}
                                            onChange={(e) => setData('transaction_date', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                    </div>
                                    {errors.transaction_date && (
                                        <p className="text-red-600 text-sm mt-1">{errors.transaction_date}</p>
                                    )}
                                </div>

                                {/* Transaction Preview */}
                                {(data.amount && data.from_account_id && data.category_id) && (
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                            Preview Transaksi
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Jenis:</span>
                                                <span className="font-medium capitalize">
                                                    {transactionType === 'income' ? 'Pendapatan' :
                                                     transactionType === 'expense' ? 'Pengeluaran' : 'Transfer'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Jumlah:</span>
                                                <span className={`font-bold ${
                                                    transactionType === 'income' ? 'text-green-600' :
                                                    transactionType === 'expense' ? 'text-red-600' :
                                                    'text-blue-600'
                                                }`}>
                                                    {transactionType === 'income' ? '+' : 
                                                     transactionType === 'expense' ? '-' : '±'}
                                                    {formatCurrency(data.amount)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Akun:</span>
                                                <span className="font-medium">
                                                    {accounts.find(a => a.id == data.from_account_id)?.name}
                                                </span>
                                            </div>
                                            {transactionType === 'transfer' && data.to_account_id && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Tujuan:</span>
                                                    <span className="font-medium">
                                                        {accounts.find(a => a.id == data.to_account_id)?.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route('transactions.index')}
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
                                        <span>{processing ? 'Menyimpan...' : 'Simpan Transaksi'}</span>
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