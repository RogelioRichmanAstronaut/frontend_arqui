"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/(ui)/button"
import { Card, CardContent } from "@/components/(ui)/card"
import { useLanguageStore } from "@/lib/store"
import { BannerSection } from "@/components/banner-section"

export default function DiscoverPage() {
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)

  const destinations = [
    {
      title: {
        es: "Cartagena de Indias - La Heroica del Caribe",
        en: "Cartagena de Indias - The Heroic City of the Caribbean"
      },
      location: {
        es: "Cartagena, Colombia",
        en: "Cartagena, Colombia"
      },
      description: {
        es: "Descubre la magia de Cartagena, una ciudad colonial llena de historia, playas paradisíacas y una rica cultura caribeña. Explora sus murallas, disfruta de su gastronomía única y relájate en sus hermosas playas.",
        en: "Discover the magic of Cartagena, a colonial city full of history, paradisiacal beaches and a rich Caribbean culture. Explore its walls, enjoy its unique gastronomy and relax on its beautiful beaches."
      },
      image: "/images/destinations/cartagena.jpg",
    },
    {
      title: {
        es: "San Andrés - Paraíso en el Mar Caribe",
        en: "San Andrés - Paradise in the Caribbean Sea"
      },
      location: {
        es: "San Andrés, Colombia",
        en: "San Andrés, Colombia"
      },
      description: {
        es: "Sumérgete en las aguas cristalinas de San Andrés, un paraíso tropical con playas de arena blanca, arrecifes de coral y una cultura isleña única. Perfecto para buceo, snorkel y relajación.",
        en: "Dive into the crystal clear waters of San Andrés, a tropical paradise with white sand beaches, coral reefs and a unique island culture. Perfect for diving, snorkeling and relaxation."
      },
      image: "/images/destinations/san-andres.jpg",
    },
    {
      title: {
        es: "Medellín - La Ciudad de la Eterna Primavera",
        en: "Medellín - The City of Eternal Spring"
      },
      location: {
        es: "Medellín, Colombia",
        en: "Medellín, Colombia"
      },
      description: {
        es: "Experimenta la transformación de Medellín, una ciudad innovadora con un clima perfecto, cultura vibrante, arte urbano impresionante y gente amable. Conoce sus barrios, museos y disfruta de su vida nocturna.",
        en: "Experience the transformation of Medellín, an innovative city with perfect weather, vibrant culture, impressive urban art and friendly people. Discover its neighborhoods, museums and enjoy its nightlife."
      },
      image: "/images/destinations/medellin.jpg",
    },
    {
      title: {
        es: "Tayrona - Naturaleza y Aventura",
        en: "Tayrona - Nature and Adventure"
      },
      location: {
        es: "Parque Nacional Tayrona, Colombia",
        en: "Tayrona National Park, Colombia"
      },
      description: {
        es: "Explora el Parque Nacional Tayrona, un santuario natural donde la selva se encuentra con el mar. Disfruta de playas vírgenes, senderos ecológicos y una biodiversidad única en el mundo.",
        en: "Explore Tayrona National Park, a natural sanctuary where the jungle meets the sea. Enjoy pristine beaches, ecological trails and unique biodiversity in the world."
      },
      image: "/images/destinations/tayrona.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection imageUrl="/images/banner/discover-banner.jpg">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("D E S C U B R I R", "D I S C O V E R")}
        </h1>
      </BannerSection>

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
                {t("Descubre", "Discover")}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                {t(
                  "Colombia es un país lleno de contrastes y maravillas naturales que esperan ser exploradas. Desde las playas caribeñas hasta las montañas andinas, pasando por selvas tropicales y desiertos, nuestro país ofrece una diversidad única que cautiva a todos los viajeros.",
                  "Colombia is a country full of contrasts and natural wonders waiting to be explored. From Caribbean beaches to Andean mountains, through tropical jungles and deserts, our country offers a unique diversity that captivates all travelers."
                )}
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                {t(
                  "En Trip-In te invitamos a descubrir los destinos más fascinantes de Colombia. Cada lugar tiene su propia historia, cultura y encanto especial. Ya sea que busques relajarte en playas paradisíacas, explorar ciudades históricas, aventurarte en la naturaleza o sumergirte en tradiciones locales, tenemos el destino perfecto para ti.",
                  "At Trip-In we invite you to discover the most fascinating destinations in Colombia. Each place has its own history, culture and special charm. Whether you're looking to relax on paradisiacal beaches, explore historic cities, adventure in nature or immerse yourself in local traditions, we have the perfect destination for you."
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {destinations.map((dest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={dest.image}
                    alt={t(dest.title.es, dest.title.en)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#0A2540] mb-2">
                    {t(dest.title.es, dest.title.en)}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {t(dest.location.es, dest.location.en)}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {t(dest.description.es, dest.description.en)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
