// resources/js/Pages/Categories/Edit.jsx

import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function CategoriesEdit({
    category,
    categoryTypes = ["income", "expense", "transfer"],
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name || "",
        type: category.type || "expense",
        color: category.color || "#6b46c1",
        icon: category.icon || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("categories.update", category.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Edit Kategori - ${category.name}`} />

            <div className="py-6">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route("categories.index")}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Kembali
                            </Link>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Edit: {category.name}
                            </h2>
                        </div>
                    </div>

                    <form
                        onSubmit={submit}
                        className="bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nama
                            </label>
                            <input
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            {errors.name && (
                                <div className="text-sm text-red-600 mt-1">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tipe
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                {categoryTypes.map((t) => (
                                    <option key={t} value={t}>
                                        {t === "income"
                                            ? "Pendapatan"
                                            : t === "expense"
                                            ? "Pengeluaran"
                                            : "Transfer"}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <div className="text-sm text-red-600 mt-1">
                                    {errors.type}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Warna
                                </label>
                                <input
                                    type="color"
                                    value={data.color}
                                    onChange={(e) =>
                                        setData("color", e.target.value)
                                    }
                                    className="mt-1 h-10 w-full p-0 border-none bg-transparent"
                                />
                                {errors.color && (
                                    <div className="text-sm text-red-600 mt-1">
                                        {errors.color}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Ikon (opsional)
                                </label>
                                <input
                                    value={data.icon}
                                    onChange={(e) =>
                                        setData("icon", e.target.value)
                                    }
                                    placeholder="mis. 💸 atau nama ikon"
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                                {errors.icon && (
                                    <div className="text-sm text-red-600 mt-1">
                                        {errors.icon}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end space-x-3 pt-4">
                            <Link
                                href={route("categories.index")}
                                className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 dark:text-gray-200"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
