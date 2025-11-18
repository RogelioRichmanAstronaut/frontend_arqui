"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Users, BedDouble } from "lucide-react";
import { Card, CardContent } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Alert, AlertDescription } from "@/components/(ui)/alert";
import { usePackageReservationStore } from "@/lib/package-reservation-store";

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

export default function PackagesConfirmPage() {
  const router = useRouter();
  const hotel = usePackageReservationStore((state) => state.hotel);
  const rooms = usePackageReservationStore((state) => state.rooms);
  const searchDetails = usePackageReservationStore((state) => state.searchDetails);
  const updateSearchDetails = usePackageReservationStore((state) => state.updateSearchDetails);
  const reset = usePackageReservationStore((state) => state.reset);
  const hasRedirected = useRef(false);
  const isConfirming = useRef(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotel && !hasRedirected.current && !isConfirming.current) {
      hasRedirected.current = true;
      router.replace("/packages");
    }
  }, [hotel, router]);

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
    }

    if (!searchDetails.rooms || searchDetails.rooms < 1) {
      errors.push("Debe haber al menos 1 habitación");
    }

    if (errors.length > 0) {
      setValidationError(errors.join(". "));
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleConfirm = () => {
    if (!validateFields()) {
      return;
    }

    // Marcar que estamos confirmando ANTES de cualquier operación
    // Esto previene que el useEffect redirija a /packages
    isConfirming.current = true;
    
    // Navegar a flights usando replace para evitar problemas de historial
    router.replace("/flights");
    
    // Resetear el estado después de un delay para asegurar que la navegación se procese
    setTimeout(() => {
      reset();
      isConfirming.current = false;
    }, 500);
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
                    onChange={(e) => {
                      updateSearchDetails({ destination: e.target.value });
                      setValidationError(null);
                    }}
                    placeholder="Por definir"
                    className="w-full"
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
                    min="1"
                    value={searchDetails.adults}
                    onChange={(e) => {
                      updateSearchDetails({
                        adults: parseInt(e.target.value) || 1,
                      });
                      setValidationError(null);
                    }}
                    className="w-full"
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
                    min="1"
                    value={searchDetails.rooms}
                    onChange={(e) => {
                      updateSearchDetails({
                        rooms: parseInt(e.target.value) || 1,
                      });
                      setValidationError(null);
                    }}
                    className="w-full"
                  />
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

              <div className="flex items-center justify-between border-t pt-4">
                <p className="font-semibold text-[#0A2540]">Total estimado por noche</p>
                <p className="text-xl font-bold text-[#00C2A8]">
                  ${rooms.reduce((acc, room) => acc + room.precio, 0).toLocaleString("es-CO")}
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
            onClick={() => router.push("/packages")}
          >
            Editar búsqueda
          </Button>
          <Button
            className="flex-1 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white"
            onClick={handleConfirm}
          >
            Confirmar datos
          </Button>
        </div>
      </div>
    </div>
  );
}
