import React from "react";
import { useForm } from "@inertiajs/react";
import {
    X,
    Save,
    Calendar,
    Wallet,
    Tag,
    TrendingUp,
    TrendingDown,
    RefreshCw,
} from "lucide-react";

// Edit Modal yang lebih lengkap
export const EditTransactionModal = ({
    transaction,
    categories,
    accounts,
    onClose,
}) => {
    const { data, setData, put, processing, errors } = useForm({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category_id: transaction.category_id,
        from_account_id: transaction.from_account_id,
        to_account_id: transaction.to_account_id || "",
        transaction_date: transaction.transaction_date,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("transactions.update", transaction.id), {
            onSuccess: () => onClose(),
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getTypeColor = (type) => {
        const colors = {
            income: "text-green-600",
            expense: "text-red-600",
            transfer: "text-blue-600",
        };
        return colors[type];
    };

    const getTypeIcon = (type) => {
        const icons = {
            income: TrendingUp,
            expense: TrendingDown,
            transfer: RefreshCw,
        };
        const IconComponent = icons[type];
        return <IconComponent className="h-4 w-4" />;
    };

    // Filter categories based on transaction type
    const filteredCategories = categories.filter(
        (category) =>
            category.type === data.type || category.type === "transfer"
    );

    // Filter accounts for transfer
    const filteredToAccounts = accounts.filter(
        (account) => account.id !== data.from_account_id
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Edit Transaksi
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    {/* Transaction Type Display */}
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div
                            className={`p-2 rounded-lg ${getTypeColor(
                                data.type
                            )} bg-opacity-20`}
                        >
                            {getTypeIcon(data.type)}
                        </div>
                        <span className="font-medium capitalize">
                            {data.type === "income"
                                ? "Pendapatan"
                                : data.type === "expense"
                                ? "Pengeluaran"
                                : "Transfer"}
                        </span>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Jumlah *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                Rp
                            </span>
                            <input
                                type="number"
                                value={data.amount}
                                onChange={(e) =>
                                    setData(
                                        "amount",
                                        parseFloat(e.target.value) || ""
                                    )
                                }
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                step="0.01"
                                min="0.01"
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.amount}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Deskripsi *
                        </label>
                        <input
                            type="text"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.description && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Kategori *
                        </label>
                        <select
                            value={data.category_id}
                            onChange={(e) =>
                                setData("category_id", e.target.value)
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Pilih Kategori</option>
                            {filteredCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.category_id}
                            </p>
                        )}
                    </div>

                    {/* From Account */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {data.type === "income"
                                ? "Akun Tujuan"
                                : data.type === "expense"
                                ? "Akun Sumber"
                                : "Dari Akun"}{" "}
                            *
                        </label>
                        <select
                            value={data.from_account_id}
                            onChange={(e) =>
                                setData("from_account_id", e.target.value)
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">Pilih Akun</option>
                            {accounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                        {errors.from_account_id && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.from_account_id}
                            </p>
                        )}
                    </div>

                    {/* To Account (Only for Transfer) */}
                    {data.type === "transfer" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Ke Akun *
                            </label>
                            <select
                                value={data.to_account_id}
                                onChange={(e) =>
                                    setData("to_account_id", e.target.value)
                                }
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Pilih Akun Tujuan</option>
                                {filteredToAccounts.map((account) => (
                                    <option key={account.id} value={account.id}>
                                        {account.name}
                                    </option>
                                ))}
                            </select>
                            {errors.to_account_id && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.to_account_id}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Transaction Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal Transaksi *
                        </label>
                        <input
                            type="date"
                            value={data.transaction_date}
                            onChange={(e) =>
                                setData("transaction_date", e.target.value)
                            }
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {errors.transaction_date && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors.transaction_date}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Detail Modal
export const TransactionDetailModal = ({ transaction, onClose }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
    };

    const getTypeColor = (type) => {
        const colors = {
            income: "text-green-600",
            expense: "text-red-600",
            transfer: "text-blue-600",
        };
        return colors[type];
    };

    const getTypeLabel = (type) => {
        const labels = {
            income: "Pendapatan",
            expense: "Pengeluaran",
            transfer: "Transfer",
        };
        return labels[type];
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Detail Transaksi
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            Deskripsi
                        </span>
                        <span className="font-medium">
                            {transaction.description}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            Jumlah
                        </span>
                        <span
                            className={`font-bold ${getTypeColor(
                                transaction.type
                            )}`}
                        >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            Tipe
                        </span>
                        <span className="font-medium">
                            {getTypeLabel(transaction.type)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            Kategori
                        </span>
                        <span className="font-medium">
                            {transaction.category.name}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            Akun
                        </span>
                        <span className="font-medium">
                            {transaction.from_account.name}
                        </span>
                    </div>

                    {transaction.to_account && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                                Tujuan Transfer
                            </span>
                            <span className="font-medium">
                                {transaction.to_account.name}
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">
                            Tanggal
                        </span>
                        <span className="font-medium">
                            {new Date(
                                transaction.transaction_date
                            ).toLocaleDateString("id-ID")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
