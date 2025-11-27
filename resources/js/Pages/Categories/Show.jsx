import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function CategoryShow({ category, transactions }) {
    return (
        <AuthenticatedLayout header={category.name}>
            <Head title={category.name} />
            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route("categories.index")}
                            className="text-sm text-purple-600 flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Kategori
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                                style={{ backgroundColor: category.color }}
                            >
                                {category.icon}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {category.name}
                                </h2>
                                {category.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Transaksi terkait
                            </h3>
                            {transactions.data &&
                            transactions.data.length > 0 ? (
                                <ul className="space-y-2">
                                    {transactions.data.map((tx) => (
                                        <li
                                            key={tx.id}
                                            className="flex justify-between items-center p-2 border rounded"
                                        >
                                            <div>
                                                <div className="text-sm font-medium">
                                                    {tx.description ?? tx.notes}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {tx.transaction_date}
                                                </div>
                                            </div>
                                            <div
                                                className={`text-sm font-semibold ${
                                                    tx.amount >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {tx.amount}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    Tidak ada transaksi untuk kategori ini.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
