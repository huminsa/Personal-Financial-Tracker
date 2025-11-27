import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BarChart3, TrendingUp, Download } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function MonthlyTrends({ monthly_trends = {}, filters = {} }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Monthly Trends Report" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Monthly Trends
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Analisis trend pendapatan dan pengeluaran
                                bulanan
                            </p>
                        </div>
                        <a
                            href={route("report.export", {
                                ...filters,
                                type: "monthly_trends",
                            })}
                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </a>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Income Period
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(
                                            monthly_trends?.summary
                                                ?.total_income
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-4">
                                    <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Expense Period
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(
                                            monthly_trends?.summary
                                                ?.total_expense
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Savings
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            (monthly_trends?.summary
                                                ?.total_savings || 0) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {formatCurrency(
                                            monthly_trends?.summary
                                                ?.total_savings
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Monthly Income vs Expense Trends
                        </h3>
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthly_trends?.data || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month_short" />
                                    <YAxis
                                        tickFormatter={(value) =>
                                            formatCurrency(value).replace(
                                                "Rp",
                                                ""
                                            )
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) =>
                                            formatCurrency(value)
                                        }
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Income"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="expense"
                                        stroke="#EF4444"
                                        strokeWidth={2}
                                        name="Expense"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="savings"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="Savings"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
