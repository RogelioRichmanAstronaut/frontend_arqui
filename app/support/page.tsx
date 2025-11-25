"use client"

import { useState, useEffect } from "react"
import { useLanguageStore } from "@/lib/store"
import { BannerSection } from "@/components/banner-section"
import Image from "next/image"
import { Linkedin, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface TeamMember {
  name: string
  role: {
    es: string
    en: string
  }
  image: string
  linkedin: string
}

export default function SupportPage() {
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)
  const [currentIndex, setCurrentIndex] = useState(3) // Empezar en el medio
  const [isPaused, setIsPaused] = useState(false)

  const teamMembers: TeamMember[] = [
    {
      name: "Andrés",
      role: {
        es: "Gerente de Operaciones",
        en: "Operations Manager"
      },
      image: "/images/avatar/andres.png",
      linkedin: "https://linkedin.com/in/member1"
    },
    {
      name: "Daniel",
      role: {
        es: "Gerente de Operaciones",
        en: "Operations Manager"
      },
      image: "/images/avatar/Dani.png",
      linkedin: "https://linkedin.com/in/member2"
    },
    {
      name: "Martin",
      role: {
        es: "Especialista en Reservas",
        en: "Reservations Specialist"
      },
      image: "/images/avatar/martin.png",
      linkedin: "https://linkedin.com/in/member3"
    },
    {
      name: "Sebastián",
      role: {
        es: "Coordinador de Viajes",
        en: "Travel Coordinator"
      },
      image: "/images/avatar/Sebas.png",
      linkedin: "https://linkedin.com/in/member4"
    },
    {
      name: "Miguel",
      role: {
        es: "Asesor de Clientes",
        en: "Customer Advisor"
      },
      image: "/images/avatar/miguel.png",
      linkedin: "https://linkedin.com/in/member5"
    },
    {
      name: "Eliana",
      role: {
        es: "Especialista en Marketing",
        en: "Marketing Specialist"
      },
      image: "/images/avatar/eli.png",
      linkedin: "https://linkedin.com/in/member6"
    },
    {
      name: "David",
      role: {
        es: "Soporte Técnico",
        en: "Technical Support"
      },
      image: "/images/avatar/david.png",
      linkedin: "https://linkedin.com/in/member7"
    },
  ]

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % teamMembers.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused, teamMembers.length])

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection imageUrl="/images/banner/sup-banner.jpg">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("S O P O R T E", "S U P P O R T")}
        </h1>
      </BannerSection>

      <section className="container mx-auto px-4 lg:px-8 py-16">

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#0A2540] mb-8 text-center">
            {t("Nuestro Equipo", "Our Team")}
          </h2>

          {/* Carrusel de tarjetas superpuestas - Desktop */}
          <div className="hidden md:flex w-full justify-center bg-[#f6f8fb] py-10">
            <div
              className="relative max-w-5xl w-full px-6 mx-auto h-[600px] flex items-center justify-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >

              {/* Botón izquierda */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg hover:scale-105 transition"
                aria-label={t("Anterior", "Previous")}
              >
                <ChevronLeft className="w-6 h-6 text-[#0A2540]" />
              </button>

              {/* Botón derecha */}
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % teamMembers.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full bg-[#00b894] text-white shadow-md flex items-center justify-center hover:shadow-lg hover:scale-105 transition"
                aria-label={t("Siguiente", "Next")}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              <div className="relative w-full h-full flex items-center justify-center">
                {teamMembers.map((member, index) => {
                  // Lógica circular para el offset
                  let offset = index - currentIndex
                  const length = teamMembers.length

                  // Ajustar offset para el camino más corto
                  if (offset > length / 2) offset -= length
                  if (offset < -length / 2) offset += length

                  const absOffset = Math.abs(offset)

                  // Solo mostrar tarjetas cercanas (hasta 2 a cada lado para este diseño)
                  if (absOffset > 2) return null

                  const isCenter = offset === 0

                  // Estilos dinámicos basados en la posición
                  let positionClass = "z-0 opacity-0 scale-75"
                  let transformStyle = {}

                  if (isCenter) {
                    positionClass = "z-20 opacity-100 scale-100 cursor-default"
                    transformStyle = { transform: 'translateX(0) rotate(0deg)' }
                  } else if (offset === -1) {
                    // Izquierda inmediata
                    positionClass = "z-10 opacity-60 blur-[0.5px] scale-90 cursor-pointer"
                    transformStyle = { transform: 'translateX(-70%) rotate(-6deg)' }
                  } else if (offset === 1) {
                    // Derecha inmediata
                    positionClass = "z-10 opacity-60 blur-[0.5px] scale-90 cursor-pointer"
                    transformStyle = { transform: 'translateX(70%) rotate(6deg)' }
                  } else if (offset === -2) {
                    // Izquierda lejana
                    positionClass = "z-0 opacity-0 scale-75"
                    transformStyle = { transform: 'translateX(-120%)' }
                  } else if (offset === 2) {
                    // Derecha lejana
                    positionClass = "z-0 opacity-0 scale-75"
                    transformStyle = { transform: 'translateX(120%)' }
                  }

                  return (
                    <div
                      key={index}
                      className={`absolute transition-all duration-500 ease-out ${positionClass}`}
                      style={transformStyle}
                      onClick={() => !isCenter && setCurrentIndex(index)}
                    >
                      <div className="relative h-[450px] w-[320px] rounded-3xl shadow-xl bg-white overflow-hidden">
                        {/* imagen */}
                        <div className="h-[70%] bg-gradient-to-br from-[#e6fff8] to-white flex items-end justify-center">
                          <div className="relative h-[95%] w-full flex justify-center">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="h-full w-auto object-cover rounded-t-2xl shadow-sm"
                            />
                          </div>
                        </div>

                        {/* info */}
                        <div className="h-[30%] px-6 py-4 bg-white flex flex-col justify-center">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="text-2xl font-bold text-[#00b894]">
                                {member.name}
                              </h3>
                              <p className="text-sm text-slate-500 font-medium">
                                {t(member.role.es, member.role.en)}
                              </p>
                            </div>

                            <Link
                              href={member.linkedin}
                              target="_blank"
                              className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors shrink-0"
                            >
                              <Linkedin className="h-4 w-4 text-[#0077b5]" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Versión móvil - Carrusel Simplificado */}
          <div
            className="md:hidden relative px-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-[300px] mx-auto">
              <div className="h-[280px] bg-gradient-to-br from-[#e6fff8] to-white flex items-end justify-center pt-4">
                <img
                  src={teamMembers[currentIndex].image}
                  alt={teamMembers[currentIndex].name}
                  className="h-[95%] w-auto object-cover rounded-t-2xl shadow-sm"
                />
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-[#00b894]">{teamMembers[currentIndex].name}</h3>
                    <p className="text-sm text-slate-500 font-medium">{t(teamMembers[currentIndex].role.es, teamMembers[currentIndex].role.en)}</p>
                  </div>
                  <Link
                    href={teamMembers[currentIndex].linkedin}
                    target="_blank"
                    className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center shadow-sm shrink-0"
                  >
                    <Linkedin className="h-4 w-4 text-[#0077b5]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Botones de navegación móvil */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button
                onClick={() => setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length)}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-[#0A2540]" />
              </button>

              <span className="text-sm font-medium text-gray-500">
                {currentIndex + 1} / {teamMembers.length}
              </span>

              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % teamMembers.length)}
                className="w-10 h-10 rounded-full bg-[#00b894] shadow-md flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
