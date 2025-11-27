import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/(ui)/input";
import { Button } from "@/components/(ui)/button";
import { Card, CardContent } from "@/components/(ui)/card";
import { useLanguageStore } from "@/lib/store";
import { usePackageSearchStore } from "@/lib/package-search-store";
import { DateRangePicker } from "./calendar";
import { GuestsRoomsSelector } from "./room-guest-selector";
import { useCatalogCities } from "@/lib/hooks/useCatalog";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { City } from "@/lib/api/catalog";

const queryClient = new QueryClient();

function SearchBarContent() {
  const router = useRouter();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  
  // Obtener ciudades del backend
  const { data: catalogCities, isLoading: loadingCities } = useCatalogCities();

  const [activePanel, setActivePanel] = useState<"dates" | "guests" | null>(null);


  const globalDestination = usePackageSearchStore((state) => state.destination);
  const globalHotelFilter = usePackageSearchStore((state) => state.hotelFilter);
  const setGlobalDestination = usePackageSearchStore((state) => state.setDestination);
  const setGlobalHotelFilter = usePackageSearchStore((state) => state.setHotelFilter);


  const [localDestination, setLocalDestination] = useState(globalDestination);
  const [localHotelFilter, setLocalHotelFilter] = useState<string | null>(globalHotelFilter);


  useEffect(() => {
    setLocalDestination(globalDestination);
    setLocalHotelFilter(globalHotelFilter);
  }, [globalDestination, globalHotelFilter]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  // Agrupar ciudades por país
  const getCountryName = (cityId: string): string => {
    const country = cityId.split('-')[0];
    const names: Record<string, string> = {
      'CO': 'Colombia', 'US': 'Estados Unidos', 'ES': 'España',
      'MX': 'México', 'BR': 'Brasil', 'AR': 'Argentina',
      'PE': 'Perú', 'CL': 'Chile', 'PA': 'Panamá',
    };
    return names[country] || country;
  };

  const handleDestinationChange = (value: string) => {
    setLocalDestination(value);
    setLocalHotelFilter(null);

    if (value.length > 0 && catalogCities) {
      const term = value.toLowerCase();
      
      // Filtrar ciudades que coincidan
      const filtered = catalogCities.filter((city) =>
        city.name.toLowerCase().includes(term) ||
        city.iataCode?.toLowerCase().includes(term) ||
        city.id.toLowerCase().includes(term)
      );

      setFilteredCities(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: City) => {
    // Guardar con formato "IATA - Nombre" para display
    setLocalDestination(`${city.iataCode || city.id.split('-')[1]} - ${city.name}`);
    setLocalHotelFilter(null);
    setShowSuggestions(false);
  };

  const toggleDates = () => {
    setActivePanel((prev) => (prev === "dates" ? null : "dates"));
  };

  const toggleGuests = () => {
    setActivePanel((prev) => (prev === "guests" ? null : "guests"));
  };

  const handleSearch = (e?: React.MouseEvent<HTMLButtonElement>) => {

    e?.preventDefault();
    e?.stopPropagation();

    setGlobalDestination(localDestination);
    setGlobalHotelFilter(localHotelFilter);

    const currentPath = window.location.pathname;
    if (currentPath === "/packages") {
      return;
    }
    router.push("/packages");
  };

  return (
    <Card className="shadow-2xl overflow-visible max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* destino (OPCIONAL según docs) */}
          <div className="relative flex-1 z-50">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={
                loadingCities 
                  ? t("Cargando destinos...", "Loading destinations...") 
                  : t("Destino (opcional)", "Destination (optional)")
              }
              className="pl-10 pr-16"
              value={localDestination}
              onChange={(event) => handleDestinationChange(event.target.value)}
              onFocus={() => {
                if (localDestination) {
                  handleDestinationChange(localDestination);
                } else if (catalogCities) {
                  // Mostrar todas las ciudades al hacer focus
                  setFilteredCities(catalogCities);
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              disabled={loadingCities}
            />
            {!loadingCities && !localDestination && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                {t("opcional", "optional")}
              </span>
            )}
            {loadingCities && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
            {showSuggestions && filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                {/* Agrupar por país */}
                {Object.entries(
                  filteredCities.reduce((acc, city) => {
                    const country = getCountryName(city.id);
                    if (!acc[country]) acc[country] = [];
                    acc[country].push(city);
                    return acc;
                  }, {} as Record<string, City[]>)
                ).map(([country, cities]) => (
                  <div key={country} className="py-1">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0">
                      {country}
                    </div>
                    {cities.map((city) => (
                      <div
                        key={city.id}
                        className="px-4 py-2 hover:bg-[#00C2A8]/10 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                        onClick={() => handleSelectCity(city)}
                      >
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{city.iataCode || city.id.split('-')[1]}</span>
                        <span className="text-gray-400">-</span>
                        <span>{city.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* fechas */}
          <div className="flex-1">
            <DateRangePicker
              isOpen={activePanel === "dates"}
              onToggle={toggleDates}
            />
          </div>

          {/* huespedes y habitaciones */}
          <div className="flex-[1.5]">
            <GuestsRoomsSelector
              isOpen={activePanel === "guests"}
              onToggle={toggleGuests}
            />
          </div>

          {/* boton buscar */}
          <Button
            type="button"
            onClick={handleSearch}
            className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white flex items-center justify-center h-10 w-12 px-0 shrink-0"
            aria-label={t("Buscar", "Search")}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PackagesSearchBar() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchBarContent />
    </QueryClientProvider>
  );
}
