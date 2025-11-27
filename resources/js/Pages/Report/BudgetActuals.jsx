import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Download } from "lucide-react";

export default function BudgetActuals({ budget_actuals = {}, filters = {} }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Budget vs Actuals" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Budget vs Actuals
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Perbandingan budget dengan pengeluaran aktual -{" "}
                                {budget_actuals?.period?.month_name}{" "}
                                {budget_actuals?.period?.year}
                            </p>
                        </div>
                        <a
                            href={route("report.export", {
                                ...filters,
                                type: "budget_actuals",
                            })}
                            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-4 py-2 rounded-md flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                        </a>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total Budget
                            </p>
                            <p className="text-2xl font-bold text-purple-600">
                                {formatCurrency(
                                    budget_actuals?.summary?.total_budget
                                )}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total Actual
                            </p>
                            <p className="text-2xl font-bold text-blue-600">
                                {formatCurrency(
                                    budget_actuals?.summary?.total_actual
                                )}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Difference
                            </p>
                            <p
                                className={`text-2xl font-bold ${
                                    (budget_actuals?.summary
                                        ?.total_difference || 0) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {formatCurrency(
                                    budget_actuals?.summary?.total_difference
                                )}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Categories
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {budget_actuals?.summary?.budget_categories ||
                                    0}
                            </p>
                        </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transform transition-all duration-500 ease-out animate-fadeInUp hover:shadow-xl">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                            Budget Progress
                        </h3>
                        <div className="space-y-4">
                            {(budget_actuals?.data || []).map((item) => (
                                <div
                                    key={item.category_id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{
                                                    backgroundColor: item.color,
                                                }}
                                            ></div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {item.category_name}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(
                                                    item.actual_amount
                                                )}
                                            </span>
                                            <span className="text-gray-500 text-sm ml-2">
                                                /{" "}
                                                {formatCurrency(
                                                    item.budget_amount
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                item.status === "over_budget"
                                                    ? "bg-red-500"
                                                    : item.status ===
                                                      "on_budget"
                                                    ? "bg-green-500"
                                                    : "bg-blue-500"
                                            }`}
                                            style={{
                                                width: `${Math.min(
                                                    item.progress,
                                                    100
                                                )}%`,
                                            }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>
                                            {item.status === "over_budget"
                                                ? "Over budget by "
                                                : item.status === "on_budget"
                                                ? "On budget"
                                                : "Under budget by "}
                                            {item.status !== "on_budget" &&
                                                formatCurrency(
                                                    Math.abs(item.difference)
                                                )}
                                        </span>
                                        <span>{item.progress.toFixed(1)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
