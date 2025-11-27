"use client";

import { useState, useEffect } from "react";
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
    // Las reservas locales ya no se usan - el backend guarda las reservaciones
    const { bookings: localBookings, flightBookings: localFlightBookings, removeBooking, removeFlightBooking, clearAllBookings } = useBookingsStore();
    const { clientId } = useAuthStore();
    // Usar clientId (CC-XXXXX) porque el backend busca por ese campo, no por user.id
    const { data: backendReservations, isLoading, error, refetch } = useReservations(clientId || undefined);
    const cancelReservation = useCancelReservation();
    const cancelAir = useAirCancel();
    const cancelHotel = useHotelCancel();
    const { locale } = useLanguageStore();
    const t = (esStr: string, enStr: string) => (locale === "es" ? esStr : enStr);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    
    // Si hay reservas en el backend, limpiar las locales (ya no son necesarias)
    const hasBackendBookings = backendReservations && backendReservations.length > 0;
    const hasLocalBookings = localBookings.length > 0 || localFlightBookings.length > 0;
    
    useEffect(() => {
        if (hasBackendBookings && hasLocalBookings) {
            // Las reservas locales sobran porque ya están en el backend
            clearAllBookings();
        }
    }, [hasBackendBookings, hasLocalBookings, clearAllBookings]);

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
        
        // Usar flightReservationId si existe (del backend), sino flightId (fallback)
        const confirmedId = booking.flightReservationId || booking.flight.flightId;
        
        if (!booking.flightReservationId) {
            console.warn('No se encontró flightReservationId, usando flightId como fallback. Esto puede causar errores.');
        }
        
        setCancellingId(booking.id);
        try {
            await cancelAir.mutateAsync({
                confirmedId: confirmedId,
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

    // Handler para cancelar hotel (local)
    const handleCancelHotel = async (booking: any) => {
        if (!confirm(t("¿Estás seguro de cancelar este hotel?", "Are you sure you want to cancel this hotel?"))) return;
        
        // Usar hotelReservationId si existe (del backend), sino hotel_id (fallback)
        const confirmedId = booking.hotelReservationId || booking.hotel.hotel_id;
        
        if (!booking.hotelReservationId) {
            console.warn('No se encontró hotelReservationId, usando hotel_id como fallback. Esto puede causar errores.');
        }
        
        setCancellingId(booking.id);
        try {
            await cancelHotel.mutateAsync({
                confirmedId: confirmedId,
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

    // Handler para cancelar hotel booking del backend
    const handleCancelHotelBooking = async (extBookingId: string, reservationId: string) => {
        if (!confirm(t("¿Estás seguro de cancelar este hotel?", "Are you sure you want to cancel this hotel?"))) return;
        
        setCancellingId(extBookingId);
        try {
            await cancelHotel.mutateAsync({
                confirmedId: extBookingId,
                reservationId: reservationId,
                origin: 'CLIENTE',
                reason: t("Cancelación solicitada por el cliente", "Cancellation requested by customer"),
            });
            toast.success(t("Hotel cancelado", "Hotel cancelled"));
            refetch();
        } catch (err: any) {
            toast.error(err.message || t("Error al cancelar hotel", "Error cancelling hotel"));
        } finally {
            setCancellingId(null);
        }
    };

    // Handler para cancelar flight booking del backend
    const handleCancelFlightBooking = async (extBookingId: string, reservationId: string) => {
        if (!confirm(t("¿Estás seguro de cancelar este vuelo?", "Are you sure you want to cancel this flight?"))) return;
        
        setCancellingId(extBookingId);
        try {
            await cancelAir.mutateAsync({
                confirmedId: extBookingId,
                reservationId: reservationId,
                origin: 'CLIENTE',
                reason: t("Cancelación solicitada por el cliente", "Cancellation requested by customer"),
            });
            toast.success(t("Vuelo cancelado", "Flight cancelled"));
            refetch();
        } catch (err: any) {
            toast.error(err.message || t("Error al cancelar vuelo", "Error cancelling flight"));
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

    const getStatusBadge = (status?: string) => {
        if (!status) return { variant: 'secondary' as const, label: t("Desconocido", "Unknown") };
        
        const statusMap: Record<string, { variant: "default" | "destructive" | "secondary", label: string }> = {
            // Estados del frontend (minúsculas)
            'confirmed': { variant: 'default', label: t("Confirmada", "Confirmed") },
            'cancelled': { variant: 'destructive', label: t("Cancelada", "Cancelled") },
            'completed': { variant: 'secondary', label: t("Completada", "Completed") },
            'pending': { variant: 'secondary', label: t("Pendiente", "Pending") },
            // Estados del backend (mayúsculas - Prisma enum)
            'pendiente': { variant: 'secondary', label: t("Pendiente", "Pending") },
            'aprobada': { variant: 'default', label: t("Aprobada", "Approved") },
            'denegada': { variant: 'destructive', label: t("Denegada", "Denied") },
            'cancelada': { variant: 'destructive', label: t("Cancelada", "Cancelled") },
        };
        return statusMap[status.toLowerCase()] || { variant: 'secondary', label: status };
    };

    // hasLocalBookings y hasBackendBookings ya están definidos arriba
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
            
            {!clientId && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    {t("Completa tu perfil para ver tus reservaciones. Ve a Perfil → Completar datos.", 
                       "Complete your profile to see your reservations. Go to Profile → Complete data.")}
                </div>
            )}
            
            {error && clientId && (
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                    {t("No se pudieron cargar las reservas del servidor.", 
                       "Could not load server reservations.")}
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
                                    <Badge variant={getStatusBadge(reservation.state || reservation.status).variant}>
                                        {getStatusBadge(reservation.state || reservation.status).label}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Hotels */}
                                {reservation.hotelBookings?.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="text-sm font-medium flex items-center gap-1">
                                            <HotelIcon className="h-4 w-4" /> {t("Hoteles", "Hotels")}
                                        </h5>
                                        {reservation.hotelBookings.map((hb: any) => (
                                            <div key={hb.id} className="pl-5 border-l-2 border-[#00C2A8]/30 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="font-medium">{hb.propertyCode}</span>
                                                        <span className="text-muted-foreground ml-2">
                                                            {formatDate(hb.checkIn)} → {formatDate(hb.checkOut)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={getStatusBadge(hb.state).variant} className="text-xs">
                                                            {getStatusBadge(hb.state).label}
                                                        </Badge>
                                                        {hb.state === 'PENDIENTE' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleCancelHotelBooking(hb.extBookingId, reservation.id)}
                                                                className="h-6 text-red-500 hover:text-red-700 p-1"
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    ${Number(hb.totalAmount).toLocaleString('es-CO')} {hb.currency}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Flights */}
                                {reservation.flightBookings?.length > 0 && (
                                    <div className="space-y-2">
                                        <h5 className="text-sm font-medium flex items-center gap-1">
                                            <Plane className="h-4 w-4" /> {t("Vuelos", "Flights")}
                                        </h5>
                                        {reservation.flightBookings.map((fb: any) => (
                                            <div key={fb.id} className="pl-5 border-l-2 border-blue-300/30 text-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="font-medium">{fb.origin} → {fb.destination}</span>
                                                        <span className="text-muted-foreground ml-2">
                                                            {formatDate(fb.departureAt)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={getStatusBadge(fb.state).variant} className="text-xs">
                                                            {getStatusBadge(fb.state).label}
                                                        </Badge>
                                                        {fb.state === 'PENDIENTE' && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleCancelFlightBooking(fb.extBookingId, reservation.id)}
                                                                className="h-6 text-red-500 hover:text-red-700 p-1"
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-muted-foreground">
                                                    ${Number(fb.totalAmount).toLocaleString('es-CO')} {fb.currency} • PNR: {fb.pnr?.slice(0, 8)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {/* Total y cancelar reservación */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1 font-medium">
                                            <DollarSign className="h-4 w-4 text-[#00C2A8]" />
                                            Total: ${reservation.totalAmount?.toLocaleString('es-CO')} {reservation.currency}
                                        </span>
                                    </div>
                                    {(reservation.state || reservation.status || '').toUpperCase() === 'PENDIENTE' && (
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
                                                : t("Cancelar Todo", "Cancel All")}
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
