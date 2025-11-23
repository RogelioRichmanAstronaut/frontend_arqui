import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Building2 } from "lucide-react";
import { Input } from "@/components/(ui)/input";
import { Button } from "@/components/(ui)/button";
import { Card, CardContent } from "@/components/(ui)/card";
import { useLanguageStore } from "@/lib/store";
import { usePackageSearchStore } from "@/lib/package-search-store";
import { DateRangePicker } from "./calendar";
import { GuestsRoomsSelector } from "./room-guest-selector";
import { destinations } from "@/lib/destinations";
import { allPackages } from "@/lib/data/packages";

export function PackagesSearchBar() {
  const router = useRouter();
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

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
  const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<{ id: string; name: string; city: string }[]>([]);

  const handleDestinationChange = (value: string) => {
    setLocalDestination(value);
    setLocalHotelFilter(null);

    if (value.length > 0) {
      const term = value.toLowerCase();

      // Filter destinations
      const dests = destinations.filter((d) =>
        d.toLowerCase().includes(term)
      );

      // Filter hotels
      const hotels = allPackages
        .map(p => p.hotel)
        .filter(h => h && h.nombre.toLowerCase().includes(term))
        .map(h => ({ id: h!.hotel_id, name: h!.nombre, city: h!.ciudad }));

      setFilteredDestinations(dests);
      setFilteredHotels(hotels);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectDestination = (value: string) => {
    setLocalDestination(value);
    setLocalHotelFilter(null);
    setShowSuggestions(false);
  };

  const handleSelectHotel = (hotel: { id: string; name: string; city: string }) => {
    setLocalDestination(hotel.name);
    setLocalHotelFilter(hotel.id);
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
          {/* destino */}
          <div className="relative flex-1 z-50">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t("Destino o Hotel", "Destination or Hotel")}
              className="pl-10"
              value={localDestination}
              onChange={(event) => handleDestinationChange(event.target.value)}
              onFocus={() => {
                if (localDestination) {
                  handleDestinationChange(localDestination);
                }
              }}
              onBlur={() => {

                setTimeout(() => setShowSuggestions(false), 200);
              }}
            />
            {showSuggestions && (filteredDestinations.length > 0 || filteredHotels.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                {filteredDestinations.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                      {t("Destinos", "Destinations")}
                    </div>
                    {filteredDestinations.map((dest, index) => (
                      <div
                        key={`dest-${index}`}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                        onClick={() => handleSelectDestination(dest)}
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {dest}
                      </div>
                    ))}
                  </div>
                )}

                {filteredHotels.length > 0 && (
                  <div className="py-2 border-t border-gray-100">
                    <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                      {t("Hoteles", "Hotels")}
                    </div>
                    {filteredHotels.map((hotel, index) => (
                      <div
                        key={`hotel-${index}`}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                        onClick={() => handleSelectHotel(hotel)}
                      >
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <div>
                          <p>{hotel.name}</p>
                          <p className="text-xs text-gray-500">{hotel.city}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
