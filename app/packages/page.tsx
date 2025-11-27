"use client";

import { useState, useEffect, useRef } from "react";
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
import { BannerSection } from "@/components/banner-section";
import type {
  Hotel,
  Package,
  RoomType,
} from "@/lib/types/packages";

import { usePackageSearchStore } from "@/lib/package-search-store";
import { allPackages } from "@/lib/data/packages";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { hotels, auth, features } from "@/lib/api";
import { toast } from "sonner";
import type { HotelDto } from "@/lib/types/api";

const queryClient = new QueryClient();

function PackagesContent() {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  const destination = usePackageSearchStore((state) => state.destination);
  const checkIn = usePackageSearchStore((state) => state.checkIn);
  const checkOut = usePackageSearchStore((state) => state.checkOut);
  const adults = usePackageSearchStore((state) => state.adults);
  const hotelFilter = usePackageSearchStore((state) => state.hotelFilter);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const [shouldSearch, setShouldSearch] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
  }, []);

  // Hotel search query using our API service
  const { data: apiHotels, isLoading, error, refetch } = useQuery({
    queryKey: ['hotels-search', destination, checkIn, checkOut, adults],
    queryFn: async () => {
      if (!destination || !checkIn || !checkOut) {
        throw new Error('Missing required search parameters');
      }

      // Convert destination to cityId format (CO-BOG)
      let cityId = destination;
      if (!destination.startsWith('CO-')) {
        // Try to map common cities to their codes
        const cityMapping: Record<string, string> = {
          'bogota': 'CO-BOG',
          'bogotá': 'CO-BOG',
          'medellin': 'CO-MDE',
          'medellín': 'CO-MDE',
          'cartagena': 'CO-CTG',
          'cali': 'CO-CLO',
          'barranquilla': 'CO-BAQ'
        };
        
        const normalizedDest = destination.toLowerCase();
        cityId = cityMapping[normalizedDest] || `CO-${destination.substring(0, 3).toUpperCase()}`;
      }

      try {
        const results = await hotels.search({
          cityId,
          checkIn,
          checkOut,
          adults: adults || 2,
          rooms: 1
        });
        
        toast.success(t(
          `Se encontraron ${results.length} hoteles disponibles`, 
          `Found ${results.length} available hotels`
        ));
        
        return results;
      } catch (error: any) {
        console.error('Hotel search error:', error);
        
        // Show user-friendly error messages
        if (error.status === 401) {
          toast.error(t('Sesión expirada. Por favor inicia sesión.', 'Session expired. Please log in.'));
          setIsAuthenticated(false);
        } else if (error.status === 404) {
          toast.error(t('No se encontraron hoteles para este destino', 'No hotels found for this destination'));
        } else {
          toast.error(t('Error al buscar hoteles', 'Error searching hotels'));
        }
        
        throw error;
      }
    },
    enabled: shouldSearch && !!destination && !!checkIn && !!checkOut && isAuthenticated && features.hotelBooking,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.status === 401) return false;
      return failureCount < 2;
    }
  });

  // Manual search trigger for testing
  const handleTestSearch = async () => {
    if (!isAuthenticated) {
      toast.error(t('Debes iniciar sesión para buscar hoteles', 'You must log in to search hotels'));
      return;
    }
    
    if (!destination) {
      toast.error(t('Selecciona un destino', 'Select a destination'));
      return;
    }
    
    setShouldSearch(true);
    refetch();
  };

  // Quick login for testing (you should replace with proper login flow)
  const handleQuickLogin = async () => {
    try {
      const response = await auth.login({
        email: 'empleado@turismo.com', // Default test user
        password: 'password123'
      });
      
      const token = response.access_token || response.token;
      if (token) {
        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
        toast.success(t('Sesión iniciada correctamente', 'Logged in successfully'));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(t('Error al iniciar sesión', 'Login error: ') + (error.message || 'Unknown error'));
    }
  };

  // Logout helper
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    toast.info(t('Sesión cerrada', 'Logged out'));
  };

  useEffect(() => {
    if (destination && checkIn && checkOut) {
      setShouldSearch(true);
    }
  }, [destination, checkIn, checkOut]);


  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      if ((destination || hotelFilter) && searchBarRef.current) {
        setTimeout(() => {
          const searchBarPosition = searchBarRef.current?.offsetTop ? searchBarRef.current.offsetTop - 100 : 0;
          window.scrollTo({
            top: searchBarPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [destination, hotelFilter]);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // Use API hotels if available, otherwise fallback to mock data only if no search has been performed
  const packagesFromApi = (apiHotels && apiHotels.length > 0) ? apiHotels.map((hotel: HotelDto): Package => {
    // Get first image from images array or use default
    const firstImage = hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : '/images/cards/default-hotel.jpg';

    // Calculate price from rooms
    const minPrice = hotel.rooms && hotel.rooms.length > 0
      ? Math.min(...hotel.rooms.map(r => r.price || 0))
      : 0;

    return {
      hotel: {
        hotel_id: hotel.id,
        nombre: hotel.name,
        ciudad: hotel.city || 'Ciudad',
        pais: 'Colombia',
        categoria_estrellas: hotel.rating || 3,
        direccion: hotel.address || '',
        servicios_hotel: hotel.amenities || [],
        fotos: hotel.images && hotel.images.length > 0 ? hotel.images : [firstImage],
        habitaciones: (hotel.rooms || []).map((room): RoomType => ({
          habitacion_id: room.id,
          tipo: room.type,
          disponibilidad: room.available > 0 ? 'DISPONIBLE' : 'NO_DISPONIBLE',
          codigo_tipo_habitacion: room.id,
          precio: room.price || 0,
          servicios_habitacion: room.amenities || []
        }))
      },
      title: hotel.name,
      stars: hotel.rating || 3,
      includes: hotel.amenities?.slice(0, 3).join(', ') || 'Servicios incluidos',
      price: minPrice,
      displayPrice: minPrice > 0 ? `$${minPrice.toLocaleString('es-CO')} COP` : 'Consultar precio',
      hasBreakfast: hotel.rooms?.some(r => r.amenities?.includes('breakfast')) || false,
      imageUrl: firstImage
    };
  }) : [];

  // Add imageUrl to mock packages if not present
  // Solo usar mocks si no hay datos de API y no se ha realizado una búsqueda
  const packagesWithImages = packagesFromApi.length > 0
    ? packagesFromApi
    : allPackages.map(pkg => ({
      ...pkg,
      imageUrl: pkg.imageUrl || pkg.hotel?.fotos?.[0] || '/images/cards/default-hotel.jpg'
    }));

  const packagesToDisplay = packagesWithImages.filter((pkg) => {
    if (hotelFilter) {
      return pkg.hotel?.hotel_id === hotelFilter;
    }
    if (!destination) return true;

    const normalizedDest = normalizeText(destination);
    const normalizedCity = normalizeText(pkg.hotel?.ciudad || "");
    const normalizedCountry = normalizeText(pkg.hotel?.pais || "");


    let searchCountry = "";
    let searchCity = normalizedDest;

    if (normalizedDest.includes(",")) {
      const parts = normalizedDest.split(",").map(p => p.trim());
      if (parts.length >= 2) {
        searchCountry = parts[0];
        searchCity = parts[1];
      }
    } else {
      if (normalizedCountry.includes(normalizedDest) || normalizedDest.includes(normalizedCountry)) {
        return true;
      }
    }
    if (searchCountry && searchCity) {
      const countryMatches = normalizedCountry.includes(searchCountry) || searchCountry.includes(normalizedCountry);
      const cityMatches = normalizedCity.includes(searchCity) || searchCity.includes(normalizedCity);
      return countryMatches && cityMatches;
    }
    return (
      normalizedCity.includes(searchCity) ||
      searchCity.includes(normalizedCity) ||
      normalizedDest.includes(normalizedCity) ||
      normalizedCity.includes(normalizedDest)
    );
  });

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
  } = usePackagesFilters(packagesToDisplay);

  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

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
        "En Trip-In te conectamos con oportunidades únicas diseñadas para elevar cada viaje. Disfruta de ventajas especiales, acceso prioritario, recomendaciones personalizadas y experiencias que no encontrarás en ningún otro lugar. Viajar no es solo llegar al destino, es vivir momentos inolvidables desde el primer clic.",
        "At Trip-In, we connect you with unique opportunities designed to elevate every journey. Enjoy special perks, priority access, personalized recommendations, and experiences you won’t find anywhere else. Traveling isn’t just about reaching the destination — it’s about creating unforgettable moments from the very first click."
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection imageUrl="/images/banner/pack-banner.jpg">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("P A Q U E T E S", "P A C K A G E S")}
        </h1>
      </BannerSection>

      <section ref={searchBarRef} className="container mx-auto px-4 lg:px-8 -mt-8 relative z-30">
        <PackagesSearchBar />
        
        {/* API Testing Section */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Estado API:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  isAuthenticated 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {isAuthenticated ? 'Autenticado' : 'No autenticado'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Hoteles:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  features.hotelBooking 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {features.hotelBooking ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              {!isAuthenticated ? (
                <button
                  onClick={handleQuickLogin}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                >
                  Login Test
                </button>
              ) : (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs font-medium hover:bg-gray-700"
                >
                  Logout
                </button>
              )}
              
              <button
                onClick={handleTestSearch}
                disabled={!destination || isLoading || !isAuthenticated}
                className="px-4 py-2 bg-[#00C2A8] text-white rounded-lg text-sm font-medium hover:bg-[#00A892] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Buscando...' : 'Probar API'}
              </button>
            </div>
          </div>
          
          {destination && (
            <div className="mt-2 text-sm text-gray-600">
              Destino: <span className="font-medium">{destination}</span>
              {checkIn && checkOut && (
                <span className="ml-4">
                  | Fechas: {checkIn} - {checkOut}
                </span>
              )}
              {apiHotels && apiHotels.length > 0 && (
                <span className="ml-4 text-green-600 font-medium">
                  | {apiHotels.length} hoteles encontrados
                </span>
              )}
            </div>
          )}
        </div>
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

          <div className="space-y-8">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C2A8] mx-auto"></div>
                <p className="mt-4 text-gray-600">{t("Buscando hoteles disponibles...", "Searching available hotels...")}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{t("Error al buscar hoteles", "Error searching hotels")}</p>
                <p className="text-sm text-gray-500 mt-2">{error.message}</p>
              </div>
            ) : filteredPackages.length === 0 ? (
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

                      imageUrl={pkg.imageUrl || pkg.hotel?.fotos?.[0]}
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
        />
      )}
    </div>
  );
}

export default function PackagesPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PackagesContent />
    </QueryClientProvider>
  );
}
