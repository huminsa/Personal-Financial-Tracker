import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useTheme } from "@/Contexts/ThemeContext";
import {
    LayoutDashboard,
    Users,
    Settings,
    FolderGit2,
    BookOpen,
    ChevronDown,
    LogOut,
    UserCircle,
    Menu,
    X,
    Sun,
    Moon,
    HandCoins,
    Wallet,
    PieChart,
    BarChart,
    BarChart3,
    BarChart3Icon,
    PieChartIcon,
    PiggyBank,
    LineChart,
    FileText,
    Database,
    DollarSign,
} from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { darkMode, toggleDarkMode } = useTheme();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [sidebarUserDropdown, setSidebarUserDropdown] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        const saved = localStorage.getItem("sidebarCollapsed");
        return saved === "true";
    });

    // replace existing hasRoute / routeUrl / routeCurrent with safer versions
    const hasRoute = typeof route === "function";

    const routeUrl = (name, params) => {
        if (!hasRoute) return "#";
        try {
            return route(name, params);
        } catch (e) {
            // jika Ziggy/route tidak tersedia atau pemanggilan gagal, fallback ke '#'
            return "#";
        }
    };

    const routeCurrent = (name) => {
        if (!hasRoute) return false;
        try {
            // beberapa versi Ziggy expose current lewat route().current(...)
            // coba panggil dengan cara aman
            if (
                typeof route === "function" &&
                typeof route().current === "function"
            ) {
                return route().current(name);
            }
        } catch (e) {
            // ignore
        }
        try {
            // fallback jika route.current ada sebagai properti statis
            if (typeof route.current === "function") {
                return route.current(name);
            }
        } catch (e) {
            // ignore
        }
        return false;
    };

    const toggleSidebar = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem("sidebarCollapsed", newState.toString());
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside
                className={`bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${
                    sidebarCollapsed ? "w-20" : "w-64"
                }`}
            >
                {/* Logo & Toggle Button */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
                    {!sidebarCollapsed && (
                        <Link href="/" className="flex items-center gap-2">
                            {/* replaced ApplicationLogo with static image */}
                            <img
                                src="/images/logo.png"
                                alt="Personal Tracker"
                                className="h-8 w-8 object-contain"
                            />
                            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                Personal Tracker
                            </span>
                        </Link>
                    )}

                    {sidebarCollapsed && (
                        <Link href="/" className="flex items-center mx-auto">
                            <img
                                src="/images/logo.png"
                                alt="Personal Tracker"
                                className="h-8 w-8 object-contain"
                            />
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    {!sidebarCollapsed && (
                        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mb-2">
                            Personal Tracker
                        </div>
                    )}

                    <ul className="space-y-1">
                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("dashboard")}
                                active={routeCurrent("dashboard")}
                                icon={<LayoutDashboard className="w-5 h-5" />}
                                tooltip="Dashboard"
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        {/* core finance */}
                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("transactions.index")}
                                active={routeCurrent("transactions.index")}
                                icon={<DollarSign className="w-5 h-5" />}
                                tooltip="Transactions"
                            >
                                Transactions
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("budgets.index")}
                                active={routeCurrent("budgets.index")}
                                icon={<Wallet className="w-5 h-5" />}
                                tooltip="Budgets"
                            >
                                Budgets
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("accounts.index")}
                                active={routeCurrent("accounts.index")}
                                icon={<HandCoins className="w-5 h-5" />}
                                tooltip="Accounts"
                            >
                                Accounts
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("categories.index")}
                                active={routeCurrent("categories.index")}
                                icon={<PieChart className="w-5 h-5" />}
                                tooltip="Categories"
                            >
                                Categories
                            </NavLink>
                        </li>

                        {/* --- Analytic section--- */}
                        {!sidebarCollapsed && (
                            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mt-6 mb-2">
                                Analytics
                            </div>
                        )}

                        {/* <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("report.index")}
                                active={routeCurrent("report.index")}
                                icon={<BookOpen className="w-5 h-5" />}
                                tooltip="Income & Expenses"
                            >
                                Reports
                            </NavLink>
                        </li> */}
                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("report.monthly-trends")}
                                active={routeCurrent("report.monthly-trends")}
                                icon={<BarChart3 className="w-5 h-5" />}
                                tooltip="Monthly Trends"
                            >
                                Month
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("report.spending-category")}
                                active={routeCurrent(
                                    "report.spending-category"
                                )}
                                icon={<PieChart className="w-5 h-5" />}
                                tooltip="Spending by Category"
                            >
                                Spending By Category
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("report.budget-actuals")}
                                active={routeCurrent("report.budget-actuals")}
                                icon={<PiggyBank className="w-5 h-5" />}
                                tooltip="Budget vs Actuals"
                            >
                                Budget vs Actuals
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href={routeUrl("report.net-worth")}
                                active={routeCurrent("report.net-worth")}
                                icon={<LineChart className="w-5 h-5" />}
                                tooltip="Net Worth"
                            >
                                Net Worth
                            </NavLink>
                        </li>

                        {/* --- Reports --- */}
                        {!sidebarCollapsed && (
                            <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-3 mt-4 mb-2">
                                Reports
                            </div>
                        )}

                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href="#"
                                icon={<FileText className="w-5 h-5" />}
                                tooltip="Monthly Pdf Reports"
                            >
                                Monthly Reports
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                sidebar
                                collapsed={sidebarCollapsed}
                                href="#"
                                icon={<Database className="w-5 h-5" />}
                                tooltip="Import / Export"
                            >
                                Import / Export
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* User Section at Bottom */}
                <div className="border-t border-gray-100 dark:border-gray-700 p-4">
                    {!sidebarCollapsed ? (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setSidebarUserDropdown(!sidebarUserDropdown)
                                }
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                            >
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                        {user.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {user.email}
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                                        sidebarUserDropdown ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {/* Dropdown Menu */}
                            {sidebarUserDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() =>
                                            setSidebarUserDropdown(false)
                                        }
                                    />
                                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                                        <Link
                                            href={routeUrl("profile.edit")}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                        >
                                            <UserCircle className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <Link
                                            href={routeUrl("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Log out
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        // Collapsed user avatar
                        <div className="flex justify-center">
                            <div className="relative group">
                                <button
                                    onClick={() =>
                                        setSidebarUserDropdown(
                                            !sidebarUserDropdown
                                        )
                                    }
                                    className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 dark:hover:ring-offset-gray-800 transition-all duration-150"
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </button>

                                {/* Tooltip */}
                                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                                    {user.name}
                                </div>

                                {/* Dropdown for collapsed state */}
                                {sidebarUserDropdown && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() =>
                                                setSidebarUserDropdown(false)
                                            }
                                        />
                                        <div className="absolute left-full ml-2 bottom-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20 w-48">
                                            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <Link
                                                href={routeUrl("profile.edit")}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                            >
                                                <UserCircle className="w-4 h-4" />
                                                Settings
                                            </Link>
                                            <Link
                                                href={routeUrl("logout")}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Log out
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6">
                    {/* Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="mr-4 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                        title={
                            sidebarCollapsed
                                ? "Expand sidebar"
                                : "Collapse sidebar"
                        }
                    >
                        {sidebarCollapsed ? (
                            <Menu className="w-5 h-5" />
                        ) : (
                            <X className="w-5 h-5" />
                        )}
                    </button>

                    <div className="flex-1">
                        {header && (
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {header}
                            </h1>
                        )}
                    </div>

                    {/* Dark Mode Toggle & User Dropdown */}
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle Button with animated icons */}
                        <button
                            onClick={toggleDarkMode}
                            className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 transition-colors duration-200"
                            title={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                            aria-label={
                                darkMode
                                    ? "Switch to light mode"
                                    : "Switch to dark mode"
                            }
                        >
                            <div className="relative w-5 h-5">
                                <Sun
                                    className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
                                        darkMode
                                            ? "opacity-0 rotate-90"
                                            : "opacity-100 rotate-0"
                                    }`}
                                />
                                <Moon
                                    className={`absolute inset-0 w-5 h-5 text-indigo-400 transition-all duration-300 ${
                                        darkMode
                                            ? "opacity-100 rotate-0"
                                            : "opacity-0 -rotate-90"
                                    }`}
                                />
                            </div>
                        </button>

                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline">
                                        {user.name}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={routeUrl("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={routeUrl("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
