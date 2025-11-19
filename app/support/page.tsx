"use client"

import { Card, CardContent } from "@/components/(ui)/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/(ui)/avatar"
import { useLanguageStore } from "@/lib/store"
import { BannerSection } from "@/components/banner-section"

interface TeamMember {
  name: string
  role: {
    es: string
    en: string
  }
  image: string
  initials: string
}

export default function SupportPage() {
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)

  const teamMembers: TeamMember[] = [
    {
      name: "Miembro 1",
      role: {
        es: "Director General",
        en: "General Director"
      },
      image: "/images/team/member1.jpg",
      initials: "M1"
    },
    {
      name: "Miembro 2",
      role: {
        es: "Gerente de Operaciones",
        en: "Operations Manager"
      },
      image: "/images/team/member2.jpg",
      initials: "M2"
    },
    {
      name: "Miembro 3",
      role: {
        es: "Especialista en Reservas",
        en: "Reservations Specialist"
      },
      image: "/images/team/member3.jpg",
      initials: "M3"
    },
    {
      name: "Miembro 4",
      role: {
        es: "Coordinador de Viajes",
        en: "Travel Coordinator"
      },
      image: "/images/team/member4.jpg",
      initials: "M4"
    },
    {
      name: "Miembro 5",
      role: {
        es: "Asesor de Clientes",
        en: "Customer Advisor"
      },
      image: "/images/team/member5.jpg",
      initials: "M5"
    },
    {
      name: "Miembro 6",
      role: {
        es: "Especialista en Marketing",
        en: "Marketing Specialist"
      },
      image: "/images/team/member6.jpg",
      initials: "M6"
    },
    {
      name: "Miembro 7",
      role: {
        es: "Soporte Técnico",
        en: "Technical Support"
      },
      image: "/images/team/member7.jpg",
      initials: "M7"
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection imageUrl="/images/banner/sup-banner.jpg">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("S O P O R T E", "S U P P O R T")}
        </h1>
      </BannerSection>

      <section className="container mx-auto px-4 lg:px-8 py-16">
        <Card className="mb-12">
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

        <div>
          <h2 className="text-2xl font-bold text-[#0A2540] mb-8 text-center">
            {t("Nuestro Equipo", "Our Team")}
          </h2>
          <div className="flex flex-col items-center gap-6">
            {/* Primera fila - 4 miembros */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl">
              {teamMembers.slice(0, 4).map((member, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#00C2A8]/20"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 relative">
                      <Avatar className="w-28 h-28 ring-4 ring-[#00C2A8]/10">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#00C2A8] to-teal-600 text-white text-2xl font-bold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-bold text-lg text-[#0A2540] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {t(member.role.es, member.role.en)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Segunda fila - 3 miembros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {teamMembers.slice(4, 7).map((member, index) => (
                <Card
                  key={index + 4}
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#00C2A8]/20"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="mb-4 relative">
                      <Avatar className="w-28 h-28 ring-4 ring-[#00C2A8]/10">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#00C2A8] to-teal-600 text-white text-2xl font-bold">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-bold text-lg text-[#0A2540] mb-2">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {t(member.role.es, member.role.en)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
