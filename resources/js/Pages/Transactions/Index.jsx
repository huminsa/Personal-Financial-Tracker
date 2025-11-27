import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import {
    Plus,
    Edit3,
    Trash2,
    Eye,
    Filter,
    TrendingUp,
    TrendingDown,
    RefreshCw,
    Search,
    Calendar,
} from "lucide-react";
import {
    EditTransactionModal,
    TransactionDetailModal,
} from "@/Components/TransactionModals";

export default function TransactionsIndex({
    transactions,
    categories,
    accounts,
    filters,
    stats,
}) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [localFilters, setLocalFilters] = useState({
        type: filters.type || "all",
        category_id: filters.category_id || "",
        account_id: filters.account_id || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    const { delete: destroy } = useForm();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getTypeColor = (type) => {
        const colors = {
            income: "text-green-600 bg-green-100 dark:bg-green-900",
            expense: "text-red-600 bg-red-100 dark:bg-red-900",
            transfer: "text-blue-600 bg-blue-100 dark:bg-blue-900",
        };
        return colors[type] || "text-gray-600 bg-gray-100";
    };

    const getTypeLabel = (type) => {
        const labels = {
            income: "Pendapatan",
            expense: "Pengeluaran",
            transfer: "Transfer",
        };
        return labels[type] || type;
    };

    const getTypeIcon = (type) => {
        const icons = {
            income: <TrendingUp className="h-4 w-4" />,
            expense: <TrendingDown className="h-4 w-4" />,
            transfer: <RefreshCw className="h-4 w-4" />,
        };
        return icons[type];
    };

    // Handle Filters
    const applyFilters = () => {
        router.get(route("transactions.index"), localFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            type: "all",
            category_id: "",
            account_id: "",
            date_from: "",
            date_to: "",
        });
        router.get(
            route("transactions.index"),
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Handle Actions
    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setShowEditModal(true);
    };

    const handleView = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    const handleDelete = (transaction) => {
        if (confirm(`Hapus transaksi "${transaction.description}"?`)) {
            destroy(route("transactions.destroy", transaction.id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Transaksi" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Transaksi
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Kelola semua transaksi keuangan Anda
                            </p>
                        </div>
                        <Link
                            href={route("transactions.create")}
                            className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:-translate-y-0.5"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Transaksi
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Pendapatan
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(stats.total_income)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-4">
                                    <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Pengeluaran
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(stats.total_expense)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                                    <RefreshCw className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Saldo
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            stats.total_income -
                                                stats.total_expense >=
                                            0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {formatCurrency(
                                            stats.total_income -
                                                stats.total_expense
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Type Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tipe
                                </label>
                                <select
                                    value={localFilters.type}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            type: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="all">Semua Tipe</option>
                                    <option value="income">Pendapatan</option>
                                    <option value="expense">Pengeluaran</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                            </div>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Kategori
                                </label>
                                <select
                                    value={localFilters.category_id}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            category_id: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Semua Kategori</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Account Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Akun
                                </label>
                                <select
                                    value={localFilters.account_id}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            account_id: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="">Semua Akun</option>
                                    {accounts.map((account) => (
                                        <option
                                            key={account.id}
                                            value={account.id}
                                        >
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.date_from}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            date_from: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={localFilters.date_to}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            date_to: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                            >
                                Reset Filter
                            </button>
                            <button
                                onClick={applyFilters}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Terapkan Filter</span>
                            </button>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Deskripsi
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Kategori
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Akun
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {transactions.data.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className={`p-2 rounded-lg mr-3 ${getTypeColor(
                                                            transaction.type
                                                        )}`}
                                                    >
                                                        {getTypeIcon(
                                                            transaction.type
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {
                                                                transaction.description
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {getTypeLabel(
                                                                transaction.type
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-2"
                                                        style={{
                                                            backgroundColor:
                                                                transaction
                                                                    .category
                                                                    .color,
                                                        }}
                                                    ></div>
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {
                                                            transaction.category
                                                                .name
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-white">
                                                    {
                                                        transaction.from_account
                                                            .name
                                                    }
                                                </div>
                                                {transaction.to_account && (
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        →{" "}
                                                        {
                                                            transaction
                                                                .to_account.name
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                {new Date(
                                                    transaction.transaction_date
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`text-sm font-semibold ${
                                                        transaction.type ===
                                                        "income"
                                                            ? "text-green-600"
                                                            : transaction.type ===
                                                              "expense"
                                                            ? "text-red-600"
                                                            : "text-blue-600"
                                                    }`}
                                                >
                                                    {transaction.type ===
                                                    "income"
                                                        ? "+"
                                                        : transaction.type ===
                                                          "expense"
                                                        ? "-"
                                                        : "±"}
                                                    {formatCurrency(
                                                        transaction.amount
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleView(
                                                                transaction
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                transaction
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900 dark:hover:text-green-400"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                transaction
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {transactions.data.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 dark:text-gray-500 mb-4">
                                    <Search className="h-12 w-12 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Tidak ada transaksi
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    {Object.values(localFilters).some(
                                        (val) => val && val !== "all"
                                    )
                                        ? "Coba ubah filter pencarian Anda"
                                        : "Mulai dengan menambahkan transaksi pertama Anda"}
                                </p>
                                <Link
                                    href={route("transactions.create")}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Tambah Transaksi Pertama</span>
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {transactions.links &&
                            transactions.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Menampilkan {transactions.from}{" "}
                                            sampai {transactions.to} dari{" "}
                                            {transactions.total} transaksi
                                        </div>
                                        <div className="flex space-x-1">
                                            {transactions.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || "#"}
                                                        className={`px-3 py-1 rounded-md text-sm ${
                                                            link.active
                                                                ? "bg-purple-600 text-white"
                                                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                        } ${
                                                            !link.url
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && selectedTransaction && (
                <EditTransactionModal
                    transaction={selectedTransaction}
                    categories={categories}
                    accounts={accounts}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedTransaction && (
                <TransactionDetailModal
                    transaction={selectedTransaction}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
