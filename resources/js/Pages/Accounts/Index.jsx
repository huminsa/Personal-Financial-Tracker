import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Plus, Edit3, Trash2, Eye, Star, Wallet } from "lucide-react";

export default function AccountsIndex({ accounts, totalBalance }) {
    const { delete: destroy } = useForm();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getAccountTypeIcon = (type) => {
        const icons = {
            cash: "💰",
            bank: "🏦",
            ewallet: "📱",
            credit_card: "💳",
            investment: "📈",
        };
        return icons[type] || "💼";
    };

    const getAccountTypeLabel = (type) => {
        const labels = {
            cash: "Cash",
            bank: "Bank",
            ewallet: "E-Wallet",
            credit_card: "Credit Card",
            investment: "Investment",
        };
        return labels[type] || type;
    };

    const handleDelete = (account) => {
        if (
            confirm(`Apakah Anda yakin ingin menghapus akun "${account.name}"?`)
        ) {
            destroy(route("accounts.destroy", account.id));
        }
    };

    const handleSetDefault = (account) => {
        // Akan kita buat nanti
    };

    return (
        <AuthenticatedLayout>
            <Head title="Akun" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Akun Saya
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Kelola semua akun dan dompet Anda
                            </p>
                        </div>
                        <Link
                            href={route("accounts.create")}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Tambah Akun</span>
                        </Link>
                    </div>

                    {/* Total Balance (animated) */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-sm p-6 mb-6 text-white transform transition-transform duration-300 hover:scale-[1.01] motion-safe:animate-pulse/60">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-purple-100">Total Balance</p>
                                <p className="text-3xl font-bold">
                                    {formatCurrency(totalBalance)}
                                </p>
                            </div>
                            <Wallet className="h-12 w-12 text-purple-200" />
                        </div>
                    </div>

                    {/* Accounts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map((account) => (
                            <div
                                key={account.id}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transform transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="text-2xl">
                                            {getAccountTypeIcon(account.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {account.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {getAccountTypeLabel(
                                                    account.type
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        {account.is_default && (
                                            <Star className="h-4 w-4 text-yellow-500 fill-current animate-pulse" />
                                        )}
                                    </div>
                                </div>

                                {/* Balance */}
                                <div className="mb-4">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(account.balance)}
                                    </p>
                                    {account.balance < 0 && (
                                        <p className="text-red-600 text-sm mt-1">
                                            Saldo negatif
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                {account.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {account.description}
                                    </p>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <Link
                                            href={route(
                                                "accounts.show",
                                                account.id
                                            )}
                                            className="p-2 text-blue-600 hover:text-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transform transition duration-150 hover:scale-110"
                                            title="Lihat"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "accounts.edit",
                                                account.id
                                            )}
                                            className="p-2 text-green-600 hover:text-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900 transform transition duration-150 hover:scale-110"
                                            title="Edit"
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() =>
                                                handleDelete(account)
                                            }
                                            className="p-2 text-red-600 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transform transition duration-150 hover:scale-110"
                                            title="Hapus"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {!account.is_default && (
                                        <button
                                            onClick={() =>
                                                handleSetDefault(account)
                                            }
                                            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transform transition duration-150 hover:scale-105"
                                        >
                                            Jadikan Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {accounts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 dark:text-gray-500 mb-4">
                                <Wallet className="h-16 w-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Belum ada akun
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Mulai dengan membuat akun pertama Anda
                            </p>
                            <Link
                                href={route("accounts.create")}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-flex items-center space-x-2"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Tambah Akun Pertama</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
