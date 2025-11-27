"use client";

import { useState } from "react";
import { useBookingsStore } from "@/lib/bookings-store";
import { useAuthStore } from "@/lib/auth-store";
// import { useReservations } from "@/lib/hooks/useReservations"; // Deshabilitado: servicios externos
import { useLanguageStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/(ui)/card";
import { Badge } from "@/components/(ui)/badge";
import { Button } from "@/components/(ui)/button";
import { Skeleton } from "@/components/(ui)/skeleton";
import { Calendar, MapPin, Hotel as HotelIcon, DollarSign, Plane, Users, XCircle, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CancelBookingModal } from "@/components/(profile)/cancel-booking-modal";
import { toast } from "sonner";

export default function BookingsPage() {
    const { bookings: localBookings, flightBookings: localFlightBookings, cancelBooking, cancelFlightBooking, requestRefund, requestFlightRefund } = useBookingsStore();
    const { clientId } = useAuthStore();
    // const { data: backendReservations, isLoading, error } = useReservations(clientId); // Deshabilitado: servicios externos
    const { locale } = useLanguageStore();
    const t = (esStr: string, enStr: string) => (locale === "es" ? esStr : enStr);

    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<{ id: string; name: string; type: "hotel" | "flight" } | null>(null);

    const handleCancelClick = (id: string, name: string, type: "hotel" | "flight") => {
        setSelectedBooking({ id, name, type });
        setCancelModalOpen(true);
    };

    const handleCancelConfirm = async (requestRefundOption: boolean, reason?: string) => {
        if (!selectedBooking) return;

        if (selectedBooking.type === "hotel") {
            cancelBooking(selectedBooking.id);
            if (requestRefundOption) {
                requestRefund(selectedBooking.id, reason);
            }
        } else {
            cancelFlightBooking(selectedBooking.id);
            if (requestRefundOption) {
                requestFlightRefund(selectedBooking.id, reason);
            }
        }

        toast.success(
            requestRefundOption
                ? t("Reserva cancelada y reembolso solicitado", "Booking cancelled and refund requested")
                : t("Reserva cancelada exitosamente", "Booking cancelled successfully")
        );
    };

    const handleRefundRequest = (id: string, type: "hotel" | "flight") => {
        if (type === "hotel") {
            requestRefund(id);
        } else {
            requestFlightRefund(id);
        }
        toast.success(t("Solicitud de reembolso enviada", "Refund request submitted"));
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

                                    {booking.refundRequested && (
                                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-sm text-blue-800 flex items-center gap-2">
                                                <RefreshCcw className="h-4 w-4" />
                                                <strong>{t("Reembolso solicitado", "Refund requested")}</strong>
                                            </p>
                                            {booking.refundReason && (
                                                <p className="text-sm text-blue-700 mt-1 ml-6">
                                                    {booking.refundReason}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-4 pt-4 border-t">
                                        {booking.status === 'confirmed' && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleCancelClick(booking.id, booking.hotel.nombre, "hotel")}
                                                className="flex items-center gap-2"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                {t("Cancelar Reserva", "Cancel Booking")}
                                            </Button>
                                        )}
                                        {booking.status === 'cancelled' && !booking.refundRequested && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRefundRequest(booking.id, "hotel")}
                                                className="flex items-center gap-2"
                                            >
                                                <RefreshCcw className="h-4 w-4" />
                                                {t("Solicitar Reembolso", "Request Refund")}
                                            </Button>
                                        )}
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

                                    {booking.refundRequested && (
                                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-sm text-blue-800 flex items-center gap-2">
                                                <RefreshCcw className="h-4 w-4" />
                                                <strong>{t("Reembolso solicitado", "Refund requested")}</strong>
                                            </p>
                                            {booking.refundReason && (
                                                <p className="text-sm text-blue-700 mt-1 ml-6">
                                                    {booking.refundReason}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-4 pt-4 border-t">
                                        {booking.status === 'confirmed' && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleCancelClick(booking.id, booking.flight.airline, "flight")}
                                                className="flex items-center gap-2"
                                            >
                                                <XCircle className="h-4 w-4" />
                                                {t("Cancelar Reserva", "Cancel Booking")}
                                            </Button>
                                        )}
                                        {booking.status === 'cancelled' && !booking.refundRequested && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleRefundRequest(booking.id, "flight")}
                                                className="flex items-center gap-2"
                                            >
                                                <RefreshCcw className="h-4 w-4" />
                                                {t("Solicitar Reembolso", "Request Refund")}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </>
                )}
            </div>

            {selectedBooking && (
                <CancelBookingModal
                    open={cancelModalOpen}
                    onClose={() => setCancelModalOpen(false)}
                    onConfirm={handleCancelConfirm}
                    bookingType={selectedBooking.type}
                    bookingName={selectedBooking.name}
                />
            )}
        </div>
    );
}
