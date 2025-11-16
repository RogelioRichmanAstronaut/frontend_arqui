"use client"

import { Card, CardContent } from "@/components/(ui)/card"
import { useLanguageStore } from "@/lib/store"

export default function SupportPage() {
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)

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
          {t("S O P O R T E", "S U P P O R T")}
        </h1>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-16">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-4">
              {t("Estamos aquí para ayudarte", "We are here to help you")}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t(
                "Nuestro equipo de soporte está disponible para responder todas tus preguntas sobre reservas, paquetes y viajes.",
                "Our support team is available to answer all your questions about bookings, packages and trips."
              )}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
