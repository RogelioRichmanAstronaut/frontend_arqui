"use client";

import { useState } from "react";
import { useBookingsStore } from "@/lib/bookings-store";
import { useAuthStore } from "@/lib/auth-store";
import { useReservations, useCancelReservation } from "@/lib/hooks/useReservations";
import { useAirCancel, useHotelCancel } from "@/lib/hooks/useBookings";
import { useLanguageStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/(ui)/card";
import { Badge } from "@/components/(ui)/badge";
import { Skeleton } from "@/components/(ui)/skeleton";
import { Calendar, MapPin, Hotel as HotelIcon, DollarSign, Plane, Users, RefreshCw, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/(ui)/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function BookingsPage() {
    const { bookings: localBookings, flightBookings: localFlightBookings, removeBooking, removeFlightBooking } = useBookingsStore();
    const { clientId, user } = useAuthStore();
    const clientUuid = user?.id;
    const { data: backendReservations, isLoading, error, refetch } = useReservations(clientUuid);
    const cancelReservation = useCancelReservation();
    const cancelAir = useAirCancel();
    const cancelHotel = useHotelCancel();
    const { locale } = useLanguageStore();
    const t = (esStr: string, enStr: string) => (locale === "es" ? esStr : enStr);
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    // Handler para cancelar reservación del backend
    const handleCancelReservation = async (reservationId: string) => {
        if (!confirm(t("¿Estás seguro de cancelar esta reservación?", "Are you sure you want to cancel this reservation?"))) return;
        setCancellingId(reservationId);
        try {
            await cancelReservation.mutateAsync({ 
                id: reservationId, 
                reason: t("Cancelación solicitada por el cliente", "Cancellation requested by customer")
            });
            toast.success(t("Reservación cancelada", "Reservation cancelled"));
            refetch();
        } catch (err: any) {
            toast.error(err.message || t("Error al cancelar", "Error cancelling"));
        } finally {
            setCancellingId(null);
        }
    };

    // Handler para cancelar vuelo
    const handleCancelFlight = async (booking: any) => {
        if (!confirm(t("¿Estás seguro de cancelar este vuelo?", "Are you sure you want to cancel this flight?"))) return;
        setCancellingId(booking.id);
        try {
            await cancelAir.mutateAsync({
                confirmedId: booking.flight.flightId,
                reservationId: booking.id,
                origin: 'CLIENTE',
                reason: t("Cancelación solicitada por el cliente", "Cancellation requested by customer"),
            });
            removeFlightBooking(booking.id);
            toast.success(t("Vuelo cancelado", "Flight cancelled"));
        } catch (err: any) {
            toast.error(err.message || t("Error al cancelar vuelo", "Error cancelling flight"));
        } finally {
            setCancellingId(null);
        }
    };

    // Handler para cancelar hotel
    const handleCancelHotel = async (booking: any) => {
        if (!confirm(t("¿Estás seguro de cancelar este hotel?", "Are you sure you want to cancel this hotel?"))) return;
        setCancellingId(booking.id);
        try {
            await cancelHotel.mutateAsync({
                confirmedId: booking.hotel.hotel_id,
                reservationId: booking.id,
                origin: 'CLIENTE',
                reason: t("Cancelación solicitada por el cliente", "Cancellation requested by customer"),
            });
            removeBooking(booking.id);
            toast.success(t("Hotel cancelado", "Hotel cancelled"));
        } catch (err: any) {
            toast.error(err.message || t("Error al cancelar hotel", "Error cancelling hotel"));
        } finally {
            setCancellingId(null);
        }
    };

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

    const hasLocalBookings = localBookings.length > 0 || localFlightBookings.length > 0;
    const hasBackendBookings = backendReservations && backendReservations.length > 0;
    const hasBookings = hasLocalBookings || hasBackendBookings;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">{t("Mis Reservas", "My Bookings")}</h3>
                    <p className="text-sm text-muted-foreground">
                        {t(
                            "Aquí puedes ver el historial de tus reservas.",
                            "Here you can see your booking history."
                        )}
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    {t("Actualizar", "Refresh")}
                </Button>
            </div>
            
            {/* Backend reservations */}
            {isLoading && (
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            )}
            
            {error && (
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                    {t("No se pudieron cargar las reservas del servidor. Mostrando solo reservas locales.", 
                       "Could not load server reservations. Showing only local bookings.")}
                </div>
            )}

            {!isLoading && hasBackendBookings && (
                <div className="space-y-4">
                    <h4 className="text-md font-medium text-[#00C2A8]">
                        {t("Reservas del Sistema", "System Reservations")}
                    </h4>
                    {backendReservations?.map((reservation: any) => (
                        <Card key={reservation.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {t("Reserva", "Reservation")} #{reservation.id.slice(0, 8)}
                                        </CardTitle>
                                        <CardDescription>
                                            {formatDate(reservation.createdAt)}
                                        </CardDescription>
                                    </div>
                                    <Badge variant={getStatusBadge(reservation.status).variant}>
                                        {getStatusBadge(reservation.status).label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-4 w-4 text-[#00C2A8]" />
                                            ${reservation.totalAmount?.toLocaleString('es-CO')} {reservation.currency}
                                        </span>
                                    </div>
                                    {reservation.status !== 'CANCELLED' && reservation.status !== 'cancelled' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleCancelReservation(reservation.id)}
                                            disabled={cancellingId === reservation.id}
                                            className="text-red-600 border-red-200 hover:bg-red-50"
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            {cancellingId === reservation.id 
                                                ? t("Cancelando...", "Cancelling...") 
                                                : t("Cancelar", "Cancel")}
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
            
            {/* Separator if both exist */}
            {hasBackendBookings && hasLocalBookings && (
                <hr className="border-t border-gray-200" />
            )}
            
            <div className="space-y-4">
                {!hasBookings && !isLoading ? (
                    <div className="text-center py-10 text-muted-foreground">
                        {t("No tienes reservas aún.", "You don't have any bookings yet.")}
                    </div>
                ) : hasLocalBookings ? (
                    <>
                        {hasBackendBookings && (
                            <h4 className="text-md font-medium text-gray-600">
                                {t("Reservas Locales (Pendientes de Sincronizar)", "Local Bookings (Pending Sync)")}
                            </h4>
                        )}
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
                                    {booking.status !== 'cancelled' && (
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCancelHotel(booking)}
                                                disabled={cancellingId === booking.id}
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                {cancellingId === booking.id 
                                                    ? t("Cancelando...", "Cancelling...") 
                                                    : t("Cancelar hotel", "Cancel hotel")}
                                            </Button>
                                        </div>
                                    )}
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
                                    {booking.status !== 'cancelled' && (
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleCancelFlight(booking)}
                                                disabled={cancellingId === booking.id}
                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                {cancellingId === booking.id 
                                                    ? t("Cancelando...", "Cancelling...") 
                                                    : t("Cancelar vuelo", "Cancel flight")}
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </>
                ) : null}
            </div>
        </div>
    );
}
