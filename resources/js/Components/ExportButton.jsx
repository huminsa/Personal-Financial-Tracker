// resources/js/Components/ExportButton.jsx

import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Download } from "lucide-react";

export default function ExportButton({ filters, reportType }) {
    const [processing, setProcessing] = useState(false);

    const handleExport = (format) => {
        setProcessing(true);
        router.post(
            route("report.export"),
            {
                ...filters,
                type: reportType,
                format: format,
            },
            {
                preserveState: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <div className="relative group">
            <button
                disabled={processing}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-md disabled:opacity-50"
            >
                <Download className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                    <button
                        onClick={() => handleExport("pdf")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Export as PDF
                    </button>
                    <button
                        onClick={() => handleExport("excel")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Export as Excel
                    </button>
                    <button
                        onClick={() => handleExport("csv")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Export as CSV
                    </button>
                </div>
            </div>
        </div>
    );
}
