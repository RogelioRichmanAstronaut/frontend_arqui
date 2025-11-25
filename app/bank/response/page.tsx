"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { usePaymentStore, type PaymentResponse } from "@/lib/payment-store";
import { useLanguageStore } from "@/lib/store";

export default function BankResponsePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  
  const { setPaymentResponse } = usePaymentStore();
  const [isProcessing, setIsProcessing] = useState(true);
  const [response, setResponse] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse response from bank callback
    // The bank should redirect here with query parameters or POST data
    // For now, we'll check URL params
    const referencia = searchParams.get("referencia_transaccion");
    const estado = searchParams.get("estado_transaccion");
    const monto = searchParams.get("monto_transaccion");
    const fecha = searchParams.get("fecha_hora_pago");
    const codigo = searchParams.get("codigo_respuesta");
    const metodo = searchParams.get("metodo_pago");

    if (referencia && estado && monto && fecha && codigo && metodo) {
      const paymentResponse: PaymentResponse = {
        referencia_transaccion: referencia,
        estado_transaccion: estado as "APROBADA" | "RECHAZADA" | "PENDIENTE",
        monto_transaccion: parseFloat(monto),
        fecha_hora_pago: fecha,
        codigo_respuesta: codigo,
        metodo_pago: metodo,
      };
      
      setResponse(paymentResponse);
      setPaymentResponse(paymentResponse);
      setIsProcessing(false);
    } else {
      // If no params, try to get from payment store (in case of direct navigation)
      // Otherwise show error
      setError(t("No se recibió respuesta del banco", "No response received from bank"));
      setIsProcessing(false);
    }
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

