"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/(ui)/button"
import { Card, CardContent } from "@/components/(ui)/card"
import { useLanguageStore } from "@/lib/store"
import { PackagesSearchBar } from "@/components/(packages)/search-bar"
import Image from "next/image"

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
      image: "/images/cards/tripa.jpg",
      includes: t(
        "Hotel 4 Estrellas + Desayuno\nVuelo directo + Traslado",
        "4-Star Hotel + Breakfast\nDirect Flight + Transfer"
      ),
    },
    {
      title: "Gili Trawangan, Lombok",
      hotel: "Hotel San Pedro Plaza",
      airline: "Aerolínea LATAM",
      stars: 4,
      price: "$1.250.000 COP",
      image: "/images/cards/tripa.jpg",
      includes: t(
        "Hotel 4 Estrellas + Desayuno\nVuelo directo + Traslado",
        "4-Star Hotel + Breakfast\nDirect Flight + Transfer"
      ),
    },
    {
      title: "Taman Nasional Bromo",
      hotel: "Hotel San Pedro Plaza",
      airline: "Aerolínea LATAM",
      stars: 4,
      price: "$1.250.000 COP",
      image: "/images/cards/tripa.jpg",
      includes: t(
        "Hotel 4 Estrellas + Desayuno\nVuelo directo + Traslado",
        "4-Star Hotel + Breakfast\nDirect Flight + Transfer"
      ),
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-b from-[#0A2540]/80 to-[#0A2540]/60 overflow-visible pb-32">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/cards/tripa.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero-banner.mp4" type="video/mp4" />
          { }
          Tu navegador no soporta el elemento de video.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/60 z-10" />

        <div className="container mx-auto px-4 lg:px-8 z-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t(
                "Explora el mundo con una sonrisa",
                "Explore the world with a smile"
              )}
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {t(
                "Descubre destinos únicos, vive experiencias inolvidables y crea recuerdos que durarán para siempre. Encuentra el paquete ideal combinando vuelos, hoteles y beneficios exclusivos para hacer de tu viaje algo extraordinario.",
                "Discover unique destinations, live unforgettable experiences, and create memories that will last forever. Find the ideal package by combining flights, hotels, and exclusive benefits to make your trip extraordinary."
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-30"
          >
            <PackagesSearchBar />
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white mt-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-3xl overflow-hidden h-[400px] relative">
                <Image
                  src="/images/cards/tripa.jpg"
                  alt="Trip A"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden h-[190px] relative">
                  <Image
                    src="/images/cards/tripb.jpg"
                    alt="Trip B"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden h-[190px] relative">
                  <Image
                    src="/images/cards/tripc.jpeg"
                    alt="Trip C"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-[#00C2A8] font-semibold mb-2">
                Trip-In Point
              </h3>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0A2540] mb-6">
                {t(
                  "Te ayudamos a encontrar tu próximo destino favorito",
                  "We help you find your next favorite destination"
                )}
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


    </div>
  )
}