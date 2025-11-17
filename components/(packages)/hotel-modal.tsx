import { useEffect, useState } from 'react';
import { X, MapPin, Wifi, UtensilsCrossed, Dumbbell, Utensils, ChevronLeft, ChevronRight, Star, Check } from 'lucide-react';

interface RoomType {
  habitacion_id: string;
  tipo: string;
  disponibilidad: string;
  codigo_tipo_habitacion: string;
  precio: number;
  servicios_habitacion: string[];
}

interface Hotel {
  hotel_id: string;
  nombre: string;
  categoria_estrellas: number;
  ciudad: string;
  direccion: string;
  servicios_hotel: string[];
  fotos: string[];
  habitaciones: RoomType[];
}

interface HotelDetailsModalProps {
  hotel: Hotel;
  onClose: () => void;
  onReserve: (hotel: Hotel, roomType: RoomType) => void;
}

const serviceIcons: { [key: string]: React.ReactNode } = {
  wifi: <Wifi className="h-5 w-5" />,
  'desayuno incluido': <UtensilsCrossed className="h-5 w-5" />,
  'desayuno': <UtensilsCrossed className="h-5 w-5" />,
  gimnasio: <Dumbbell className="h-5 w-5" />,
  restaurante: <Utensils className="h-5 w-5" />,
  'restaurante gourmet': <Utensils className="h-5 w-5" />,
  spa: <div className="h-5 w-5">✨</div>,
  piscina: <div className="h-5 w-5">🏊</div>,
  'aire acondicionado': <div className="h-5 w-5">❄️</div>,
  tv: <div className="h-5 w-5">📺</div>,
  jacuzzi: <div className="h-5 w-5">🛁</div>,
  minibar: <div className="h-5 w-5">🍹</div>,
  'vista panorámica': <div className="h-5 w-5">🏞️</div>,
};

export function HotelDetailsModal({ hotel, onClose, onReserve }: HotelDetailsModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % hotel.fotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + hotel.fotos.length) % hotel.fotos.length);
  };

  const handleReserve = () => {
    if (selectedRoom) {
      onReserve(hotel, selectedRoom);
    }
  };

  const availableRooms = hotel.habitaciones.filter(room => room.disponibilidad === 'DISPONIBLE');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b flex justify-between items-center p-6 z-10">
          <h2 className="text-2xl font-bold text-[#0A2540]">{hotel.nombre}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative h-80 bg-gray-200 rounded-lg overflow-hidden group">
            <img
              src={hotel.fotos[currentPhotoIndex]}
              alt={`${hotel.nombre} - Foto ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop';
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
                  <span>{hotel.direccion}, {hotel.ciudad}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#0A2540] mb-3">Servicios del Hotel</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hotel.servicios_hotel.map((servicio, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-[#00C2A8]">
                      {serviceIcons[servicio.toLowerCase()] || <Check className="h-5 w-5" />}
                    </div>
                    <span className="text-sm text-gray-700 capitalize">{servicio}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#0A2540] mb-3">Tipos de Habitación Disponibles</h3>
              <div className="space-y-3">
                {availableRooms.length > 0 ? (
                  availableRooms.map((room) => (
                    <div
                      key={room.habitacion_id}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRoom?.habitacion_id === room.habitacion_id
                          ? 'border-[#00C2A8] bg-[#00C2A8]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-[#0A2540]">{room.tipo}</h4>
                          <p className="text-sm text-gray-600">{room.codigo_tipo_habitacion}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-[#00C2A8]">
                            ${room.precio.toLocaleString('es-CO')}
                          </p>
                          <p className="text-xs text-gray-600">por noche</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {room.servicios_habitacion.map((servicio, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize"
                          >
                            {servicio}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800">No hay habitaciones disponibles en este momento</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleReserve}
              disabled={!selectedRoom}
              className="flex-1 px-4 py-3 bg-[#00C2A8] hover:bg-[#00C2A8]/90 disabled:bg-gray-300 text-white font-semibold rounded-lg transition-colors"
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
