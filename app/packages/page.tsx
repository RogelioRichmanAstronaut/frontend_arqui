"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Tag, Star } from "lucide-react";
import { Card, CardContent } from "@/components/(ui)/card";
import { useLanguageStore } from "@/lib/store";
import { PackagesSearchBar } from "@/components/(packages)/search-bar";
import { PackageCard } from "@/components/(packages)/package-card";
import { HotelDetailsModal } from "@/components/(packages)/hotel-modal";
import { PriceFilter } from "@/components/(packages)/filters/price";
import { StarsFilter } from "@/components/(packages)/filters/stars";
import { DetailsFilter } from "@/components/(packages)/filters/details";
import { usePackagesFilters } from "@/lib/hooks/packages-filters";

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

interface Package {
  title: string;
  stars: number;
  includes: string;
  price: number;
  displayPrice: string;
  airline: string;
  hasBreakfast: boolean;
  hotel?: Hotel;
}

const allPackages: Package[] = [
  {
    title: "Water City Dreams",
    stars: 4,
    includes: "Vuelo directo + Traslado + Desayuno",
    price: 1250000,
    displayPrice: "$1.250.000 COP",
    airline: "Aerolínea X",
    hasBreakfast: true,
    hotel: {
      hotel_id: "HOT-001",
      nombre: "Hotel Andes Plaza",
      categoria_estrellas: 4,
      ciudad: "Bogotá",
      direccion: "Av. 15 #100-11",
      servicios_hotel: ["wifi", "desayuno incluido", "gimnasio", "restaurante"],
      fotos: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1520619555298-1581cf47c1c0?w=800&h=600&fit=crop",
      ],
      habitaciones: [
        {
          habitacion_id: "HAB-001",
          tipo: "Doble Estándar",
          disponibilidad: "DISPONIBLE",
          codigo_tipo_habitacion: "DBL-STD",
          precio: 320000,
          servicios_habitacion: ["wifi", "tv", "aire acondicionado"],
        },
        {
          habitacion_id: "HAB-002",
          tipo: "Suite Ejecutiva",
          disponibilidad: "DISPONIBLE",
          codigo_tipo_habitacion: "STE-EJEC",
          precio: 580000,
          servicios_habitacion: ["wifi", "tv", "jacuzzi", "minibar"],
        },
      ],
    },
  },
  {
    title: "Mountain Paradise",
    stars: 3,
    includes: "Vuelo directo + Traslado",
    price: 850000,
    displayPrice: "$850.000 COP",
    airline: "Aerolínea Y",
    hasBreakfast: false,
    hotel: {
      hotel_id: "HOT-003",
      nombre: "Hotel Mountain View",
      categoria_estrellas: 3,
      ciudad: "Medellín",
      direccion: "Calle 50 #15-25",
      servicios_hotel: ["wifi", "restaurante", "terraza"],
      fotos: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      ],
      habitaciones: [
        {
          habitacion_id: "HAB-003",
          tipo: "Doble Estándar",
          disponibilidad: "DISPONIBLE",
          codigo_tipo_habitacion: "DBL-STD",
          precio: 250000,
          servicios_habitacion: ["wifi", "tv", "balcón"],
        },
      ],
    },
  },
  {
    title: "Luxury Beach Resort",
    stars: 5,
    includes: "Vuelo directo + Traslado + Desayuno + Cena",
    price: 2500000,
    displayPrice: "$2.500.000 COP",
    airline: "Aerolínea Z",
    hasBreakfast: true,
    hotel: {
      hotel_id: "HOT-002",
      nombre: "Hotel Tequendama",
      categoria_estrellas: 5,
      ciudad: "Cartagena",
      direccion: "Carrera 10 #26-21",
      servicios_hotel: ["wifi", "spa", "piscina", "restaurante gourmet"],
      fotos: [
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551632786-de41ec16a vector?w=800&h=600&fit=crop",
      ],
      habitaciones: [
        {
          habitacion_id: "HAB-010",
          tipo: "Suite Presidencial",
          disponibilidad: "NO DISPONIBLE",
          codigo_tipo_habitacion: "STE-PRES",
          precio: 1200000,
          servicios_habitacion: ["wifi", "tv", "jacuzzi", "vista panorámica"],
        },
        {
          habitacion_id: "HAB-011",
          tipo: "Suite Deluxe",
          disponibilidad: "DISPONIBLE",
          codigo_tipo_habitacion: "STE-DELUX",
          precio: 850000,
          servicios_habitacion: ["wifi", "tv", "jacuzzi", "minibar", "vista al mar"],
        },
      ],
    },
  },
  {
    title: "City Explorer",
    stars: 4,
    includes: "Vuelo directo + Traslado + Desayuno",
    price: 1100000,
    displayPrice: "$1.100.000 COP",
    airline: "Aerolínea X",
    hasBreakfast: true,
    hotel: {
      hotel_id: "HOT-004",
      nombre: "Hotel City Center",
      categoria_estrellas: 4,
      ciudad: "Cali",
      direccion: "Av. Colombia #5-50",
      servicios_hotel: ["wifi", "gimnasio", "restaurante", "bar"],
      fotos: [
        "https://images.unsplash.com/photo-1564501049351-005e2ccb1144?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
      ],
      habitaciones: [
        {
          habitacion_id: "HAB-004",
          tipo: "Doble Deluxe",
          disponibilidad: "DISPONIBLE",
          codigo_tipo_habitacion: "DBL-DELUX",
          precio: 400000,
          servicios_habitacion: ["wifi", "tv", "minibar", "vista a la ciudad"],
        },
      ],
    },
  },
  {
    title: "Budget Adventure",
    stars: 2,
    includes: "Vuelo directo + Traslado",
    price: 650000,
    displayPrice: "$650.000 COP",
    airline: "Aerolínea Y",
    hasBreakfast: false,
    hotel: {
      hotel_id: "HOT-005",
      nombre: "Hotel Budget Plus",
      categoria_estrellas: 2,
      ciudad: "Santa Marta",
      direccion: "Calle 1 #2-10",
      servicios_hotel: ["wifi", "restaurante"],
      fotos: [
        "https://images.unsplash.com/photo-1585132991992-378a50ee3015?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=600&fit=crop",
      ],
      habitaciones: [
        {
          habitacion_id: "HAB-005",
          tipo: "Habitación Doble",
          disponibilidad: "DISPONIBLE",
          codigo_tipo_habitacion: "DOBLE",
          precio: 180000,
          servicios_habitacion: ["wifi", "tv"],
        },
      ],
    },
  },
  {
    title: "Premium Experience",
    stars: 5,
    includes: "Vuelo directo + Traslado + Desayuno + Spa",
    price: 3200000,
    displayPrice: "$3.200.000 COP",
    airline: "Aerolínea Z",
    hasBreakfast: true,
    hotel: {
      hotel_id: "HOT-006",
      nombre: "Hotel Spa Luxury",
      categoria_estrellas: 5,
      ciudad: "Santa Marta",
      direccion: "Av. Costanera #100-1",
      servicios_hotel: [
        "wifi",
        "spa completo",
        "piscina infinity",
        "restaurante 5 estrellas",
        "playa privada",
      ],
      fotos: [
        "https://images.unsplash.com/photo-1571003123894-169f27e0c0d4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      ],
      habitaciones: [
        {
          habitacion_id: "HAB-006",
          tipo: "Villa Privada",
          disponibilidad: "DISPONIBLE",
          codigo_tipo_habitacion: "VILLA",
          precio: 1500000,
          servicios_habitacion: ["wifi", "jacuzzi privado", "piscina", "butler", "vista al océano"],
        },
      ],
    },
  },
];

export default function Page() {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  const {
    minPrice,
    maxPrice,
    priceRange,
    selectedStars,
    includesBreakfast,
    maxPackagePrice,
    filteredPackages,
    setPriceRange,
    setIncludesBreakfast,
    handleStarToggle,
    handleMinPriceChange,
    handleMaxPriceChange,
  } = usePackagesFilters(allPackages);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [reservationData, setReservationData] = useState<{
    hotel: Hotel;
    room: RoomType;
  } | null>(null);

  const handleReserve = (hotel: Hotel, room: RoomType) => {
    setReservationData({ hotel, room });
    // aqui luego puedes navegar a la pagina de reserva si quieres
  };

  const benefits = [
    {
      icon: Tag,
      title: t("Mejor precio garantizado", "Best price guaranteed"),
      description: t(
        "En Trip-In reunimos vuelos, hoteles y servicios en un solo paquete para que obtengas el mejor valor posible.",
        "At Trip-In we bring together flights, hotels and services in one package to get you the best value possible."
      ),
    },
    {
      icon: MapPin,
      title: t(
        "Todos los destinos, en un solo lugar",
        "All destinations, in one place"
      ),
      description: t(
        "Explora miles de rutas nacionales e internacionales con nuestros socios aéreos y hoteleros. Reserva fácilmente vuelo + alojamiento.",
        "Explore thousands of national and international routes with our airline and hotel partners. Easily book flight + accommodation."
      ),
    },
    {
      icon: Star,
      title: t(
        "Beneficios y experiencias exclusivas",
        "Exclusive benefits and experiences"
      ),
      description: t(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu eu, dui tortor, proin eu lectus pellentesque. A cras suscipit amet",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed arcu eu, dui tortor, proin eu lectus pellentesque. A cras suscipit amet"
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-b from-[#0A2540]/80 to-[#0A2540]/60">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/placeholder.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2540]/80 to-[#0A2540]/60 z-10" />
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("P A Q U E T E S", "P A C K A G E S")}
        </h1>
      </section>

      <section className="container mx-auto px-4 lg:px-8 -mt-8 relative z-30">
        <PackagesSearchBar />
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-6">
            <PriceFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              priceRange={priceRange}
              maxPackagePrice={maxPackagePrice}
              t={t}
              onMinChange={handleMinPriceChange}
              onMaxChange={handleMaxPriceChange}
              onRangeChange={setPriceRange}
            />
            <StarsFilter
              selectedStars={selectedStars}
              onToggleStar={handleStarToggle}
              t={t}
            />
            <DetailsFilter
              includesBreakfast={includesBreakfast}
              onChangeIncludesBreakfast={setIncludesBreakfast}
              t={t}
            />
          </aside>

          <div className="flex-1">
            {filteredPackages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t(
                    "No se encontraron paquetes con los filtros seleccionados",
                    "No packages found with the selected filters"
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPackages.map((pkg, index) => (
                  <motion.div
                    key={pkg.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PackageCard
                      title={pkg.title}
                      stars={pkg.stars}
                      includes={pkg.includes}
                      displayPrice={pkg.displayPrice}
                      airline={pkg.airline}
                      index={index}
                      onSelect={() => pkg.hotel && setSelectedHotel(pkg.hotel)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#00C2A8]/10 mb-4">
                      <benefit.icon className="h-8 w-8 text-[#00C2A8]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A2540] mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedHotel && (
        <HotelDetailsModal
          hotel={selectedHotel}
          onClose={() => setSelectedHotel(null)}
          onReserve={handleReserve}
        />
      )}
    </div>
  );
}
