"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, Plane, Hotel } from "lucide-react";
import { Card, CardContent } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { usePaymentStore, type PaymentResponse } from "@/lib/payment-store";
import { useLanguageStore } from "@/lib/store";
import { useAirConfirm, useHotelConfirm } from "@/lib/hooks/useBookings";
import { useBookingsStore } from "@/lib/bookings-store";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

export default function BankResponsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  
  const { setPaymentResponse } = usePaymentStore();
  const { bookings: localBookings, flightBookings: localFlightBookings } = useBookingsStore();
  const airConfirm = useAirConfirm();
  const hotelConfirm = useHotelConfirm();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [response, setResponse] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmationStatus, setConfirmationStatus] = useState<{
    flights: 'pending' | 'success' | 'error';
    hotels: 'pending' | 'success' | 'error';
  }>({ flights: 'pending', hotels: 'pending' });

  // Confirm bookings after payment is approved
  const confirmBookings = async (transactionId: string) => {
    setIsConfirming(true);
    
    // Confirm flights - usar flightReservationId si existe, sino flightId
    if (localFlightBookings.length > 0) {
      try {
        for (const booking of localFlightBookings.filter(b => b.status === 'confirmed' || b.status === 'pending')) {
          // Preferir el ID real de reservación del backend
          const reservationId = booking.flightReservationId || booking.flight.flightId;
          if (!booking.flightReservationId) {
            console.warn('No se encontró flightReservationId, usando flightId:', booking.flight.flightId);
          }
          await airConfirm.mutateAsync({
            flightReservationId: reservationId,
            transactionId,
          });
        }
        setConfirmationStatus(prev => ({ ...prev, flights: 'success' }));
        toast.success(t("Vuelos confirmados", "Flights confirmed"));
      } catch (err: any) {
        console.error('Error confirming flights:', err);
        setConfirmationStatus(prev => ({ ...prev, flights: 'error' }));
        toast.error(t("Error confirmando vuelos", "Error confirming flights"));
      }
    } else {
      setConfirmationStatus(prev => ({ ...prev, flights: 'success' }));
    }

    // Confirm hotels - usar hotelReservationId si existe, sino hotel_id
    if (localBookings.length > 0) {
      try {
        for (const booking of localBookings.filter(b => b.status === 'confirmed' || b.status === 'pending')) {
          // Preferir el ID real de reservación del backend
          const reservationId = booking.hotelReservationId || booking.hotel.hotel_id;
          if (!booking.hotelReservationId) {
            console.warn('No se encontró hotelReservationId, usando hotel_id:', booking.hotel.hotel_id);
          }
          await hotelConfirm.mutateAsync({
            hotelReservationId: reservationId,
            transactionId,
          });
        }
        setConfirmationStatus(prev => ({ ...prev, hotels: 'success' }));
        toast.success(t("Hoteles confirmados", "Hotels confirmed"));
      } catch (err: any) {
        console.error('Error confirming hotels:', err);
        setConfirmationStatus(prev => ({ ...prev, hotels: 'error' }));
        toast.error(t("Error confirmando hoteles", "Error confirming hotels"));
      }
    } else {
      setConfirmationStatus(prev => ({ ...prev, hotels: 'success' }));
    }

    setIsConfirming(false);
  };

  useEffect(() => {
    const processPaymentResponse = async () => {
      // Parse response from bank redirect
      // Según docs oficiales, la redirección solo incluye:
      // - referencia_transaccion (obligatorio)
      // - estado_transaccion (obligatorio)
      // - codigo_autorizacion (solo si aprobada)
      const referencia = searchParams.get("referencia_transaccion");
      const estado = searchParams.get("estado_transaccion");
      const codigoAuth = searchParams.get("codigo_autorizacion");
      
      // Campos opcionales (vienen en el webhook, no en redirect)
      let monto = searchParams.get("monto_transaccion");
      let fecha = searchParams.get("fecha_hora_pago");
      let codigo = searchParams.get("codigo_respuesta");
      let metodo = searchParams.get("metodo_pago");

      // Solo necesitamos referencia y estado para procesar
      if (referencia && estado) {
        // Si no tenemos el monto, consultamos al backend
        if (!monto) {
          try {
            const statusResponse = await apiClient<{
              state: string;
              stateDetail?: string;
              totalAmount: number;
              currency: string;
              authCode?: string;
              receiptRef?: string;
              lastUpdateAt?: string;
            }>(`/payments/sync?transactionId=${encodeURIComponent(referencia)}`, {
              method: 'GET',
            });
            
            if (statusResponse) {
              monto = statusResponse.totalAmount?.toString() || '0';
              fecha = statusResponse.lastUpdateAt || new Date().toISOString();
              metodo = metodo || 'PSE';
            }
          } catch (err) {
            console.warn('No se pudo obtener detalles del pago:', err);
          }
        }

        const paymentResponse: PaymentResponse = {
          referencia_transaccion: referencia,
          estado_transaccion: estado as "APROBADA" | "RECHAZADA" | "PENDIENTE",
          monto_transaccion: monto ? parseFloat(monto) : 0,
          fecha_hora_pago: fecha || new Date().toISOString(),
          codigo_respuesta: codigo || codigoAuth || "00",
          metodo_pago: metodo || "PSE",
        };
        
        setResponse(paymentResponse);
        setPaymentResponse(paymentResponse);
        setIsProcessing(false);

        // If payment is approved, confirm bookings with external services
        if (estado === "APROBADA") {
          confirmBookings(referencia);
        }
      } else {
        setError(t("No se recibió respuesta del banco", "No response received from bank"));
        setIsProcessing(false);
      }
    };

    processPaymentResponse();
  }, [searchParams, setPaymentResponse]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#00C2A8] mx-auto mb-4" />
            <p className="text-gray-600">
              {t("Procesando respuesta del banco...", "Processing bank response...")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-[#0A2540]">
                {t("Error", "Error")}
              </h1>
              <p className="text-gray-600">
                {error || t("No se pudo procesar la respuesta del banco", "Could not process bank response")}
              </p>
              <Button
                className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
                onClick={() => router.push("/bank")}
              >
                {t("Volver al pago", "Back to payment")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isApproved = response.estado_transaccion === "APROBADA";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            {isApproved ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-[#0A2540]">
                  {t("Pago Aprobado", "Payment Approved")}
                </h1>
                <p className="text-gray-600">
                  {t(
                    "Tu pago ha sido procesado exitosamente.",
                    "Your payment has been processed successfully."
                  )}
                </p>

                {/* Confirmation Status */}
                {(localFlightBookings.length > 0 || localBookings.length > 0) && (
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3 text-left">
                    <h3 className="font-semibold text-blue-900">
                      {isConfirming 
                        ? t("Confirmando reservas...", "Confirming bookings...")
                        : t("Estado de Confirmación", "Confirmation Status")}
                    </h3>
                    
                    {localFlightBookings.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Plane className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{t("Vuelos:", "Flights:")}</span>
                        {confirmationStatus.flights === 'pending' && isConfirming && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        )}
                        {confirmationStatus.flights === 'success' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {confirmationStatus.flights === 'error' && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                    
                    {localBookings.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Hotel className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{t("Hoteles:", "Hotels:")}</span>
                        {confirmationStatus.hotels === 'pending' && isConfirming && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        )}
                        {confirmationStatus.hotels === 'success' && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                        {confirmationStatus.hotels === 'error' && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-[#0A2540]">
                  {t("Pago Rechazado", "Payment Rejected")}
                </h1>
                <p className="text-gray-600">
                  {t(
                    "Tu pago no pudo ser procesado. Por favor, intenta nuevamente.",
                    "Your payment could not be processed. Please try again."
                  )}
                </p>
              </>
            )}

            <div className="bg-gray-50 rounded-lg p-6 space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("Referencia de transacción", "Transaction reference")}:
                </span>
                <span className="font-semibold text-[#0A2540]">
                  {response.referencia_transaccion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("Estado", "Status")}:
                </span>
                <span
                  className={`font-semibold ${
                    isApproved ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {response.estado_transaccion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("Monto", "Amount")}:
                </span>
                <span className="font-semibold text-[#00C2A8]">
                  ${response.monto_transaccion.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("Fecha y hora", "Date and time")}:
                </span>
                <span className="font-semibold text-[#0A2540]">
                  {new Date(response.fecha_hora_pago).toLocaleString("es-CO")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {t("Método de pago", "Payment method")}:
                </span>
                <span className="font-semibold text-[#0A2540]">
                  {response.metodo_pago}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                className="flex-1 border-[#00C2A8] text-[#00C2A8]"
                onClick={() => router.push("/packages")}
              >
                {t("Volver al inicio", "Back to home")}
              </Button>
              {isApproved ? (
                <Button
                  className="flex-1 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
                  onClick={() => router.push("/profile/bookings")}
                >
                  {t("Ver mis reservas", "View my bookings")}
                </Button>
              ) : (
                <Button
                  className="flex-1 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
                  onClick={() => router.push("/bank")}
                >
                  {t("Intentar nuevamente", "Try again")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

