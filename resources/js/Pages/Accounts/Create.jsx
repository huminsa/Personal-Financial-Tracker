// resources/js/Pages/Accounts/Create.jsx

import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

export default function AccountsCreate({ accountTypes }) {
    const { data, setData, errors, post, processing } = useForm({
        name: "",
        type: "cash",
        balance: 0,
        color: "#3B82F6",
        description: "",
        include_in_net_worth: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("accounts.store"));
    };

    const accountTypeDetails = {
        cash: { icon: "💰", description: "Uang tunai fisik" },
        bank: { icon: "🏦", description: "Rekening bank" },
        ewallet: { icon: "📱", description: "Dompet digital" },
        credit_card: { icon: "💳", description: "Kartu kredit" },
        investment: { icon: "📈", description: "Investasi" },
    };

    // new: quotes untuk header
    const quotes = [
        "Catat kecil, kontrol besar. Mulai dari akun pertama Anda!",
        "Uang yang dicatat adalah uang yang dikelola.",
        "Konsistensi mencatat = kontrol finansial.",
        "Satu akun, satu tujuan: kendalikan alur uang Anda.",
    ];
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const idx = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[idx]);
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Akun" />

            <div className="py-8">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Header + Quote */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Tambah Akun Baru
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Buat akun baru untuk mencatat keuangan Anda
                            </p>
                            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-purple-100 dark:border-gray-700">
                                <blockquote className="text-sm italic text-gray-700 dark:text-gray-300">
                                    “{quote}”
                                </blockquote>
                            </div>
                        </div>

                        {/* Back button (animated) */}
                        <Link
                            href={route("accounts.index")}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-sm transform transition-transform duration-200 hover:-translate-x-1 hover:scale-[1.02] active:translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                            Kembali
                        </Link>
                    </div>

                    {/* Form (lebih besar / spacious) */}
                    <div className="bg-white dark:bg-gray-800 shadow-lg sm:rounded-lg p-8">
                        <form onSubmit={submit}>
                            <div className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nama Akun *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-150 shadow-sm"
                                        placeholder="Contoh: Dompet Utama, BCA, Gopay"
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tipe Akun *
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(accountTypes).map(
                                            ([key, label]) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() =>
                                                        setData("type", key)
                                                    }
                                                    className={`p-5 border rounded-lg text-left transition transform duration-150 ${
                                                        data.type === key
                                                            ? "border-purple-500 bg-gradient-to-tr from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 shadow-md scale-[1.01]"
                                                            : "border-gray-300 dark:border-gray-600 hover:border-purple-300 hover:scale-[1.02]"
                                                    }`}
                                                >
                                                    <div className="text-2xl mb-2">
                                                        {
                                                            accountTypeDetails[
                                                                key
                                                            ]?.icon
                                                        }
                                                    </div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {label}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {
                                                            accountTypeDetails[
                                                                key
                                                            ]?.description
                                                        }
                                                    </div>
                                                </button>
                                            )
                                        )}
                                    </div>
                                    {errors.type && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>

                                {/* Initial Balance */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Saldo Awal
                                    </label>
                                    <input
                                        type="number"
                                        value={data.balance}
                                        onChange={(e) =>
                                            setData(
                                                "balance",
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow duration-150"
                                        placeholder="0"
                                        step="0.01"
                                    />
                                    {errors.balance && (
                                        <p className="text-red-600 text-sm mt-1">
                                            {errors.balance}
                                        </p>
                                    )}
                                </div>

                                {/* Color & Description (grid) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Warna
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-16 h-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
                                            />
                                            <input
                                                type="text"
                                                value={data.color}
                                                onChange={(e) =>
                                                    setData(
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                                                placeholder="#3B82F6"
                                            />
                                        </div>
                                        {errors.color && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.color}
                                            </p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Deskripsi (Opsional)
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={3}
                                            className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                                            placeholder="Deskripsi tambahan tentang akun ini..."
                                        />
                                        {errors.description && (
                                            <p className="text-red-600 text-sm mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Include in Net Worth */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="include_in_net_worth"
                                        checked={data.include_in_net_worth}
                                        onChange={(e) =>
                                            setData(
                                                "include_in_net_worth",
                                                e.target.checked
                                            )
                                        }
                                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <label
                                        htmlFor="include_in_net_worth"
                                        className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        Sertakan dalam perhitungan Net Worth
                                    </label>
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("accounts.index")}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform duration-150 transform hover:-translate-y-0.5"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md flex items-center space-x-3 disabled:opacity-50 transform transition-transform duration-150 hover:-translate-y-0.5"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>
                                            {processing
                                                ? "Menyimpan..."
                                                : "Simpan Akun"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
