"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Search, Tag, Star } from "lucide-react";
import { Button } from "@/components/(ui)/button";
import { Input } from "@/components/(ui)/input";
import { Card, CardContent } from "@/components/(ui)/card";
import { Checkbox } from "@/components/(ui)/checkbox";
import { Slider } from "@/components/(ui)/slider";
import { useLanguageStore } from "@/lib/store";

export default function Page() {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [adults, setAdults] = useState<number>(1);
  const [rooms, setRooms] = useState<number>(1);

  const handleIncrement = (type: "adults" | "rooms"): void => {
    if (type === "adults") {
      setAdults((prev: number) => prev + 1);
    } else {
      setRooms((prev: number) => prev + 1);
    }
  };

  const handleDecrement = (type: "adults" | "rooms"): void => {
    if (type === "adults" && adults > 1) {
      setAdults((prev: number) => prev - 1);
    } else if (type === "rooms" && rooms > 1) {
      setRooms((prev: number) => prev - 1);
    }
  };
  
  const handleReset = () => {
    setAdults(1);
    setRooms(1);
  };
  
  const packages = [
    {
      title: "Water City Dreams",
      stars: 4,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: "$1.250.000 COP",
      airline: "Aerolínea X",
    },
    {
      title: "Water City Dreams",
      stars: 3,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: "$1.250.000 COP",
      airline: "Aerolínea X",
    },
    {
      title: "Water City Dreams",
      stars: 6,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: "$1.250.000 COP",
      airline: "Aerolínea X",
    },
    {
      title: "Water City Dreams",
      stars: 4,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: "$1.250.000 COP",
      airline: "Aerolínea X",
    },
    {
      title: "Water City Dreams",
      stars: 3,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: "$1.250.000 COP",
      airline: "Aerolínea X",
    },
    {
      title: "Water City Dreams",
      stars: 6,
      includes: t(
        "Vuelo directo + Traslado + Desayuno",
        "Direct Flight + Transfer + Breakfast"
      ),
      price: "$1.250.000 COP",
      airline: "Aerolínea X",
    },
  ];

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
      <Card className="shadow-2xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* DESTINO */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input placeholder={t("Destino", "Destination")} className="pl-10" />
            </div>

            {/* FECHA DE SALIDA */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="date"
                placeholder={t("Día de salida", "Departure day")}
                className="pl-10"
              />
            </div>

            {/* FECHA DE LLEGADA */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="date"
                placeholder={t("Día de llegada", "Arrival day")}
                className="pl-10"
              />
            </div>

            {/* NÚMERO DE ADULTOS */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-10 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-left bg-white hover:border-[#00C2A8] focus:outline-none focus:ring-2 focus:ring-[#00C2A8] focus:border-transparent text-sm text-gray-500"
              >
                {adults > 0 ? `${adults}` : t("# de adultos", "# of adults")}
              </button>

              {/* POPOVER */}
              {isOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
                  {/* ADULTOS */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">
                      {t("Adultos", "Adults")}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDecrement("adults")}
                        disabled={adults <= 1}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          adults <= 1
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white"
                        } transition-colors`}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{adults}</span>
                      <button
                        onClick={() => handleIncrement("adults")}
                        className="w-8 h-8 rounded-full border-2 border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* HABITACIONES */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">
                      {t("Habitaciones", "Rooms")}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleDecrement("rooms")}
                        disabled={rooms <= 1}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          rooms <= 1
                            ? "border-gray-200 text-gray-300 cursor-not-allowed"
                            : "border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white"
                        } transition-colors`}
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium">{rooms}</span>
                      <button
                        onClick={() => handleIncrement("rooms")}
                        className="w-8 h-8 rounded-full border-2 border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white flex items-center justify-center transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* BOTONES */}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={handleReset}
                      className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                    >
                      {t("REINICIAR", "RESET")}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-[#0A2540] hover:bg-[#0A2540]/90 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t("Aceptar", "Accept")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* NÚMERO DE HABITACIONES (SOLO LECTURA) */}
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                value={rooms}
                readOnly
                placeholder={t("# de habitaciones", "# of rooms")}
                className="pl-10 text-xs bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* BOTON */}
            <Button className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
              <Search className="h-5 w-5 mr-2" />
              {t("Encuentra tu paquete", "Find your package")}
            </Button>
          </div>
        </CardContent>
      </Card>
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
                    <Input placeholder="Min $" className="flex-1" />
                    <Input placeholder="Max $" className="flex-1" />
                  </div>
                  <Slider defaultValue={[50]} max={100} step={1} />
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
                      <Checkbox id={`star-${star}`} />
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
                    <Checkbox id="breakfast" />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
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
                          {t("Desde", "From")} {pkg.price}
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

