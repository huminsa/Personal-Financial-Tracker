import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

export default function CategoriesCreate({ categoryTypes }) {
    const { data, setData, errors, post, processing } = useForm({
        name: '',
        type: 'expense',
        color: '#6B7280',
        icon: '📊'
    });

    const commonIcons = ['💰', '💼', '📈', '🍔', '🚗', '🎬', '🛍️', '🏥', '📚', '🏠', '🚌', '✈️', '🎁', '💡'];

    const submit = (e) => {
        e.preventDefault();
        post(route('categories.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Kategori" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <Link
                            href={route('categories.index')}
                            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Kembali
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Tambah Kategori Baru
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Buat kategori baru untuk mengorganisir transaksi Anda
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nama Kategori *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Contoh: Makanan, Transportasi, Gaji"
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tipe Kategori *
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        {categoryTypes.map(type => (
                                            <option key={type} value={type}>
                                                {type === 'income' ? 'Pendapatan' : 
                                                 type === 'expense' ? 'Pengeluaran' : 'Transfer'}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && (
                                        <p className="text-red-600 text-sm mt-1">{errors.type}</p>
                                    )}
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Warna *
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <input
                                            type="color"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                        />
                                        <input
                                            type="text"
                                            value={data.color}
                                            onChange={(e) => setData('color', e.target.value)}
                                            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="#6B7280"
                                        />
                                    </div>
                                    {errors.color && (
                                        <p className="text-red-600 text-sm mt-1">{errors.color}</p>
                                    )}
                                </div>

                                {/* Icon */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Ikon *
                                    </label>
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            value={data.icon}
                                            onChange={(e) => setData('icon', e.target.value)}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-2xl text-center"
                                            maxLength="2"
                                        />
                                        
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                Pilih ikon umum:
                                            </p>
                                            <div className="grid grid-cols-8 gap-2">
                                                {commonIcons.map((icon) => (
                                                    <button
                                                        key={icon}
                                                        type="button"
                                                        onClick={() => setData('icon', icon)}
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                                            data.icon === icon ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500' : 'border border-gray-300 dark:border-gray-600'
                                                        }`}
                                                    >
                                                        {icon}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {errors.icon && (
                                        <p className="text-red-600 text-sm mt-1">{errors.icon}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route('categories.index')}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>{processing ? 'Menyimpan...' : 'Simpan Kategori'}</span>
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