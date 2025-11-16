"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar, Users, Search } from "lucide-react"
import { Button } from "@/components/(ui)/button"
import { Input } from "@/components/(ui)/input"
import { Card, CardContent } from "@/components/(ui)/card"
import { useLanguageStore } from "@/lib/store"

export default function Home() {
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)

  const packages = [
    {
      title: "Taman Nasional Komodo",
      hotel: "Hotel San Pedro Plaza",
      airline: "Aerolínea LATAM",
      stars: 4,
      price: "$1.250.000 COP",
      image: "/placeholder.jpg",
      includes: t("Hotel 4 Estrellas + Desayuno\nVuelo directo + Traslado", "4-Star Hotel + Breakfast\nDirect Flight + Transfer"),
    },
    {
      title: "Gili Trawangan, Lombok",
      hotel: "Hotel San Pedro Plaza",
      airline: "Aerolínea LATAM",
      stars: 4,
      price: "$1.250.000 COP",
      image: "/placeholder.jpg",
      includes: t("Hotel 4 Estrellas + Desayuno\nVuelo directo + Traslado", "4-Star Hotel + Breakfast\nDirect Flight + Transfer"),
    },
    {
      title: "Taman Nasional Bromo",
      hotel: "Hotel San Pedro Plaza",
      airline: "Aerolínea LATAM",
      stars: 4,
      price: "$1.250.000 COP",
      image: "/placeholder.jpg",
      includes: t("Hotel 4 Estrellas + Desayuno\nVuelo directo + Traslado", "4-Star Hotel + Breakfast\nDirect Flight + Transfer"),
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-b from-[#0A2540]/80 to-[#0A2540]/60 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/placeholder.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A2540]/80 to-[#0A2540]/60 z-10" />

        <div className="container mx-auto px-4 lg:px-8 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t("Explore the world with a smile", "Explore the world with a smile")}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {t(
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo.",
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo."
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="max-w-4xl mx-auto shadow-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder={t("City or Destination", "City or Destination")}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="date"
                      placeholder={t("Date of stay", "Date of stay")}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="number"
                      placeholder={t("Person", "Person")}
                      className="pl-10"
                      min="1"
                    />
                  </div>
                  <Button className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                    <Search className="h-5 w-5 mr-2" />
                    {t("Encuentra tu paquete", "Find your package")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-3xl overflow-hidden h-[400px]">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden h-[190px]">
                  <div className="w-full h-full bg-gradient-to-br from-[#00C2A8] to-teal-600" />
                </div>
                <div className="rounded-3xl overflow-hidden h-[190px]">
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-600" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#00C2A8] font-semibold mb-2">Trip-In Point</h3>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A2540] mb-6">
                {t("Te ayudamos a encontrar tu próximo destino favorito", "We help you find your next favorite destination")}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  "En Trip-In creemos que cada viaje empieza con una buena idea. Por eso reunimos en un solo lugar paquetes personalizados, vuelos, hoteles y opciones de pago seguras, para que planear tu aventura sea tan fácil como vivirla.",
                  "At Trip-In we believe that every trip starts with a good idea. That's why we bring together in one place personalized packages, flights, hotels and secure payment options, so that planning your adventure is as easy as living it."
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#00C2A8] font-semibold mb-2">Top Paquetes</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0A2540]">
              {t("Descubre tu pasión", "Discover your passion")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-64 bg-gradient-to-br from-blue-400 to-blue-600" />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-[#0A2540] mb-3">{pkg.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">{pkg.includes}</p>
                    <div className="space-y-2 mb-4">
                      <p className="text-2xl font-bold text-[#0A2540]">
                        {t("Desde", "From")} {pkg.price}
                      </p>
                      <p className="text-sm text-gray-600">/ {t("persona", "person")}</p>
                      <p className="text-sm text-gray-600">{pkg.hotel}</p>
                      <p className="text-sm text-gray-600">{pkg.airline}</p>
                    </div>
                    <Button className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                      {t("Reservar ahora", "Book now")}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
