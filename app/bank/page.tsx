"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Alert, AlertDescription } from "@/components/(ui)/alert";
import { usePaymentStore, type PaymentResponse } from "@/lib/payment-store";
import { usePackageReservationStore } from "@/lib/package-reservation-store";
import { useFlightReservationStore } from "@/lib/flight-reservation-store";
import { useLanguageStore } from "@/lib/store";

// Bank API endpoint - replace with your actual bank API URL
const BANK_API_URL = process.env.NEXT_PUBLIC_BANK_API_URL || "https://api.bank.com/pagos";

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString("es-CO")}`;
};

export default function BankPaymentPage() {
  const router = useRouter();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  const hasRedirected = useRef(false);
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [documentType, setDocumentType] = useState<'CC' | 'TI' | 'PASS'>('CC');
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    paymentType,
    totalAmount,
    description,
    paymentResponse,
    isLoading,
    error,
    setPaymentInfo,
    setCustomerInfo,
    setPaymentResponse,
    setLoading,
    setError,
    reset,
  } = usePaymentStore();

  // Get reservation data to initialize payment info - use individual selectors to avoid object recreation
  const packageHotel = usePackageReservationStore((state) => state.hotel);
  const packageRooms = usePackageReservationStore((state) => state.rooms);
  const packageSearchDetails = usePackageReservationStore((state) => state.searchDetails);

  const flightFlight = useFlightReservationStore((state) => state.flight);
  const flightSelectedClasses = useFlightReservationStore((state) => state.selectedClasses);
  const flightSearchDetails = useFlightReservationStore((state) => state.searchDetails);

  // Calculate breakdown and total from reservations
  const calculatePackageTotal = (): number => {
    if (!packageHotel || !packageSearchDetails) return 0;

    const roomsRequested = packageSearchDetails.rooms || 1;
    const selectedRooms = packageRooms || [];

    let pricePerNight = 0;
    if (selectedRooms.length > 0) {
      pricePerNight = selectedRooms
        .slice(0, roomsRequested)
        .reduce((acc, room) => acc + room.precio, 0);
    } else {
      const availableRooms = packageHotel.habitaciones
        .filter((room) => room.disponibilidad === "DISPONIBLE")
        .sort((a, b) => a.precio - b.precio);
      pricePerNight = availableRooms
        .slice(0, roomsRequested)
        .reduce((acc, room) => acc + room.precio, 0);
    }

    const nights = packageSearchDetails.checkIn && packageSearchDetails.checkOut
      ? Math.ceil(
        (new Date(packageSearchDetails.checkOut).getTime() -
          new Date(packageSearchDetails.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
      )
      : 1;

    return pricePerNight * nights;
  };

  const calculateFlightTotal = (): number => {
    if (!flightFlight || flightSelectedClasses.length === 0) return 0;
    return flightSelectedClasses.reduce((acc, cls) => acc + cls.price, 0);
  };

  // Calculate totals
  const packageTotal = useMemo(() => calculatePackageTotal(), [packageHotel, packageRooms, packageSearchDetails]);
  const flightTotal = useMemo(() => calculateFlightTotal(), [flightFlight, flightSelectedClasses]);
  const calculatedTotal = packageTotal + flightTotal;

  // Initialize payment info from reservations (fallback if not set from confirm page)
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once if payment info is not set and we haven't initialized yet
    if (paymentType === null && totalAmount === 0 && !hasInitialized.current) {
      if (calculatedTotal > 0) {
        const descriptions = [];
        if (packageTotal > 0 && packageHotel) {
          descriptions.push(`Paquete ${packageHotel.nombre} #${packageHotel.hotel_id}`);
        }
        if (flightTotal > 0 && flightFlight) {
          descriptions.push(`Vuelo ${flightFlight.airline} #${flightFlight.flightId}`);
        }

        hasInitialized.current = true;
        setPaymentInfo({
          paymentType: packageTotal > 0 ? "package" : "flight",
          totalAmount: calculatedTotal,
          description: descriptions.join(" + ") || "Pago total",
        });
      }
    }
  }, [paymentType, totalAmount, calculatedTotal, packageTotal, flightTotal, packageHotel, flightFlight, setPaymentInfo]);

  // Redirect if no payment info
  useEffect(() => {
    if (
      !paymentType &&
      !packageHotel &&
      !flightFlight &&
      !hasRedirected.current
    ) {
      hasRedirected.current = true;
      router.replace("/packages");
    }
  }, [paymentType, packageHotel, flightFlight, router]);

  const validateFields = (): boolean => {
    const errors: string[] = [];

    if (!customerId || customerId.trim() === "") {
      errors.push(t("La cédula es requerida", "ID number is required"));
    } else if (!/^\d{7,10}$/.test(customerId)) {
      errors.push(
        t(
          "La cédula debe tener entre 7 y 10 dígitos",
          "ID number must have between 7 and 10 digits"
        )
      );
    }

    if (!customerName || customerName.trim() === "") {
      errors.push(t("El nombre es requerido", "Name is required"));
    } else if (customerName.trim().length < 3) {
      errors.push(
        t("El nombre debe tener al menos 3 caracteres", "Name must have at least 3 characters")
      );
    }

    if (errors.length > 0) {
      setValidationError(errors.join(". "));
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handlePayment = async () => {
    if (!validateFields()) {
      return;
    }

    if (!paymentType || totalAmount === 0) {
      setError(t("No hay información de pago disponible", "No payment information available"));
      return;
    }

    setLoading(true);
    setError(null);
    setCustomerInfo({ customerId, customerName });

    // Build payment payload
    const payload = {
      monto_total: totalAmount,
      descripcion_pago: description,
      cedula_cliente: customerId,
      nombre_cliente: customerName,
      url_respuesta: `${window.location.origin}/bank/response`,
      url_notificacion: `${window.location.origin}/api/bank/notificacion`,
      destinatario: "1234567890", // This should come from your backend/config
    };

    try {
      const response = await fetch(BANK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(t("Error al procesar el pago", "Error processing payment"));
      }

      const data: PaymentResponse = await response.json();
      setPaymentResponse(data);

      if (data.estado_transaccion === "APROBADA") {
        // Payment successful - you might want to update booking status here
        // and redirect to success page
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("Error al comunicarse con el banco", "Error communicating with bank")
      );
    } finally {
      setLoading(false);
    }
  };

  // Show payment response
  if (paymentResponse) {
    const isApproved = paymentResponse.estado_transaccion === "APROBADA";

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
                    {paymentResponse.referencia_transaccion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("Estado", "Status")}:
                  </span>
                  <span
                    className={`font-semibold ${isApproved ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {paymentResponse.estado_transaccion}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("Monto", "Amount")}:
                  </span>
                  <span className="font-semibold text-[#00C2A8]">
                    {formatCurrency(paymentResponse.monto_transaccion)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("Fecha y hora", "Date and time")}:
                  </span>
                  <span className="font-semibold text-[#0A2540]">
                    {new Date(paymentResponse.fecha_hora_pago).toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("Método de pago", "Payment method")}:
                  </span>
                  <span className="font-semibold text-[#0A2540]">
                    {paymentResponse.metodo_pago}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-[#00C2A8] text-[#00C2A8]"
                  onClick={() => {
                    reset();
                    router.push("/packages");
                  }}
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
                    onClick={() => {
                      setPaymentResponse(null);
                      setError(null);
                    }}
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

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-8 space-y-10">
        <button
          onClick={() => {
            if (paymentType === "package") {
              router.push("/packages/confirm");
            } else if (paymentType === "flight") {
              router.push("/flights/confirm");
            } else {
              router.push("/packages");
            }
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2540] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("Volver", "Back")}
        </button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00C2A8]/10 mb-4">
                  <CreditCard className="h-8 w-8 text-[#00C2A8]" />
                </div>
                <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
                  {t("Procesar Pago", "Process Payment")}
                </h1>
                <p className="text-gray-600">
                  {t(
                    "Completa la información para procesar tu pago de forma segura.",
                    "Complete the information to process your payment securely."
                  )}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    {t("Descripción", "Description")}:
                  </span>
                  <span className="font-semibold text-[#0A2540]">{description}</span>
                </div>

                {/* Show breakdown if both package and flight exist */}
                {(packageTotal > 0 && flightTotal > 0) && (
                  <>
                    <div className="space-y-2 pt-2 border-t">
                      {packageTotal > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {t("Paquete (Hotel)", "Package (Hotel)")}:
                          </span>
                          <span className="font-semibold text-[#0A2540]">
                            {formatCurrency(packageTotal)}
                          </span>
                        </div>
                      )}
                      {flightTotal > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {t("Vuelo", "Flight")}:
                          </span>
                          <span className="font-semibold text-[#0A2540]">
                            {formatCurrency(flightTotal)}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center border-t pt-4">
                  <span className="text-lg font-semibold text-[#0A2540]">
                    {t("Total a pagar", "Total to pay")}:
                  </span>
                  <span className="text-2xl font-bold text-[#00C2A8]">
                    {formatCurrency(totalAmount || calculatedTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0A2540]">
                    {t("Tipo de Documento", "Document Type")} *
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as 'CC' | 'TI' | 'PASS')}
                    className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-[#00C2A8] focus:ring-1 focus:ring-[#00C2A8] transition-colors"
                  >
                    <option value="CC">CC - {t("Cédula de Ciudadanía", "Citizenship Card")}</option>
                    <option value="TI">TI - {t("Tarjeta de Identidad", "Identity Card")}</option>
                    <option value="PASS">PASS - {t("Pasaporte", "Passport")}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0A2540]">
                    {t("Cédula / Documento de identidad", "ID Number")} *
                  </label>
                  <Input
                    type="text"
                    value={customerId}
                    onChange={(e) => {
                      setCustomerId(e.target.value.replace(/\D/g, ""));
                      setValidationError(null);
                    }}
                    placeholder={t("Ej: 1020304050", "Ex: 1020304050")}
                    className="w-full"
                    maxLength={10}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0A2540]">
                    {t("Nombre completo", "Full name")} *
                  </label>
                  <Input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder={t("Ej: María Pérez", "Ex: María Pérez")}
                    className="w-full"
                  />
                </div>
              </div>

              {validationError && (
                <Alert variant="destructive">
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white font-semibold py-6 text-lg"
                onClick={handlePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t("Procesando...", "Processing...")}
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    {t("Procesar Pago", "Process Payment")}
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                {t(
                  "Al continuar, serás redirigido a la plataforma de pago segura del banco.",
                  "By continuing, you will be redirected to the bank's secure payment platform."
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

