"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/(ui)/button"
import { Card, CardContent } from "@/components/(ui)/card"
import { useLanguageStore } from "@/lib/store"

export default function DiscoverPage() {
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)

  const otherDestinations = [
    {
      title: t("Wakatobi Beach is A Paradise For Coral Reets in Indonesia", "Wakatobi Beach is A Paradise For Coral Reets in Indonesia"),
      location: "Yogyakarta, Indonesia",
      image: "/placeholder.jpg",
    },
    {
      title: t("Wakatobi Beach is A Paradise For Coral Reets in Indonesia", "Wakatobi Beach is A Paradise For Coral Reets in Indonesia"),
      location: "Yogyakarta, Indonesia",
      image: "/placeholder.jpg",
    },
    {
      title: t("Wakatobi Beach is A Paradise For Coral Reets in Indonesia", "Wakatobi Beach is A Paradise For Coral Reets in Indonesia"),
      location: "Yogyakarta, Indonesia",
      image: "/placeholder.jpg",
    },
    {
      title: t("Wakatobi Beach is A Paradise For Coral Reets in Indonesia", "Wakatobi Beach is A Paradise For Coral Reets in Indonesia"),
      location: "Yogyakarta, Indonesia",
      image: "/placeholder.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative h-[300px] flex items-center justify-center bg-gradient-to-b from-[#0A2540]/80 to-[#0A2540]/60">
        <div
          className="absolute inset-0 z-0 bg-center bg-cover"
          style={{
            backgroundImage: "url('/images/banner/discover-banner.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60 z-10" />
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("D E S C U B R I R", "D I S C O V E R")}
        </h1>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div>
              <h2 className="text-5xl font-bold text-[#0A2540] mb-8 leading-tight">
                D
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                {t(
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo,",
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo,"
                )}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  "enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla fau.",
                  "enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis eu volutpat odio facilisis mauris sit amet massa vitae tortor condimentum lacinia quis vel eros donec ac odio tempor orci dapibus ultrices in iaculis nunc sed augue lacus, viverra vitae congue eu, consequat ac felis donec et odio pellentesque diam volutpat commodo sed egestas egestas fringilla fau."
                )}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="overflow-hidden">
            <div className="relative h-[400px] lg:h-[500px] bg-gradient-to-br from-blue-400 to-blue-600" />
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-[#0A2540] mb-2">
                    {t("Memorable Festivals On Bali Beach", "Memorable Festivals On Bali Beach")}
                  </h2>
                  <p className="text-gray-600">Bali, Indonesia</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi.",
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim praesent elementum facilisis leo, vel fringilla est ullamcorper eget nulla facilisi."
                )}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet integer facilisis aliquet erat vitae viverra ornare. Placerat urna integer nibh justo. Dictum vulputate odio mauris amet, dictumst molestie. Faucibus consectetur mauris tristique dolor ut diam, adipiscing et. Semper mi proin malesuada orci phasellus. Consectetur posuere iaculis amet sem. Euismod turpis pellentesque sit risus eu, sagittis nulla. Facilisis urna, mi pharetra sed.",
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet integer facilisis aliquet erat vitae viverra ornare. Placerat urna integer nibh justo. Dictum vulputate odio mauris amet, dictumst molestie. Faucibus consectetur mauris tristique dolor ut diam, adipiscing et. Semper mi proin malesuada orci phasellus. Consectetur posuere iaculis amet sem. Euismod turpis pellentesque sit risus eu, sagittis nulla. Facilisis urna, mi pharetra sed."
                )}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg" />
                <div className="h-48 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg" />
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet integer facilisis aliquet erat vitae viverra ornare. Placerat urna integer nibh justo. Dictum vulputate odio mauris amet, dictumst molestie. Faucibus consectetur mauris tristique dolor ut diam, adipiscing et. Semper mi proin malesuada orci phasellus. Consectetur posuere iaculis amet sem. Euismod turpis pellentesque sit risus eu, sagittis nulla. Facilisis urna, mi pharetra sed.",
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amet integer facilisis aliquet erat vitae viverra ornare. Placerat urna integer nibh justo. Dictum vulputate odio mauris amet, dictumst molestie. Faucibus consectetur mauris tristique dolor ut diam, adipiscing et. Semper mi proin malesuada orci phasellus. Consectetur posuere iaculis amet sem. Euismod turpis pellentesque sit risus eu, sagittis nulla. Facilisis urna, mi pharetra sed."
                )}
              </p>
              <Button className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                {t("View More", "View More")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#0A2540]">
            {t("Other Destinations", "Other Destinations")}
          </h2>
          <Button variant="link" className="text-[#00C2A8]">
            {t("See all", "See all")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {otherDestinations.map((dest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-56 bg-gradient-to-br from-teal-400 to-teal-600" />
                <CardContent className="p-6">
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2 -mt-20 relative z-10">
                    {dest.title}
                  </h3>
                  <p className="text-sm text-white mb-16 relative z-10">{dest.location}</p>
                  <Button className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
                    {t("View More", "View More")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
