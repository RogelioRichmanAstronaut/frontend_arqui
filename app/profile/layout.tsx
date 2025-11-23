"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Calendar, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/lib/store";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string;
        title: string;
        icon: React.ReactNode;
    }[];
}

function SidebarNav({ className, items, ...props }: SidebarNavProps) {
    const pathname = usePathname();

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "justify-start hover:bg-transparent hover:underline",
                        pathname === item.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 text-sm font-medium"
                    )}
                >
                    <span className={cn(
                        "mr-2",
                        pathname === item.href ? "text-[#00C2A8]" : "text-muted-foreground"
                    )}>
                        {item.icon}
                    </span>
                    <span className={cn(
                        pathname === item.href ? "text-[#0A2540] font-semibold" : "text-muted-foreground"
                    )}>
                        {item.title}
                    </span>
                </Link>
            ))}
        </nav>
    );
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { locale } = useLanguageStore();
    const t = (es: string, en: string) => (locale === "es" ? es : en);

    const sidebarNavItems = [
        {
            title: t("Perfil", "Profile"),
            href: "/profile",
            icon: <User className="h-4 w-4" />,
        },
        {
            title: t("Mis Reservas", "My Bookings"),
            href: "/profile/bookings",
            icon: <Calendar className="h-4 w-4" />,
        },
        {
            title: t("Notificaciones", "Notifications"),
            href: "/profile/notifications",
            icon: <Bell className="h-4 w-4" />,
        },
    ];

    return (
        <div className="container py-10">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav items={sidebarNavItems} />
                </aside>
                <div className="flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    );
}
