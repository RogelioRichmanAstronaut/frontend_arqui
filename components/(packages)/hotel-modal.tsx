"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  X,
  MapPin,
  Wifi,
  UtensilsCrossed,
  Dumbbell,
  Utensils,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Wind,
  Monitor,
  Bath,
  Wine,
  Binoculars,
} from "lucide-react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import { usePackageSearchStore } from "@/lib/package-search-store";
import { usePackageReservationStore } from "@/lib/package-reservation-store";
import type { Hotel, RoomType } from "@/lib/types/packages";

const serviceIcons: { [key: string]: ReactNode } = {
  wifi: <Wifi className="h-5 w-5" />,
  "desayuno incluido": <UtensilsCrossed className="h-5 w-5" />,
  desayuno: <UtensilsCrossed className="h-5 w-5" />,
  gimnasio: <Dumbbell className="h-5 w-5" />,
  restaurante: <Utensils className="h-5 w-5" />,
  "restaurante gourmet": <Utensils className="h-5 w-5" />,
  spa: <Bath className="h-5 w-5" />,
  piscina: <Bath className="h-5 w-5" />,
  "aire acondicionado": <Wind className="h-5 w-5" />,
  tv: <Monitor className="h-5 w-5" />,
  jacuzzi: <Bath className="h-5 w-5" />,
  minibar: <Wine className="h-5 w-5" />,
  "vista panoramica": <Binoculars className="h-5 w-5" />,
};

const getServiceIcon = (label: string) => {
  const normalized = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return serviceIcons[normalized] || <Check className="h-5 w-5" />;
};

interface HotelDetailsModalProps {
  hotel: Hotel;
  onClose: () => void;
}

export function HotelDetailsModal({ hotel, onClose }: HotelDetailsModalProps) {
  const router = useRouter();
  const roomsRequested = usePackageSearchStore((state) => state.rooms);
  const totalAdults = usePackageSearchStore((state) => state.adults);
  const destination = usePackageSearchStore((state) => state.destination);
  const checkIn = usePackageSearchStore((state) => state.checkIn);
  const checkOut = usePackageSearchStore((state) => state.checkOut);
  const setReservation = usePackageReservationStore((state) => state.setReservation);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [roomSelections, setRoomSelections] = useState<(RoomType | null)[]>(
    () => Array.from({ length: roomsRequested }, () => null)
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    setRoomSelections(Array.from({ length: roomsRequested }, () => null));
  }, [hotel.hotel_id, roomsRequested]);

  const availableRooms = useMemo(
    () => hotel.habitaciones.filter((room) => room.disponibilidad === "DISPONIBLE"),
    [hotel.habitaciones]
  );

  const selectedRooms = roomSelections.filter(
    (room): room is RoomType => room !== null
  );
  const canConfirm =
    roomsRequested > 0 && availableRooms.length > 0 && selectedRooms.length === roomsRequested;
  const totalPrice = selectedRooms.reduce((acc, room) => acc + room.precio, 0);

  const handleRoomCategoryChange = (roomIndex: number, roomId: string) => {
    const selected = availableRooms.find((room) => room.habitacion_id === roomId) ?? null;
    setRoomSelections((prev) => {
      const next = [...prev];
      next[roomIndex] = selected;
      return next;
    });
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    setReservation({
      hotel,
      rooms: selectedRooms,
      searchDetails: {
        destination,
        adults: totalAdults,
        rooms: roomsRequested,
        checkIn,
        checkOut,
      },
    });
    onClose();
    router.push("/packages/confirm");
  };

  const nextPhoto = () => {
    if (!hotel.fotos || hotel.fotos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev + 1) % hotel.fotos.length);
  };

  const prevPhoto = () => {
    if (!hotel.fotos || hotel.fotos.length === 0) return;
    setCurrentPhotoIndex((prev) => (prev - 1 + hotel.fotos.length) % hotel.fotos.length);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b flex justify-between items-center p-6 z-10">
          <div>
            <h2 className="text-2xl font-bold text-[#0A2540]">{hotel.nombre}</h2>
            <p className="text-sm text-gray-500">
              Selecciona la categoria para cada una de las {roomsRequested} habitaciones solicitadas.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden group">
            {hotel.fotos && hotel.fotos.length > 0 ? (
              <>
                <NextImage
                  src={hotel.fotos[currentPhotoIndex] || hotel.fotos[0]}
                  alt={`${hotel.nombre} - Foto ${currentPhotoIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                  onError={(e) => {
                    // Fallback to default image if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/cards/default-hotel.jpg';
                  }}
                />
                    {hotel.fotos.length > 1 && (
                  <>
                    <button
                      onClick={prevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                  {currentPhotoIndex + 1} / {hotel.fotos.length}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No hay imágenes disponibles</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: hotel.categoria_estrellas }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#00C2A8] text-[#00C2A8]" />
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {hotel.direccion}, {hotel.ciudad}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#0A2540] mb-3">Servicios del hotel</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.servicios_hotel.map((servicio, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-[#00C2A8]">{getServiceIcon(servicio)}</div>
                    <span className="text-sm text-gray-700 capitalize">{servicio}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#0A2540] mb-3">Habitaciones solicitadas</h3>
              {roomsRequested === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  Configura habitaciones en la barra de busqueda antes de continuar.
                </div>
              ) : availableRooms.length === 0 ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  No hay habitaciones disponibles en este momento.
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: roomsRequested }).map((_, index) => {
                    const selectedRoom = roomSelections[index];
                    return (
                      <div
                        key={`selection-${index}`}
                        className="border border-gray-200 rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#0A2540]">Habitacion {index + 1}</p>
                            <p className="text-sm text-gray-500">
                              {selectedRoom ? selectedRoom.tipo : "Selecciona una categoria"}
                            </p>
                          </div>
                          {selectedRoom && (
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#00C2A8]">
                                ${selectedRoom.precio.toLocaleString("es-CO")}
                              </p>
                              <p className="text-xs text-gray-500">por noche</p>
                            </div>
                          )}
                        </div>
                        <select
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2A8]"
                          value={selectedRoom?.habitacion_id ?? ""}
                          onChange={(event) => handleRoomCategoryChange(index, event.target.value)}
                        >
                          <option value="">Selecciona una categoria</option>
                          {availableRooms.map((room) => (
                            <option key={room.habitacion_id} value={room.habitacion_id}>
                              {room.tipo} - ${room.precio.toLocaleString("es-CO")}
                            </option>
                          ))}
                        </select>
                        {selectedRoom && (
                          <div className="flex flex-wrap gap-2">
                            {selectedRoom.servicios_habitacion.map((servicio, idx) => (
                              <span
                                key={`${selectedRoom.habitacion_id}-${idx}`}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize"
                              >
                                {servicio}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedRooms.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total estimado por noche</p>
                  <p className="text-lg font-semibold text-[#0A2540]">
                    {selectedRooms.length} habitacion(es)
                  </p>
                </div>
                <p className="text-2xl font-bold text-[#00C2A8]">
                  ${totalPrice.toLocaleString("es-CO")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Volver
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 px-4 py-3 bg-[#00C2A8] hover:bg-[#00C2A8]/90 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
          >
            Confirmar datos
          </button>
        </div>
      </div>
    </div>
  );
}
