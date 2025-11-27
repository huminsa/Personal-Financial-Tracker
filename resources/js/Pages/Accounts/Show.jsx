import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Wallet, Calendar } from "lucide-react";

export default function AccountShow({ account, transactions }) {
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <AuthenticatedLayout header={account.name}>
            <Head title={account.name} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route("accounts.index")}
                                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Kembali
                            </Link>
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
                                    style={{ backgroundColor: account.color }}
                                >
                                    {account.type
                                        ? account.type.charAt(0).toUpperCase()
                                        : "A"}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {account.name}
                                    </h2>
                                    {account.description && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {account.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Saldo Saat Ini
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {formatCurrency(account.balance)}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <Wallet className="h-8 w-8 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Transaksi
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {transactions.total ||
                                            (transactions.data
                                                ? transactions.data.length
                                                : 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Transaksi Bulan Ini
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {transactions.data
                                            ? transactions.data.filter(
                                                  (t) =>
                                                      new Date(
                                                          t.transaction_date
                                                      ).getMonth() ===
                                                          new Date().getMonth() &&
                                                      new Date(
                                                          t.transaction_date
                                                      ).getFullYear() ===
                                                          new Date().getFullYear()
                                              ).length
                                            : 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Include in Net Worth
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {account.include_in_net_worth
                                        ? "Ya"
                                        : "Tidak"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transactions list */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Transaksi Terbaru
                            </h3>
                        </div>

                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.data &&
                            transactions.data.length > 0 ? (
                                transactions.data.map((tx) => (
                                    <div key={tx.id} className="p-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {tx.description || tx.notes}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {tx.category
                                                        ? tx.category.name
                                                        : ""}
                                                    <span className="mx-2">
                                                        •
                                                    </span>
                                                    {tx.fromAccount
                                                        ? tx.fromAccount.name
                                                        : ""}
                                                    {tx.toAccount && (
                                                        <>
                                                            <span className="mx-2">
                                                                →
                                                            </span>
                                                            {tx.toAccount.name}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className={`font-semibold ${
                                                        tx.type === "income"
                                                            ? "text-green-600"
                                                            : tx.type ===
                                                              "expense"
                                                            ? "text-red-600"
                                                            : "text-blue-600"
                                                    }`}
                                                >
                                                    {tx.type === "income"
                                                        ? "+"
                                                        : tx.type === "expense"
                                                        ? "-"
                                                        : ""}
                                                    {formatCurrency(tx.amount)}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(
                                                        tx.transaction_date
                                                    ).toLocaleDateString(
                                                        "id-ID"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Belum ada transaksi untuk akun ini.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination (render links jika tersedia) */}
                        {transactions.links &&
                            transactions.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-700 dark:text-gray-300">
                                            Menampilkan {transactions.from}{" "}
                                            sampai {transactions.to} dari{" "}
                                            {transactions.total}
                                        </div>
                                        <div className="flex space-x-1">
                                            {transactions.links.map(
                                                (link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={link.url || "#"}
                                                        className={`px-3 py-1 rounded-md text-sm ${
                                                            link.active
                                                                ? "bg-purple-600 text-white"
                                                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
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
        </AuthenticatedLayout>
    );
}
