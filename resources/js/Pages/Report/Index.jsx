import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    BarChart3,
    PieChart,
    TrendingUp,
    Calendar,
    Filter,
    Download,
    Eye,
    Pie,
    Bar,
} from "lucide-react";
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
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

export default function ReportsIndex({
    total_income = 0,
    total_expense = 0,
    net_flow = 0,
    expense_by_category = [],
    top_categories = [],
    total_assets = 0,
    total_liabilities = 0,
    net_worth = 0,
    filters = {},
}) {
    const [dateRange, setDateRange] = useState({
        start_date:
            filters.start_date ||
            new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                .toISOString()
                .split("T")[0],
        end_date: filters.end_date || new Date().toISOString().split("T")[0],
    });

    const [reportType, setReportType] = useState(filters.type || "overview");

    const formatCurrency = (amount) => {
        if (!amount || isNaN(amount)) return "Rp 0";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const applyFilters = () => {
        router.get(
            route("report.index"),
            {
                ...dateRange,
                type: reportType,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Data untuk charts
    const expenseChartData = expense_by_category.map((item) => ({
        name: item.name,
        value: item.amount,
        color: item.color,
        percentage: item.percentage,
    }));

    const monthlyTrendData = [
        { month: "Jan", income: 12000000, expense: 8000000 },
        { month: "Feb", income: 15000000, expense: 9000000 },
        { month: "Mar", income: 13000000, expense: 8500000 },
        { month: "Apr", income: 16000000, expense: 11000000 },
        { month: "Mei", income: 14000000, expense: 9500000 },
        { month: "Jun", income: 17000000, expense: 12000000 },
    ];

    const cashFlowData = [
        { name: "Pendapatan", amount: total_income },
        { name: "Pengeluaran", amount: total_expense },
        { name: "Net Flow", amount: net_flow },
    ];

    const netWorthData = [
        { name: "Assets", value: total_assets, color: "#10B981" },
        { name: "Liabilities", value: total_liabilities, color: "#EF4444" },
    ];

    // Custom tooltip untuk currency
    const CurrencyTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 
        transform transition-all duration-500 ease-out
        animate-fadeInUp hover:shadow-xl">
                    <p className="font-semibold text-gray-900 dark:text-white">
                        {label}
                    </p>
                    {payload.map((entry, index) => (
                        <p
                            key={index}
                            style={{ color: entry.color }}
                            className="text-sm"
                        >
                            {entry.name}: {formatCurrency(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporan & Analytics" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Laporan & Analytics
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Analisis keuangan dan visualisasi data
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Report Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Jenis Laporan
                                </label>
                                <select
                                    value={reportType}
                                    onChange={(e) =>
                                        setReportType(e.target.value)
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="overview">Overview</option>
                                    <option value="expense_analysis">
                                        Analisis Pengeluaran
                                    </option>
                                    <option value="income_analysis">
                                        Analisis Pendapatan
                                    </option>
                                    <option value="cash_flow">Cash Flow</option>
                                    <option value="net_worth">Net Worth</option>
                                </select>
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.start_date}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            start_date: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.end_date}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            end_date: e.target.value,
                                        })
                                    }
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-end space-x-2">
                                <button
                                    onClick={applyFilters}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 flex-1"
                                >
                                    <Filter className="h-4 w-4" />
                                    <span>Terapkan</span>
                                </button>
                                <a
                                    href={route("report.export", {
                                        ...dateRange,
                                        type: reportType,
                                    })}
                                    className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md"
                                >
                                    <Download className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Overview Report */}
                    {reportType === "overview" && (
                        <div className="space-y-6">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                                                {formatCurrency(total_income)}
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
                                                Total Pengeluaran
                                            </p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {formatCurrency(total_expense)}
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
                                                Net Cash Flow
                                            </p>
                                            <p
                                                className={`text-2xl font-bold ${
                                                    net_flow >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {formatCurrency(net_flow)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Expense by Category Pie Chart */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Pengeluaran per Kategori
                                        </h3>
                                        <PieChart className="h-5 w-5 text-gray-400" />
                                    </div>

                                    <div className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <RePieChart>
                                                <Tooltip
                                                    content={
                                                        <CurrencyTooltip />
                                                    }
                                                />
                                                <RePie
                                                    data={expenseChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({
                                                        name,
                                                        percentage,
                                                    }) =>
                                                        `${name} (${percentage}%)`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {expenseChartData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    entry.color
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </RePie>
                                            </RePieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Cash Flow Bar Chart */}
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Cash Flow Summary
                                        </h3>
                                        <BarChart3 className="h-5 w-5 text-gray-400" />
                                    </div>

                                    <div className="h-80">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart data={cashFlowData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis
                                                    tickFormatter={(value) =>
                                                        formatCurrency(
                                                            value
                                                        ).replace("Rp", "")
                                                    }
                                                />
                                                <Tooltip
                                                    formatter={(value) =>
                                                        formatCurrency(value)
                                                    }
                                                />
                                                <ReBar
                                                    dataKey="amount"
                                                    fill="#8884d8"
                                                    shape={({
                                                        x,
                                                        y,
                                                        width,
                                                        height,
                                                        ...rest
                                                    }) => {
                                                        const isPositive =
                                                            rest.payload
                                                                .amount >= 0;
                                                        return (
                                                            <rect
                                                                x={x}
                                                                y={y}
                                                                width={width}
                                                                height={height}
                                                                fill={
                                                                    isPositive
                                                                        ? "#10B981"
                                                                        : "#EF4444"
                                                                }
                                                                rx={4}
                                                            />
                                                        );
                                                    }}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Trend Line Chart */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Trend Bulanan (Contoh)
                                    </h3>
                                    <TrendingUp className="h-5 w-5 text-gray-400" />
                                </div>

                                <div className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={monthlyTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis
                                                tickFormatter={(value) =>
                                                    formatCurrency(
                                                        value
                                                    ).replace("Rp", "")
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
                                                name="Pendapatan"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="expense"
                                                stroke="#EF4444"
                                                strokeWidth={2}
                                                name="Pengeluaran"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Net Worth Report */}
                    {reportType === "net_worth" && (
                        <div className="space-y-6">
                            {/* Net Worth Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
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

                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-4">
                                            <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Total Liabilities
                                            </p>
                                            <p className="text-2xl font-bold text-red-600">
                                                {formatCurrency(
                                                    total_liabilities
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
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
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                    Komposisi Net Worth
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
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
                                                    `${name}: ${formatCurrency(
                                                        value
                                                    )}`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {netWorthData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </RePie>
                                        </RePieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Other Reports */}
                    {[
                        "expense_analysis",
                        "income_analysis",
                        "cash_flow",
                    ].includes(reportType) && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                                {reportType === "expense_analysis" &&
                                    "Analisis Pengeluaran Mendalam"}
                                {reportType === "income_analysis" &&
                                    "Analisis Pendapatan"}
                                {reportType === "cash_flow" &&
                                    "Laporan Cash Flow"}
                            </h3>
                            <div className="text-center py-12">
                                <BarChart3 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    {reportType === "expense_analysis" &&
                                        "Detailed expense analysis with advanced charts"}
                                    {reportType === "income_analysis" &&
                                        "Income analysis and revenue trends"}
                                    {reportType === "cash_flow" &&
                                        "Cash flow statement and analysis"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
