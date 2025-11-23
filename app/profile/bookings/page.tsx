"use client";

import { useBookingsStore } from "@/lib/bookings-store";
import { useLanguageStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/(ui)/card";
import { Badge } from "@/components/(ui)/badge";
import { Calendar, MapPin, Hotel as HotelIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BookingsPage() {
    const { bookings } = useBookingsStore();
    const { locale } = useLanguageStore();
    const t = (esStr: string, enStr: string) => (locale === "es" ? esStr : enStr);

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "PPP", { locale: locale === "es" ? es : undefined });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t("Mis Reservas", "My Bookings")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t(
                        "Aquí puedes ver el historial de tus reservas.",
                        "Here you can see your booking history."
                    )}
                </p>
            </div>
            <div className="space-y-4">
                {bookings.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        {t("No tienes reservas aún.", "You don't have any bookings yet.")}
                    </div>
                ) : (
                    bookings.map((booking) => (
                        <Card key={booking.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{booking.hotel.nombre}</CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {booking.hotel.ciudad}, {booking.hotel.pais}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={
                                            booking.status === "confirmed"
                                                ? "default"
                                                : booking.status === "cancelled"
                                                    ? "destructive"
                                                    : "secondary"
                                        }
                                        className={booking.status === "confirmed" ? "bg-[#00C2A8] hover:bg-[#00A08A]" : ""}
                                    >
                                        {booking.status === "confirmed"
                                            ? t("Confirmada", "Confirmed")
                                            : booking.status === "cancelled"
                                                ? t("Cancelada", "Cancelled")
                                                : t("Completada", "Completed")}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>
                                                {t("Check-in:", "Check-in:")} {formatDate(booking.checkIn)}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            <span>
                                                {t("Check-out:", "Check-out:")} {formatDate(booking.checkOut)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <HotelIcon className="h-4 w-4 mr-2" />
                                            <span>
                                                {booking.rooms.length} {t("Habitación(es)", "Room(s)")}
                                            </span>
                                        </div>
                                        <div className="font-medium">
                                            {t("Total:", "Total:")} ${booking.totalPrice.toLocaleString()} COP
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
