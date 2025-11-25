"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users, BedDouble } from "lucide-react";
import { Card, CardContent } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Alert, AlertDescription } from "@/components/(ui)/alert";
import { usePackageReservationStore } from "@/lib/package-reservation-store";
import { useBookingsStore } from "@/lib/bookings-store";
import { useNotificationsStore } from "@/lib/notifications-store";
import { usePaymentStore } from "@/lib/payment-store";
import { useAuthStore } from "@/lib/auth-store";
// import { useAddCartItem } from "@/lib/hooks/useCart"; // Deshabilitado: servicios externos
import { v4 as uuidv4 } from 'uuid';



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

const MAX_PER_ROOM = 6;
const MAX_ADULTS = 30;
const MAX_ROOMS = 5;

export default function PackagesConfirmPage() {
  const router = useRouter();
  const hotel = usePackageReservationStore((state) => state.hotel);
  const rooms = usePackageReservationStore((state) => state.rooms);
  const searchDetails = usePackageReservationStore((state) => state.searchDetails);
  const updateSearchDetails = usePackageReservationStore((state) => state.updateSearchDetails);
  const reset = usePackageReservationStore((state) => state.reset);
  const hasRedirected = useRef(false);
  const isConfirming = useRef(false);
  const { addBooking } = useBookingsStore();
  const { addNotification } = useNotificationsStore();
  const { setPaymentInfo } = usePaymentStore();
  const { clientId } = useAuthStore();
  // const addCartItem = useAddCartItem(); // Deshabilitado: requiere servicios externos (Hotel, Banco)
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!hotel && !hasRedirected.current && !isConfirming.current) {
      hasRedirected.current = true;
      router.replace("/packages");
    }
  }, [hotel, router]);

  useEffect(() => {
    if (hotel && searchDetails && (!searchDetails.destination || searchDetails.destination.trim() === "")) {
      // Infer destination from hotel city and country
      updateSearchDetails({ destination: `${hotel.pais}, ${hotel.ciudad}` });
    }
  }, [hotel, searchDetails, updateSearchDetails]);

  const validateFields = (): boolean => {
    if (!searchDetails) {
      setValidationError("No hay detalles de búsqueda disponibles");
      return false;
    }

    const errors: string[] = [];

    if (!searchDetails.destination || searchDetails.destination.trim() === "") {
      errors.push("El destino es requerido");
    }

    if (!searchDetails.checkIn) {
      errors.push("La fecha de check-in es requerida");
    }

    if (!searchDetails.checkOut) {
      errors.push("La fecha de check-out es requerida");
    }

    if (!searchDetails.adults || searchDetails.adults < 1) {
      errors.push("Debe haber al menos 1 adulto");
    } else if (searchDetails.adults > MAX_ADULTS) {
      errors.push(`El número máximo de adultos es ${MAX_ADULTS}`);
    }

    if (!searchDetails.rooms || searchDetails.rooms < 1) {
      errors.push("Debe haber al menos 1 habitación");
    } else if (searchDetails.rooms > MAX_ROOMS) {
      errors.push(`El número máximo de habitaciones es ${MAX_ROOMS}`);
    }

    // Validar relación entre adultos y habitaciones
    if (searchDetails.adults && searchDetails.rooms) {
      const minRoomsNeeded = Math.ceil(searchDetails.adults / MAX_PER_ROOM);
      if (searchDetails.rooms < minRoomsNeeded) {
        errors.push(
          `Se necesitan al menos ${minRoomsNeeded} habitación${minRoomsNeeded > 1 ? "es" : ""} para ${searchDetails.adults} adulto${searchDetails.adults > 1 ? "s" : ""} (máximo ${MAX_PER_ROOM} por habitación)`
        );
      }
      if (searchDetails.adults < searchDetails.rooms) {
        errors.push("El número de adultos debe ser mayor o igual al número de habitaciones");
      }
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

    if (!hotel || !searchDetails || !clientId) {
      setValidationError("Debes iniciar sesión para continuar");
      return;
    }

    setIsProcessing(true);

    try {
      // Calculate price logic
      const roomsRequested = searchDetails.rooms || 1;
      const availableRooms = hotel.habitaciones
        .filter((room) => room.disponibilidad === "DISPONIBLE")
        .sort((a, b) => a.precio - b.precio);

      let pricePerNight = 0;
      let finalRooms = [...rooms];

      if (roomsRequested <= rooms.length) {
        pricePerNight = rooms
          .slice(0, roomsRequested)
          .reduce((acc, room) => acc + room.precio, 0);
        finalRooms = rooms.slice(0, roomsRequested);
      } else {
        const selectedRoomsPrice = rooms.reduce((acc, room) => acc + room.precio, 0);
        const extraRoomsNeeded = roomsRequested - rooms.length;
        const selectedRoomIds = new Set(rooms.map((room) => room.habitacion_id));
        const cheapestAvailableRooms = availableRooms
          .filter((room) => !selectedRoomIds.has(room.habitacion_id))
          .slice(0, extraRoomsNeeded);

        const extraRoomsPrice = cheapestAvailableRooms.reduce((acc, room) => acc + room.precio, 0);
        pricePerNight = selectedRoomsPrice + extraRoomsPrice;
        finalRooms = [...rooms, ...cheapestAvailableRooms];
      }

      const nights = calculateNights(searchDetails.checkIn, searchDetails.checkOut);
      const totalEstimated = pricePerNight * nights;

      // TODO: Integración futura con backend de carrito cuando los servicios externos estén listos
      // Por ahora guardar solo localmente para pruebas de Solución Turismo
      console.log('📦 Guardando paquete localmente (servicios externos pendientes):', {
        hotelId: hotel.hotel_id,
        roomId: finalRooms[0]?.habitacion_id,
        checkIn: searchDetails.checkIn,
        checkOut: searchDetails.checkOut,
        totalPrice: totalEstimated
      });

      // Save booking locally (will be updated to 'confirmed' after payment)
      addBooking({
        id: uuidv4(),
        date: new Date().toISOString(),
        hotel: hotel,
        rooms: finalRooms,
        checkIn: searchDetails.checkIn || new Date().toISOString(),
        checkOut: searchDetails.checkOut || new Date().toISOString(),
        totalPrice: totalEstimated,
        status: 'pending'
      });

      isConfirming.current = true;

      // Redirect to flights page to select flight
      await router.replace("/flights");
    } catch (error) {
      console.error('Error en confirmación:', error);
      setValidationError("Error al procesar. Intenta nuevamente.");
      setIsProcessing(false);
    }
  };

  if (!hotel || !searchDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center space-y-4">
          <p className="text-gray-600">
            Selecciona un hotel y confirma las habitaciones antes de acceder a esta seccion.
          </p>
          <Button onClick={() => router.push("/packages")} className="bg-[#00C2A8] text-white">
            Volver a paquetes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 lg:px-8 space-y-10">
        <button
          onClick={() => router.push("/packages")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2540] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a paquetes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">Detalles de búsqueda</p>
                <h1 className="text-2xl font-bold text-[#0A2540]">Confirma tu información</h1>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">Destino</label>
                  </div>
                  <Input
                    type="text"
                    value={searchDetails.destination || ""}
                    disabled
                    readOnly
                    className="w-full bg-gray-50 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">Fechas</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="date"
                        value={formatDateForInput(searchDetails.checkIn)}
                        onChange={(e) => {
                          updateSearchDetails({
                            checkIn: parseDateFromInput(e.target.value),
                          });
                          setValidationError(null);
                        }}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-400 mt-1">Check-in</p>
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={formatDateForInput(searchDetails.checkOut)}
                        onChange={(e) => {
                          updateSearchDetails({
                            checkOut: parseDateFromInput(e.target.value),
                          });
                          setValidationError(null);
                        }}
                        min={formatDateForInput(searchDetails.checkIn)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-400 mt-1">Check-out</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">Adultos</label>
                  </div>
                  <Input
                    type="number"
                    value={searchDetails.adults}
                    disabled
                    className="w-full bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-[#00C2A8]" />
                    <label className="text-sm text-gray-500">
                      Habitaciones solicitadas
                    </label>
                  </div>
                  <Input
                    type="number"
                    value={searchDetails.rooms}
                    disabled
                    className="w-full bg-gray-50 cursor-not-allowed"
                    readOnly
                  />
                  <p className="text-xs text-gray-400">
                    Para modificar, usa "Editar búsqueda"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">Hotel seleccionado</p>
                <h2 className="text-2xl font-bold text-[#0A2540]">{hotel.nombre}</h2>
                <p className="text-sm text-gray-500">
                  {hotel.direccion}, {hotel.ciudad}
                </p>
              </div>

              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <div
                    key={`${room.habitacion_id}-${index}`}
                    className="border border-gray-200 rounded-lg p-4 flex flex-col gap-1"
                  >
                    <p className="text-sm font-semibold text-[#0A2540]">
                      Habitación {index + 1}: {room.tipo}
                    </p>
                    <p className="text-xs text-gray-500">{room.codigo_tipo_habitacion}</p>
                    <p className="text-sm font-semibold text-[#00C2A8]">
                      ${room.precio.toLocaleString("es-CO")} / noche
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                {(() => {
                  const roomsRequested = searchDetails.rooms || 1;

                  // Obtener todas las habitaciones disponibles del hotel ordenadas por precio
                  const availableRooms = hotel.habitaciones
                    .filter((room) => room.disponibilidad === "DISPONIBLE")
                    .sort((a, b) => a.precio - b.precio);

                  // Calcular el precio total
                  let pricePerNight = 0;

                  if (roomsRequested <= rooms.length) {
                    // Si las habitaciones solicitadas son menores o iguales a las seleccionadas,
                    // usar solo las habitaciones seleccionadas
                    pricePerNight = rooms
                      .slice(0, roomsRequested)
                      .reduce((acc, room) => acc + room.precio, 0);
                  } else {
                    // Si se solicitan más habitaciones, usar las seleccionadas + las más económicas disponibles
                    const selectedRoomsPrice = rooms.reduce((acc, room) => acc + room.precio, 0);
                    const extraRoomsNeeded = roomsRequested - rooms.length;

                    // Obtener las habitaciones más económicas que no estén ya seleccionadas
                    const selectedRoomIds = new Set(rooms.map((room) => room.habitacion_id));
                    const cheapestAvailableRooms = availableRooms
                      .filter((room) => !selectedRoomIds.has(room.habitacion_id))
                      .slice(0, extraRoomsNeeded);

                    const extraRoomsPrice = cheapestAvailableRooms.reduce(
                      (acc, room) => acc + room.precio,
                      0
                    );

                    pricePerNight = selectedRoomsPrice + extraRoomsPrice;
                  }

                  const nights = calculateNights(searchDetails.checkIn, searchDetails.checkOut);
                  const totalEstimated = pricePerNight * nights;

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#0A2540]">Precio por noche</p>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#00C2A8]">
                            ${pricePerNight.toLocaleString("es-CO")}
                          </p>
                          {roomsRequested > rooms.length && (
                            <p className="text-xs text-gray-500">
                              ({rooms.length} seleccionada{rooms.length > 1 ? "s" : ""} + {roomsRequested - rooms.length} adicional{roomsRequested - rooms.length > 1 ? "es" : ""} más económica{roomsRequested - rooms.length > 1 ? "s" : ""})
                            </p>
                          )}
                        </div>
                      </div>
                      {searchDetails.checkIn && searchDetails.checkOut && (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <p className="text-gray-600">
                              Noches: {nights}
                            </p>
                            <p className="text-gray-600">
                              {formatDate(searchDetails.checkIn)} - {formatDate(searchDetails.checkOut)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between border-t pt-2">
                            <p className="font-bold text-lg text-[#0A2540]">Total estimado</p>
                            <p className="text-2xl font-bold text-[#00C2A8]">
                              ${totalEstimated.toLocaleString("es-CO")}
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
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
            onClick={() => router.push("/packages")}
          >
            Editar búsqueda
          </Button>
          <Button
            className="flex-1 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : "Confirmar datos"}
          </Button>
        </div>
      </div>
    </div>
  );
}
