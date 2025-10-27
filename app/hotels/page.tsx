"use client"

import { motion } from "framer-motion"
import { MapPin, Calendar, Users, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguageStore } from "@/lib/store"

export default function HotelsPage() {
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)

  const destinations = [
    {
      title: t("where can i go? 5 amazing countries that are open right now", "where can i go? 5 amazing countries that are open right now"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("beautiful view of indonesia's natural hills", "beautiful view of indonesia's natural hills"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("10 Indonesian Destinations you should visit in this year", "10 Indonesian Destinations you should visit in this year"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("5 mountains that you must visit while in Indonesia", "5 mountains that you must visit while in Indonesia"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("the most interesting historical monuments in Indonesia", "the most interesting historical monuments in Indonesia"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("travel booking before missing the discount", "travel booking before missing the discount"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("travel booking before missing the discount", "travel booking before missing the discount"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("beautiful view of indonesia's natural hills", "beautiful view of indonesia's natural hills"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
    {
      title: t("10 Indonesian Destinations you should visit in this year", "10 Indonesian Destinations you should visit in this year"),
      date: "September 19, 2022",
      image: "/placeholder.jpg",
    },
  ]

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
          {t("H O T E L E S", "H O T E L S")}
        </h1>
      </section>

      <section className="container mx-auto px-4 lg:px-8 -mt-8 relative z-30">
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input placeholder={t("Destino", "Destination")} className="pl-10" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  placeholder={t("Dia de llegada", "Check-in day")}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="date"
                  placeholder={t("Dia de salida", "Check-out day")}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  placeholder={t("# Personas", "# Persons")}
                  className="pl-10"
                  min="1"
                />
              </div>
              <div className="relative">
                <Input
                  type="number"
                  placeholder={t("# Habitaciones", "# Rooms")}
                  min="1"
                />
              </div>
              <Button className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                <Search className="h-5 w-5 mr-2" />
                {t("Encuentra tu hotel", "Find your hotel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-[#00C2A8] text-white hover:bg-[#00C2A8]/90">
              {t("Incluye desayuno", "Includes breakfast")}
            </Button>
            <Button variant="outline">{t("Detalles", "Details")}</Button>
            <Button variant="outline">{t("Detalles", "Details")}</Button>
            <div className="flex items-center gap-2">
              <Input placeholder="Min $" className="w-24" />
              <Input placeholder="Max $" className="w-24" />
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 text-gray-300 cursor-pointer hover:fill-[#00C2A8] hover:text-[#00C2A8] transition-colors" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-56 bg-gradient-to-br from-blue-400 to-blue-600" />
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-[#0A2540] mb-2 line-clamp-2">
                    {dest.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{dest.date}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
