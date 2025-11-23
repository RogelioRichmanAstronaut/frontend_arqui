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
export default function Page() {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  const destination = usePackageSearchStore((state) => state.destination);
  const hotelFilter = usePackageSearchStore((state) => state.hotelFilter);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);


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
  }, []);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  const packagesToDisplay = allPackages.filter((pkg) => {
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
        />
      )}
    </div>
  );
}
