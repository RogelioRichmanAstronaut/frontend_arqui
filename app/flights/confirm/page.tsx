"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Alert, AlertDescription } from "@/components/(ui)/alert";
import { useFlightReservationStore } from "@/lib/flight-reservation-store";
import { usePackageReservationStore } from "@/lib/package-reservation-store";
import { useBookingsStore } from "@/lib/bookings-store";
import { useNotificationsStore } from "@/lib/notifications-store";
import { usePaymentStore } from "@/lib/payment-store";
import { useAuthStore } from "@/lib/auth-store";
import { useAddCartItem } from "@/lib/hooks/useCart";
import { useCheckoutQuote } from "@/lib/hooks/useCheckout";
import { v4 as uuidv4 } from 'uuid';
import { useLanguageStore } from "@/lib/store";
import { toast } from "sonner";
import type { Flight, FlightClass } from "@/components/(flights)/flight-card";

const formatDate = (iso: string | null) => {
  if (!iso) return "Por definir";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "Por definir";
  }
};

const formatDateForInput = (iso: string | null): string => {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
};

const parseDateFromInput = (dateString: string): string | null => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toISOString();
  } catch {
    return null;
  }
};

const calculateNights = (checkIn: string | null, checkOut: string | null): number => {
  if (!checkIn || !checkOut) return 0;
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch {
    return 0;
  }
};

export default function FlightsConfirmPage() {
  const router = useRouter();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  
  const flight = useFlightReservationStore((state) => state.flight);
  const selectedClasses = useFlightReservationStore((state) => state.selectedClasses);
  const searchDetails = useFlightReservationStore((state) => state.searchDetails);
  const updateSearchDetails = useFlightReservationStore((state) => state.updateSearchDetails);
  
  // Get package reservation data
  const packageHotel = usePackageReservationStore((state) => state.hotel);
  const packageRooms = usePackageReservationStore((state) => state.rooms);
  const packageSearchDetails = usePackageReservationStore((state) => state.searchDetails);
  
  const hasRedirected = useRef(false);
  const isConfirming = useRef(false);
  const { addFlightBooking } = useBookingsStore();
  const { addNotification } = useNotificationsStore();
  const { setPaymentInfo } = usePaymentStore();
  const { clientId } = useAuthStore();
  const addCartItem = useAddCartItem();
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use checkout quote if available to get real total
  const checkoutQuoteDto = clientId ? { clientId } : undefined;
  const { data: quoteData } = useCheckoutQuote(checkoutQuoteDto);

  useEffect(() => {
    if (!flight && !hasRedirected.current && !isConfirming.current) {
      hasRedirected.current = true;
      router.replace("/flights");
    }
  }, [flight, router]);

  const validateFields = (): boolean => {
    if (!searchDetails) {
      setValidationError(t("No hay detalles de búsqueda disponibles", "No search details available"));
      return false;
    }

    const errors: string[] = [];

    if (!searchDetails.origin || searchDetails.origin.trim() === "") {
      errors.push(t("El origen es requerido", "Origin is required"));
    }

    if (!searchDetails.destination || searchDetails.destination.trim() === "") {
      errors.push(t("El destino es requerido", "Destination is required"));
    }

    if (!searchDetails.departureDate) {
      errors.push(t("La fecha de salida es requerida", "Departure date is required"));
    }

    if (!searchDetails.passengers || searchDetails.passengers < 1) {
      errors.push(t("Debe haber al menos 1 pasajero", "There must be at least 1 passenger"));
    }

    if (selectedClasses.length !== searchDetails.passengers) {
      errors.push(t("Debe seleccionar una clase para cada pasajero", "You must select a class for each passenger"));
    }

    if (errors.length > 0) {
      setValidationError(errors.join(". "));
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleConfirm = async () => {
    if (!validateFields()) {
      return;
    }

    if (!flight || !searchDetails || !clientId) {
      setValidationError(t("Debes iniciar sesión para continuar", "You must log in to continue"));
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate flight total
      const flightTotal = selectedClasses.reduce((acc, cls) => acc + cls.price, 0);

      // Agregar vuelo al carrito via backend
      try {
        await addCartItem.mutateAsync({
          clientId: clientId,
          currency: 'COP',
          kind: 'AIR',
          refId: flight.flightId,
          quantity: searchDetails.passengers,
          price: flightTotal,
          metadata: {
            flightId: flight.flightId,
            passengers: Array.from({ length: searchDetails.passengers }, (_, i) => ({
              name: `Pasajero ${i + 1}`,
              doc: clientId
            })),
            originCityId: searchDetails.origin.startsWith('CO-') ? searchDetails.origin : `CO-${searchDetails.origin}`,
            destinationCityId: searchDetails.destination.startsWith('CO-') ? searchDetails.destination : `CO-${searchDetails.destination}`,
            departureAt: searchDetails.departureDate,
            airline: flight.airline,
          }
        });
        toast.success(t('Vuelo agregado al carrito', 'Flight added to cart'));
      } catch (cartError: any) {
        console.error('Error agregando al carrito:', cartError);
        toast.warning(t('Guardado localmente (backend no disponible)', 'Saved locally (backend unavailable)'));
      }

      // Calculate package total if package reservation exists
      let packageTotal = 0;
      let packageDescription = "";
      
      if (packageHotel && packageSearchDetails && packageRooms.length > 0) {
        const roomsRequested = packageSearchDetails.rooms || 1;
        const availableRooms = packageHotel.habitaciones
          .filter((room) => room.disponibilidad === "DISPONIBLE")
          .sort((a, b) => a.precio - b.precio);

        let pricePerNight = 0;
        if (roomsRequested <= packageRooms.length) {
          pricePerNight = packageRooms
            .slice(0, roomsRequested)
            .reduce((acc, room) => acc + room.precio, 0);
        } else {
          const selectedRoomsPrice = packageRooms.reduce((acc, room) => acc + room.precio, 0);
          const extraRoomsNeeded = roomsRequested - packageRooms.length;
          const selectedRoomIds = new Set(packageRooms.map((room) => room.habitacion_id));
          const cheapestAvailableRooms = availableRooms
            .filter((room) => !selectedRoomIds.has(room.habitacion_id))
            .slice(0, extraRoomsNeeded);
          const extraRoomsPrice = cheapestAvailableRooms.reduce((acc, room) => acc + room.precio, 0);
          pricePerNight = selectedRoomsPrice + extraRoomsPrice;
        }

        const nights = calculateNights(packageSearchDetails.checkIn, packageSearchDetails.checkOut);
        packageTotal = pricePerNight * nights;
        packageDescription = `Paquete ${packageHotel.nombre} #${packageHotel.hotel_id}`;
      }

      // Use calculated total (quote service is disabled)
      const totalAmount = packageTotal + flightTotal;

      // Build description
      const descriptions = [];
      if (packageDescription) descriptions.push(packageDescription);
      descriptions.push(`Vuelo ${flight.airline} #${flight.flightId}`);
      const description = descriptions.join(" + ");

      // Set payment information for bank page with total amount
      setPaymentInfo({
        paymentType: packageHotel ? "package" : "flight",
        totalAmount: totalAmount,
        description: description,
      });

      // Save flight booking locally (will be updated to 'confirmed' after payment)
      addFlightBooking({
        id: uuidv4(),
        date: new Date().toISOString(),
        flight: flight,
        selectedClasses: selectedClasses,
        origin: searchDetails.origin,
        destination: searchDetails.destination,
        departureDate: searchDetails.departureDate || new Date().toISOString(),
        returnDate: searchDetails.returnDate,
        passengers: searchDetails.passengers,
        totalPrice: flightTotal,
        status: 'confirmed'
      });

      isConfirming.current = true;

      // Redirect to bank payment page
      await router.replace("/bank");
    } catch (error) {
      console.error('Error en confirmación:', error);
      setValidationError(t("Error al procesar. Intenta nuevamente.", "Error processing. Please try again."));
      setIsProcessing(false);
    }
  };

  if (!flight || !searchDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center space-y-4">
          <p className="text-gray-600">
            {t(
              "Selecciona un vuelo antes de acceder a esta sección.",
              "Select a flight before accessing this section."
            )}
          </p>
          <Button onClick={() => router.push("/flights")} className="bg-[#00C2A8] text-white">
            {t("Volver a vuelos", "Back to flights")}
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = selectedClasses.reduce((acc, cls) => acc + cls.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-8 space-y-10">
        <button
          onClick={() => router.push("/flights")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2540] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("Volver a vuelos", "Back to flights")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">
                  {t("Detalles de búsqueda", "Search details")}
                </p>
                <h1 className="text-2xl font-bold text-[#0A2540]">
                  {t("Confirma tu información", "Confirm your information")}
                </h1>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">
                      {t("Origen", "Origin")}
                    </label>
                  </div>
                  <Input
                    type="text"
                    value={searchDetails.origin || ""}
                    onChange={(e) => {
                      updateSearchDetails({ origin: e.target.value });
                      setValidationError(null);
                    }}
                    placeholder={t("Por definir", "To be defined")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">
                      {t("Destino", "Destination")}
                    </label>
                  </div>
                  <Input
                    type="text"
                    value={searchDetails.destination || ""}
                    onChange={(e) => {
                      updateSearchDetails({ destination: e.target.value });
                      setValidationError(null);
                    }}
                    placeholder={t("Por definir", "To be defined")}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">
                      {t("Fechas", "Dates")}
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="date"
                        value={formatDateForInput(searchDetails.departureDate)}
                        onChange={(e) => {
                          updateSearchDetails({
                            departureDate: parseDateFromInput(e.target.value),
                          });
                          setValidationError(null);
                        }}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {t("Salida", "Departure")}
                      </p>
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={formatDateForInput(searchDetails.returnDate)}
                        onChange={(e) => {
                          updateSearchDetails({
                            returnDate: parseDateFromInput(e.target.value),
                          });
                          setValidationError(null);
                        }}
                        min={formatDateForInput(searchDetails.departureDate)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {t("Retorno", "Return")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">
                      {t("Pasajeros", "Passengers")}
                    </label>
                  </div>
                  <Input
                    type="number"
                    value={searchDetails.passengers}
                    disabled
                    className="w-full bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">
                  {t("Vuelo seleccionado", "Selected flight")}
                </p>
                <h2 className="text-2xl font-bold text-[#0A2540]">{flight.airline}</h2>
                <p className="text-sm text-gray-500">
                  {flight.origin} → {flight.destination}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      {t("Salida", "Departure")}
                    </p>
                    <p className="text-2xl font-bold text-[#0A2540]">
                      {flight.departureTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{flight.origin}</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-0.5 bg-gray-300"></div>
                      <Plane className="h-5 w-5 text-gray-400" />
                      <div className="w-16 h-0.5 bg-gray-300"></div>
                    </div>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-sm text-gray-600 mb-1">
                      {t("Llegada", "Arrival")}
                    </p>
                    <p className="text-2xl font-bold text-[#0A2540]">
                      {flight.arrivalTime}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{flight.destination}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    {t("Duración", "Duration")}: {flight.duration}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#0A2540]">
                  {t("Clases seleccionadas", "Selected classes")}
                </p>
                {selectedClasses.map((flightClass, index) => (
                  <div
                    key={`${flightClass.classId}-${index}`}
                    className="border border-gray-200 rounded-lg p-4 flex flex-col gap-1"
                  >
                    <p className="text-sm font-semibold text-[#0A2540]">
                      {t("Pasajero", "Passenger")} {index + 1}: {flightClass.className}
                    </p>
                    <p className="text-sm font-semibold text-[#00C2A8]">
                      ${flightClass.price.toLocaleString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-[#0A2540]">
                    {t("Total", "Total")}
                  </p>
                  <p className="text-2xl font-bold text-[#00C2A8]">
                    ${totalPrice.toLocaleString("es-CO")}
                  </p>
                </div>
                <p className="text-sm text-gray-500 text-right">
                  {t("Para", "For")} {searchDetails.passengers}{" "}
                  {t("pasajero(s)", "passenger(s)")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {validationError && (
          <Alert variant="destructive">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="flex-1 border-[#00C2A8] text-[#00C2A8]"
            onClick={() => router.push("/flights")}
          >
            {t("Editar búsqueda", "Edit search")}
          </Button>
          <Button
            className="flex-1 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? t("Procesando...", "Processing...") : t("Confirmar datos", "Confirm data")}
          </Button>
        </div>
      </div>
    </div>
  );
}

