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
import { PackagesSearchBar } from "@/components/(packages)/search-bar";

export default function Page() {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

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
