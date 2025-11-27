// resources/js/Pages/Categories/Index.jsx

import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    Plus, 
    Edit3, 
    Trash2, 
    Eye,
    Filter
} from 'lucide-react';

export default function CategoriesIndex({ categories, filters }) {
    const [filterType, setFilterType] = useState(filters.type || 'all');
    
    const { delete: destroy } = useForm();

    const filteredCategories = categories.filter(category => 
        filterType === 'all' || category.type === filterType
    );

    const handleDelete = (category) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            destroy(route('categories.destroy', category.id));
        }
    };

    const getTypeBadge = (type) => {
        const styles = {
            income: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            expense: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
            transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
        };
        
        const labels = {
            income: 'Pendapatan',
            expense: 'Pengeluaran',
            transfer: 'Transfer'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type]}`}>
                {labels[type]}
            </span>
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kategori" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Kategori
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Kelola kategori untuk transaksi Anda
                            </p>
                        </div>
                        <Link
                            href={route('categories.create')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                            >
                             <Plus className="h-4 w-4" />
                             <span>Tambah Akun</span>
                        </Link>
                    </div>

                    {/* Filters */}
                    <div className="mb-6">
                        <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-sm p-6 mb-6 text-white transform transition-transform duration-300 hover:scale-[1.01] motion-safe:animate-pulse/60"
                            style={{ fontSize: '110%' }}
                        >
                            <div className="flex items-center space-x-3">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Filter</div>
                                <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">Pilih tipe kategori</div>
                            </div>

                            {/* Right controls: select + reset + optional sort buttons */}
                            <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible">
                                <div className="relative">
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                        className="appearance-none pr-8 pl-3 py-1 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-700"
                                        aria-label="Filter tipe kategori"
                                    >
                                        <option value="all">Semua Tipe</option>
                                        <option value="income">Pendapatan</option>
                                        <option value="expense">Pengeluaran</option>
                                        <option value="transfer">Transfer</option>
                                    </select>

                                    {/* chevron */}
                                    <svg
                                        className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden
                                    >
                                        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {filterType !== 'all' ? (
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className="text-sm px-3 py-1 rounded-full border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800"
                                    >
                                        Reset
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setFilterType('all')}
                                        className="hidden"
                                        aria-hidden
                                    />
                                )}

                                {/* Optional sort up/down (keeps compact and side-by-side, not stacked) */}
                                <div className="flex items-center space-x-1 pl-1">
                                    <button
                                        type="button"
                                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                        title="Urutkan naik"
                                        aria-label="Sort ascending"
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <path d="M4 12l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                        title="Urutkan turun"
                                        aria-label="Sort descending"
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                            <path d="M4 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <div 
                                key={category.id} 
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div 
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                                            style={{ backgroundColor: category.color }}
                                        >
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {category.name}
                                            </h3>
                                            {getTypeBadge(category.type)}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex space-x-1">
                                        <Link
                                            href={route('categories.show', category.id)}
                                            className="p-1 text-blue-600 hover:text-blue-500"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        {!category.is_default && (
                                            <>
                                                <Link
                                                    href={route('categories.edit', category.id)}
                                                    className="p-1 text-green-600 hover:text-green-500"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="p-1 text-red-600 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    <p>{category.transactions_count} transaksi</p>
                                    {category.is_default && (
                                        <p className="text-purple-600 text-xs mt-1">
                                            Kategori Default
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredCategories.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 dark:text-gray-500 mb-4">
                                <Filter className="h-12 w-12 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Tidak ada kategori
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {filterType !== 'all' 
                                    ? `Tidak ada kategori dengan tipe ${filterType}`
                                    : 'Belum ada kategori yang dibuat'
                                }
                            </p>
                            {filterType !== 'all' && (
                                <button
                                    onClick={() => setFilterType('all')}
                                    className="text-purple-600 hover:text-purple-500"
                                >
                                    Tampilkan semua kategori
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}