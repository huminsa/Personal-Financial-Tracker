import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { TrendingUp, Eye, Download } from "lucide-react";
import {
    PieChart as RePieChart,
    Pie as RePie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

export default function NetWorth({
    total_assets = 0,
    total_liabilities = 0,
    net_worth = 0,
    filters = {},
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const netWorthData = [
        { name: "Assets", value: total_assets, color: "#10B981" },
        { name: "Liabilities", value: total_liabilities, color: "#EF4444" },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Net Worth Report" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Net Worth
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Analisis total kekayaan bersih
                            </p>
                        </div>
                        <a
                            href={route("report.export", {
                                ...filters,
                                type: "net_worth",
                            })}
                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </a>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                                    <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Assets
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {formatCurrency(total_assets)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-4">
                                    <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Total Liabilities
                                    </p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {formatCurrency(total_liabilities)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                                    <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Net Worth
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            net_worth >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {formatCurrency(net_worth)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Net Worth Composition */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Net Worth Composition
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Tooltip
                                        formatter={(value) =>
                                            formatCurrency(value)
                                        }
                                    />
                                    <RePie
                                        data={netWorthData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) =>
                                            `${name}: ${formatCurrency(value)}`
                                        }
                                        outerRadius={100}
                                        dataKey="value"
                                    >
                                        {netWorthData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                            />
                                        ))}
                                    </RePie>
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
