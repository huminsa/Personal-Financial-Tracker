import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Download } from "lucide-react";
import {
    PieChart as RePieChart,
    Pie as RePie,
    Cell,
    BarChart,
    Bar as ReBar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export default function SpendingCategory({
    spending_categories = {},
    filters = {},
}) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Spending by Category" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Spending by Category
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Analisis pengeluaran berdasarkan kategori
                            </p>
                        </div>
                        <a
                            href={route("report.export", {
                                ...filters,
                                type: "spending_category",
                            })}
                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </a>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total Spent
                            </p>
                            <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(
                                    spending_categories?.summary?.total_spent
                                )}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Transactions
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {spending_categories?.summary
                                    ?.total_transactions || 0}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Avg per Transaction
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(
                                    spending_categories?.summary
                                        ?.average_per_transaction
                                )}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Top Category
                            </p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                                {spending_categories?.summary?.top_category
                                    ?.name || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Pie Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Spending Distribution
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
                                            data={
                                                spending_categories?.data || []
                                            }
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percentage }) =>
                                                `${name} (${percentage}%)`
                                            }
                                            outerRadius={80}
                                            dataKey="amount"
                                        >
                                            {(
                                                spending_categories?.data || []
                                            ).map((entry, index) => (
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

                        {/* Bar Chart */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                Spending by Category
                            </h3>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={spending_categories?.data || []}
                                        margin={{ bottom: 60 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
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
                                        <ReBar dataKey="amount">
                                            {(
                                                spending_categories?.data || []
                                            ).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </ReBar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Category Details
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="text-left py-3 px-4">
                                            Category
                                        </th>
                                        <th className="text-right py-3 px-4">
                                            Amount
                                        </th>
                                        <th className="text-right py-3 px-4">
                                            Percentage
                                        </th>
                                        <th className="text-right py-3 px-4">
                                            Transactions
                                        </th>
                                        <th className="text-right py-3 px-4">
                                            Average
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(spending_categories?.data || []).map(
                                        (category) => (
                                            <tr
                                                key={category.id}
                                                className="border-b border-gray-100 dark:border-gray-800"
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-full mr-2"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color,
                                                            }}
                                                        ></div>
                                                        {category.name}
                                                    </div>
                                                </td>
                                                <td className="text-right py-3 px-4 font-medium">
                                                    {formatCurrency(
                                                        category.amount
                                                    )}
                                                </td>
                                                <td className="text-right py-3 px-4 text-gray-500">
                                                    {category.percentage}%
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {category.count}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    {formatCurrency(
                                                        category.average
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
