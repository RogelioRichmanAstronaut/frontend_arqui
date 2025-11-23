"use client";

import { useNotificationsStore } from "@/lib/notifications-store";
import { useLanguageStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
    const { notifications, markAsRead, clearNotifications } = useNotificationsStore();
    const { locale } = useLanguageStore();
    const t = (esStr: string, enStr: string) => (locale === "es" ? esStr : enStr);

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "PPP p", { locale: locale === "es" ? es : undefined });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">{t("Notificaciones", "Notifications")}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            "Mantente informado sobre tus viajes y actualizaciones.",
                            "Stay informed about your trips and updates."
                        )}
                    </p>
                </div>
                {notifications.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("Borrar todas", "Clear all")}
                    </Button>
                )}
            </div>
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        {t("No tienes notificaciones.", "You have no notifications.")}
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <Card key={notification.id} className={cn("transition-colors", !notification.read && "bg-muted/50 border-l-4 border-l-[#00C2A8]")}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <Bell className={cn("h-4 w-4", notification.read ? "text-muted-foreground" : "text-[#00C2A8]")} />
                                        <CardTitle className="text-base">{notification.title}</CardTitle>
                                    </div>
                                    {!notification.read && (
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => markAsRead(notification.id)}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                                <p className="text-xs text-muted-foreground/60">{formatDate(notification.date)}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
