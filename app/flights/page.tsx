"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Users, Search } from "lucide-react"
import { Button } from "@/components/(ui)/button"
import { Input } from "@/components/(ui)/input"
import { Card, CardContent } from "@/components/(ui)/card"
import { useLanguageStore } from "@/lib/store"
import { usePackageReservationStore } from "@/lib/package-reservation-store"
import { useFlightsStore } from "@/lib/flights-store"
import { usePackageSearchStore } from "@/lib/package-search-store"
import { DateRangePicker } from "@/components/(packages)/calendar"
import { FlightCard, type Flight, type FlightClass } from "@/components/(flights)/flight-card"
import { FlightDetailsModal } from "@/components/(flights)/flight-modal"
import { BannerSection } from "@/components/banner-section"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFlightSearch } from "@/lib/hooks/useFlights"
import { toast } from "sonner"

const queryClient = new QueryClient()

function FlightSearchContent() {
 
  const { locale } = useLanguageStore()
  const t = (es: string, en: string) => (locale === "es" ? es : en)
  
  const searchDetails = usePackageReservationStore((state) => state.searchDetails)
  const packageCheckIn = usePackageSearchStore((state) => state.checkIn)
  const packageCheckOut = usePackageSearchStore((state) => state.checkOut)
  const setPackageDates = usePackageSearchStore((state) => state.setDates)
  
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    passengers,
    classType,
    setOrigin,
    setDestination,
    setDepartureDate,
    setReturnDate,
    setPassengers,
    setClassType,
    initializeFromReservation,
  } = useFlightsStore()
  
  const [activePanel, setActivePanel] = useState<"dates" | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [shouldSearch, setShouldSearch] = useState(false)

  const { data: apiFlights, isLoading, error } = useFlightSearch({
    origin: origin || 'BOG',
    destination: destination || 'MDE',
    departureDate: departureDate || new Date().toISOString().split('T')[0],
    returnDate: returnDate ?? undefined,
    adults: passengers || 1,
    children: 0,
    infants: 0,
    classType: classType as 'ECONOMY' | 'BUSINESS' | 'FIRST' || 'ECONOMY'
  } as any, shouldSearch)

  // Inicializar datos desde la reserva si están disponibles
  useEffect(() => {
    if (searchDetails && !isInitialized) {
      initializeFromReservation({
        destination: searchDetails.destination || "",
        checkIn: searchDetails.checkIn,
        checkOut: searchDetails.checkOut,
        adults: searchDetails.adults,
      })
      // Sincronizar con el store del calendario
      if (searchDetails.checkIn && searchDetails.checkOut) {
        setPackageDates(searchDetails.checkIn, searchDetails.checkOut)
      }
      setIsInitialized(true)
    }
  }, [searchDetails, initializeFromReservation, isInitialized, setPackageDates])

  const toggleDates = () => {
    setActivePanel((prev) => (prev === "dates" ? null : "dates"))
  }

  // Sincronizar cambios del calendario con el store de vuelos
  useEffect(() => {
    if (packageCheckIn !== departureDate) {
      setDepartureDate(packageCheckIn)
    }
    if (packageCheckOut !== returnDate) {
      setReturnDate(packageCheckOut)
    }
  }, [packageCheckIn, packageCheckOut, departureDate, returnDate, setDepartureDate, setReturnDate])

  // Mock flights - solo se usan como fallback cuando no hay datos de la API y no se ha realizado búsqueda
  const mockFlights: Flight[] = [
    {
      flightId: "FL-001",
      airline: "LATAM Airlines",
      origin: origin || "BOG",
      destination: destination || "MDE",
      departureTime: "08:00",
      arrivalTime: "09:30",
      duration: "1h 30m",
      classes: [
        {
          classId: "ECON-001",
          className: t("Económica", "Economy"),
          price: 350000,
          available: true,
        },
        {
          classId: "VIP-001",
          className: "VIP",
          price: 850000,
          available: true,
        },
      ],
    },
    {
      flightId: "FL-002",
      airline: "Avianca",
      origin: origin || "BOG",
      destination: destination || "MDE",
      departureTime: "12:15",
      arrivalTime: "13:45",
      duration: "1h 30m",
      classes: [
        {
          classId: "ECON-002",
          className: t("Económica", "Economy"),
          price: 380000,
          available: true,
        },
        {
          classId: "VIP-002",
          className: "VIP",
          price: 920000,
          available: true,
        },
      ],
    },
    {
      flightId: "FL-003",
      airline: "Viva Air",
      origin: origin || "BOG",
      destination: destination || "MDE",
      departureTime: "16:30",
      arrivalTime: "18:00",
      duration: "1h 30m",
      classes: [
        {
          classId: "ECON-003",
          className: t("Económica", "Economy"),
          price: 320000,
          available: true,
        },
        {
          classId: "VIP-003",
          className: "VIP",
          price: 780000,
          available: true,
        },
      ],
    },
    {
      flightId: "FL-004",
      airline: "Copa Airlines",
      origin: origin || "BOG",
      destination: destination || "MDE",
      departureTime: "20:00",
      arrivalTime: "21:30",
      duration: "1h 30m",
      classes: [
        {
          classId: "ECON-004",
          className: t("Económica", "Economy"),
          price: 410000,
          available: true,
        },
        {
          classId: "VIP-004",
          className: "VIP",
          price: 950000,
          available: true,
        },
      ],
    },
    {
      flightId: "FL-005",
      airline: "LATAM Airlines",
      origin: origin || "BOG",
      destination: destination || "MDE",
      departureTime: "06:45",
      arrivalTime: "08:15",
      duration: "1h 30m",
      classes: [
        {
          classId: "ECON-005",
          className: t("Económica", "Economy"),
          price: 340000,
          available: true,
        },
        {
          classId: "VIP-005",
          className: "VIP",
          price: 820000,
          available: true,
        },
      ],
    },
    {
      flightId: "FL-006",
      airline: "Avianca",
      origin: origin || "BOG",
      destination: destination || "MDE",
      departureTime: "14:20",
      arrivalTime: "15:50",
      duration: "1h 30m",
      classes: [
        {
          classId: "ECON-006",
          className: t("Económica", "Economy"),
          price: 370000,
          available: true,
        },
        {
          classId: "VIP-006",
          className: "VIP",
          price: 890000,
          available: true,
        },
      ],
    },
  ]

  // Determinar qué vuelos mostrar: priorizar datos de API, usar mocks solo si no hay búsqueda activa
  const flightsToDisplay = (apiFlights && apiFlights.length > 0) 
    ? apiFlights 
    : (!shouldSearch ? mockFlights : [])

  const handleFlightSelect = (flight: Flight, selectedClass?: FlightClass) => {
    // Abrir el modal con los detalles del vuelo
    setSelectedFlight(flight)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection imageUrl="/images/banner/flight-banner.jpg">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("V U E L O S", "F L I G H T S")}
        </h1>
      </BannerSection>

      <section className="container mx-auto px-4 lg:px-8 -mt-8 relative z-30">
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder={t("Origen", "Origin")} 
                  className="pl-10 h-12"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder={t("Destino", "Destination")} 
                  className="pl-10 h-12"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
              <DateRangePicker
                isOpen={activePanel === "dates"}
                onToggle={toggleDates}
              />
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  placeholder={t("# Personas", "# Persons")}
                  className="pl-10 h-12"
                  min="1"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                />
              </div>
              <Button 
                className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white h-12"
                onClick={() => {
                  if (!origin || !destination) {
                    toast.error(t("Por favor completa origen y destino", "Please fill origin and destination"))
                    return
                  }
                  setShouldSearch(true)
                }}
                disabled={isLoading}
              >
                <Search className="h-5 w-5 mr-2" />
                {isLoading ? t("Buscando...", "Searching...") : t("Encuentra tu vuelo", "Find your flight")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 lg:px-8 py-12">
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C2A8] mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("Buscando vuelos disponibles...", "Searching available flights...")}</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{t("Error al buscar vuelos", "Error searching flights")}</p>
            <p className="text-sm text-gray-500 mt-2">{error.message}</p>
          </div>
        )}
        {!isLoading && !error && shouldSearch && flightsToDisplay.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">{t("No se encontraron vuelos", "No flights found")}</p>
            <p className="text-sm text-gray-500 mt-2">
              {t("Intenta con otros parámetros de búsqueda", "Try with different search parameters")}
            </p>
          </div>
        )}
        {!shouldSearch && flightsToDisplay.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {t("Ingresa origen, destino y fecha para buscar vuelos", "Enter origin, destination and date to search flights")}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flightsToDisplay.map((flight, index) => (
            <motion.div
              key={flight.flightId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <FlightCard
                flight={flight}
                index={index}
                onSelect={handleFlightSelect}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {selectedFlight && (
        <FlightDetailsModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
        />
      )}
    </div>
  )
}

export default function FlightsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <FlightSearchContent />
    </QueryClientProvider>
  )
}
