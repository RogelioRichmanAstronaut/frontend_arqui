"use client";

import { useBookingsStore } from "@/lib/bookings-store";
import { useAuthStore } from "@/lib/auth-store";
// import { useReservations } from "@/lib/hooks/useReservations"; // Deshabilitado: servicios externos
import { useLanguageStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/(ui)/card";
import { Badge } from "@/components/(ui)/badge";
import { Skeleton } from "@/components/(ui)/skeleton";
import { Calendar, MapPin, Hotel as HotelIcon, DollarSign, Plane, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function BookingsPage() {
    const { bookings: localBookings, flightBookings: localFlightBookings } = useBookingsStore();
    const { clientId } = useAuthStore();
    // const { data: backendReservations, isLoading, error } = useReservations(clientId); // Deshabilitado: servicios externos
    const { locale } = useLanguageStore();
    const t = (esStr: string, enStr: string) => (locale === "es" ? esStr : enStr);

    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "PPP", { locale: locale === "es" ? es : undefined });
        } catch (e) {
            return dateStr;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { variant: "default" | "destructive" | "secondary", label: string }> = {
            'confirmed': { variant: 'default', label: t("Confirmada", "Confirmed") },
            'cancelled': { variant: 'destructive', label: t("Cancelada", "Cancelled") },
            'completed': { variant: 'secondary', label: t("Completada", "Completed") },
            'pending': { variant: 'secondary', label: t("Pendiente", "Pending") },
        };
        return statusMap[status.toLowerCase()] || { variant: 'secondary', label: status };
    };

    // Por ahora usar solo datos locales (sin backend de reservas - servicio externo)
    const hasBookings = localBookings.length > 0 || localFlightBookings.length > 0;

    /* Temporalmente deshabilitado - requiere servicios externos
    if (isLoading) { ... }
    if (error) { ... }
    */

    // Mostrar solo reservas locales por ahora
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{t("Mis Reservas", "My Bookings")}</h3>
                <p className="text-sm text-muted-foreground">
                    {t(
                        "Aquí puedes ver el historial de tus reservas locales.",
                        "Here you can see your local booking history."
                    )}
                </p>
            </div>
            
            <div className="space-y-4">
                {!hasBookings ? (
                    <div className="text-center py-10 text-muted-foreground">
                        {t("No tienes reservas aún.", "You don't have any bookings yet.")}
                    </div>
                ) : (
                    <>
                        {/* Hotel bookings */}
                        {localBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <HotelIcon className="h-5 w-5 text-[#00C2A8]" />
                                                {booking.hotel.nombre}
                                            </CardTitle>
                                            <CardDescription className="flex items-center mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {booking.hotel.ciudad}, {booking.hotel.pais}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={getStatusBadge(booking.status).variant}
                                            className={booking.status === "confirmed" ? "bg-[#00C2A8] hover:bg-[#00A08A]" : ""}
                                        >
                                            {getStatusBadge(booking.status).label}
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
                        ))}
                        
                        {/* Flight bookings */}
                        {localFlightBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Plane className="h-5 w-5 text-[#00C2A8]" />
                                                {booking.flight.airline}
                                            </CardTitle>
                                            <CardDescription className="flex items-center mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {booking.origin} → {booking.destination}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={getStatusBadge(booking.status).variant}
                                            className={booking.status === "confirmed" ? "bg-[#00C2A8] hover:bg-[#00A08A]" : ""}
                                        >
                                            {getStatusBadge(booking.status).label}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>
                                                    {t("Salida:", "Departure:")} {formatDate(booking.departureDate)}
                                                </span>
                                            </div>
                                            {booking.returnDate && (
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    <span>
                                                        {t("Retorno:", "Return:")} {formatDate(booking.returnDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Users className="h-4 w-4 mr-2" />
                                                <span>
                                                    {booking.passengers} {t("Pasajero(s)", "Passenger(s)")}
                                                </span>
                                            </div>
                                            <div className="font-medium">
                                                {t("Total:", "Total:")} ${booking.totalPrice.toLocaleString()} COP
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </div>
        </div>
    );

    /* Código anterior que usaba backend - temporalmente deshabilitado
    if (error) {
        return (
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">{t("Mis Reservas", "My Bookings")}</h3>
                    <p className="text-sm text-destructive">
                        {t("Error al cargar reservas. Mostrando reservas locales.", "Error loading reservations. Showing local bookings.")}
                    </p>
                </div>
                <div className="space-y-4">
                    {localBookings.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            {t("No tienes reservas aún.", "You don't have any bookings yet.")}
                        </div>
                    ) : (
                        localBookings.map((booking) => (
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
                                            variant={getStatusBadge(booking.status).variant}
                                            className={booking.status === "confirmed" ? "bg-[#00C2A8] hover:bg-[#00A08A]" : ""}
                                        >
                                            {getStatusBadge(booking.status).label}
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

    // Show backend reservations
    const hasReservations = backendReservations && backendReservations.length > 0;

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
                {!hasReservations ? (
                    <div className="text-center py-10 text-muted-foreground">
                        {t("No tienes reservas aún.", "You don't have any bookings yet.")}
                    </div>
                ) : (
                    backendReservations.map((reservation) => (
                        <Card key={reservation.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">
                                            {t("Reserva", "Reservation")} #{reservation.id.slice(0, 8)}
                                        </CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {formatDate(reservation.createdAt)}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant={getStatusBadge(reservation.status).variant}
                                        className={reservation.status === "confirmed" ? "bg-[#00C2A8] hover:bg-[#00A08A]" : ""}
                                    >
                                        {getStatusBadge(reservation.status).label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            <span>{t("Total:", "Total:")}</span>
                                        </div>
                                        <div className="font-medium text-lg">
                                            ${reservation.totalAmount.toLocaleString()} {reservation.currency}
                                        </div>
                                    </div>
                                    {reservation.note && (
                                        <p className="text-sm text-muted-foreground italic">
                                            {reservation.note}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            
            {/* Show local bookings as fallback if no backend reservations */}
            {!hasReservations && localBookings.length > 0 && (
                <div className="mt-8 space-y-4">
                    <div className="border-t pt-6">
                        <h4 className="text-md font-medium text-muted-foreground mb-4">
                            {t("Reservas locales (pendientes de sincronización)", "Local bookings (pending sync)")}
                        </h4>
                        {localBookings.map((booking) => (
                            <Card key={booking.id} className="mb-4 opacity-75">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl">{booking.hotel.nombre}</CardTitle>
                                            <CardDescription className="flex items-center mt-1">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {booking.hotel.ciudad}, {booking.hotel.pais}
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">
                                            {t("Local", "Local")}
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
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
