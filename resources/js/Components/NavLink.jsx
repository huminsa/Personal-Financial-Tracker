import { Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    sidebar = false,
    icon = null,
    collapsed = false,
    tooltip = "",
    ...props
}) {
    // Default (top nav) styling
    const topClasses =
        "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
        (active
            ? "border-indigo-400 text-gray-900 dark:text-gray-100 focus:border-indigo-700"
            : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300 focus:border-gray-300 focus:text-gray-700");

    // Sidebar styling with dark mode
    const sidebarClasses =
        "flex items-center w-full text-sm rounded-lg px-3 py-2.5 transition-all duration-150 relative group " +
        (active
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-medium"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100");

    if (sidebar) {
        return (
            <Link
                {...props}
                className={sidebarClasses + (className ? " " + className : "") + (collapsed ? " justify-center" : " gap-3")}
            >
                {icon && (
                    <span className={active ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-gray-500"}>
                        {icon}
                    </span>
                )}
                
                {!collapsed && <span>{children}</span>}
                
                {/* Tooltip for collapsed state */}
                {collapsed && tooltip && (
                    <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                        {tooltip}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <Link
            {...props}
            className={topClasses + (className ? " " + className : "")}
        >
            {children}
        </Link>
    );
}