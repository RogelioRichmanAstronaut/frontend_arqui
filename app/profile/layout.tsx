"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Calendar, Bell, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string;
        title: string;
        icon: React.ReactNode;
    }[];
}

function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname();
    const { user } = useAuthStore();

    return (
        <div className="flex flex-col space-y-6">
            {/* User Header */}
            <div className="px-2 mb-2">
                <h2 className="text-lg font-bold text-[#0A2540]">
                    {user?.names || "Usuario"}
                </h2>
                <p className="text-sm text-gray-500">
                    {user?.email || ""}
                </p>
            </div>

            <nav
                className={cn(
                    "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-3",
                    className
                )}
                {...props}
            >
                {items.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "justify-start transition-all duration-200",
                            pathname === item.href
                                ? "bg-[#00C2A8]/10 text-[#00C2A8]"
                                : "text-gray-600 hover:bg-gray-50 hover:text-[#0A2540]",
                            "group flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium"
                        )}
                    >
                        <span className={cn(
                            "mr-3",
                            pathname === item.href ? "text-[#00C2A8]" : "text-gray-400 group-hover:text-[#0A2540]"
                        )}>
                            {item.icon}
                        </span>
                        <span>
                            {item.title}
                        </span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { locale } = useLanguageStore();
    const { user } = useAuthStore();
    const t = (es: string, en: string) => (locale === "es" ? es : en);
    const isAdmin = user?.role === 'ADMIN';

    const sidebarNavItems = [
        {
            title: t("Perfil", "Profile"),
            href: "/profile",
            icon: <User className="h-5 w-5" />,
        },
        {
            title: t("Mis Reservas", "My Bookings"),
            href: "/profile/bookings",
            icon: <Calendar className="h-5 w-5" />,
        },
        {
            title: t("Notificaciones", "Notifications"),
            href: "/profile/notifications",
            icon: <Bell className="h-5 w-5" />,
        },
        // Admin-only link
        ...(isAdmin ? [{
            title: t("Reportes", "Reports"),
            href: "/admin/reports",
            icon: <BarChart3 className="h-5 w-5" />,
        }] : []),
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container py-12 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <aside className="lg:w-64 flex-shrink-0">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <div className="flex-1 lg:max-w-4xl">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:p-10">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
