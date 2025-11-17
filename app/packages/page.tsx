"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search, Tag, Star } from "lucide-react";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Card, CardContent } from "@/components/(ui)/card";
import { Checkbox } from "@/components/(ui)/checkbox";
import { Slider } from "@/components/(ui)/slider";
import { useLanguageStore } from "@/lib/store";
import { PackagesSearchBar } from "@/components/(packages)/search-bar";

export default function Page() {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([100]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [includesBreakfast, setIncludesBreakfast] = useState<boolean>(false);

  const allPackages = [
    {
      title: "Water City Dreams",
      stars: 4,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: 1250000,
      displayPrice: "$1.250.000 COP",
      airline: "Aerolínea X",
      hasBreakfast: true,
    },
    {
      title: "Mountain Paradise",
      stars: 3,
      includes: t(
        "Vuelo directo + Traslado",
        "Direct Flight + Transfer"
      ),
      price: 850000,
      displayPrice: "$850.000 COP",
      airline: "Aerolínea Y",
      hasBreakfast: false,
    },
    {
      title: "Luxury Beach Resort",
      stars: 5,
      includes: t(
        "Vuelo directo + Traslado + Desayuno + Cena",
        "Direct Flight + Transfer + Breakfast + Dinner"
      ),
      price: 2500000,
      displayPrice: "$2.500.000 COP",
      airline: "Aerolínea Z",
      hasBreakfast: true,
    },
    {
      title: "City Explorer",
      stars: 4,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: 1100000,
      displayPrice: "$1.100.000 COP",
      airline: "Aerolínea X",
      hasBreakfast: true,
    },
    {
      title: "Budget Adventure",
      stars: 2,
      includes: t(
        "Vuelo directo + Traslado",
        "Direct Flight + Transfer"
      ),
      price: 650000,
      displayPrice: "$650.000 COP",
      airline: "Aerolínea Y",
      hasBreakfast: false,
    },
    {
      title: "Premium Experience",
      stars: 5,
      includes: t(
        "Vuelo directo + Traslado + Desayuno + Spa",
        "Direct Flight + Transfer + Breakfast + Spa"
      ),
      price: 3200000,
      displayPrice: "$3.200.000 COP",
      airline: "Aerolínea Z",
      hasBreakfast: true,
    },
  ];

  const maxPackagePrice = Math.max(...allPackages.map(pkg => pkg.price));

  const filteredPackages = useMemo(() => {
    return allPackages.filter((pkg) => {
      // Filtro por precio mínimo
      const min = minPrice ? parseFloat(minPrice.replace(/\D/g, '')) : 0;
      if (min && pkg.price < min) return false;

      // Filtro por precio máximo
      const max = maxPrice ? parseFloat(maxPrice.replace(/\D/g, '')) : Infinity;
      if (max && pkg.price > max) return false;

      // Filtro por rango de precio (slider)
      const maxFromSlider = (priceRange[0] / 100) * maxPackagePrice;
      if (pkg.price > maxFromSlider) return false;

      // Filtro por estrellas
      if (selectedStars.length > 0 && !selectedStars.includes(pkg.stars)) {
        return false;
      }

      // Filtro por desayuno
      if (includesBreakfast && !pkg.hasBreakfast) {
        return false;
      }

      return true;
    });
  }, [minPrice, maxPrice, priceRange, selectedStars, includesBreakfast, allPackages, maxPackagePrice]);

  const handleStarToggle = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star)
        ? prev.filter((s) => s !== star)
        : [...prev, star]
    );
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setMaxPrice(value);
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
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-[#0A2540] mb-4">
                  {t("Precio", "Price")}
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Min $"
                      className="flex-1"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      type="text"
                    />
                    <Input
                      placeholder="Max $"
                      className="flex-1"
                      value={maxPrice}
                      onChange={handleMaxPriceChange}
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      {t("Hasta", "Up to")} ${Math.floor((priceRange[0] / 100) * maxPackagePrice).toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-[#0A2540] mb-4">
                  {t("Estrellas", "Stars")}
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2">
                      <Checkbox
                        id={`star-${star}`}
                        checked={selectedStars.includes(star)}
                        onCheckedChange={() => handleStarToggle(star)}
                      />
                      <label
                        htmlFor={`star-${star}`}
                        className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
                      >
                        {star}{" "}
                        <Star className="h-3 w-3 fill-[#00C2A8] text-[#00C2A8]" />
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-[#0A2540] mb-4">
                  {t("Detalles", "Details")}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="breakfast"
                      checked={includesBreakfast}
                      onCheckedChange={(checked) => setIncludesBreakfast(checked as boolean)}
                    />
                    <label
                      htmlFor="breakfast"
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {t("Incluye desayuno", "Includes breakfast")}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600" />
                      <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: pkg.stars }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-[#00C2A8] text-[#00C2A8]"
                            />
                          ))}
                        </div>
                        <h3 className="text-lg font-bold text-[#0A2540] mb-3">
                          {pkg.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {pkg.includes}
                        </p>
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-[#0A2540]">
                            {t("Desde", "From")} {pkg.displayPrice}
                          </p>
                          <p className="text-sm text-gray-600">
                            / {t("persona", "person")}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {pkg.airline}
                          </p>
                        </div>
                        <Button className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                          {t("Reservar", "Book")}
                        </Button>
                      </CardContent>
                    </Card>
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
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
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
    </div>
  );
}