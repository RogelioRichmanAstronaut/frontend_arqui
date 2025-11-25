"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { MapPin, Users, Search } from "lucide-react"
import { Button } from "@/components/(ui)/button"
import { Input } from "@/components/(ui)/input"
import { Card, CardContent } from "@/components/(ui)/card"
import { Alert, AlertDescription } from "@/components/(ui)/alert"
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
import { originCities } from "@/lib/origin-cities"

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
  const [validationError, setValidationError] = useState<string | null>(null)
  const [filteredOrigins, setFilteredOrigins] = useState<string[]>([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const originInputRef = useRef<HTMLDivElement>(null)

  const { data: apiFlights, isLoading, error } = useFlightSearch({
    origin: origin || 'BOG',
    destination: destination || 'MDE',
    departureDate: departureDate || new Date().toISOString().split('T')[0],
    returnDate: returnDate ?? undefined,
    passengers: passengers || 1,
    classType: classType as 'ECONOMY' | 'BUSINESS' | 'FIRST' || 'ECONOMY'
  }, shouldSearch)

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

  // Extract airport code from origin (format: "BOG - Bogotá" -> "BOG")
  const getAirportCode = (value: string): string => {
    if (!value) return ""
    const parts = value.split(" - ")
    return parts.length > 0 ? parts[0].trim() : value
  }

  // Validate that origin and destination are different
  const validateOriginDestination = () => {
    const originCode = getAirportCode(origin)
    const destinationCode = getAirportCode(destination)

    if (originCode && destinationCode && originCode === destinationCode) {
      setValidationError(
        t(
          "El origen y el destino no pueden ser el mismo",
          "Origin and destination cannot be the same"
        )
      )
      return false
    }

    setValidationError(null)
    return true
  }

  // Mock flights - solo se usan como fallback cuando no hay datos de la API y no se ha realizado búsqueda
  const mockFlights: Flight[] = [
    {
      flightId: "FL-001",
      airline: "LATAM Airlines",
      origin: getAirportCode(origin) || "BOG",
      destination: getAirportCode(destination) || "MDE",
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
      origin: getAirportCode(origin) || "BOG",
      destination: getAirportCode(destination) || "MDE",
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
      origin: getAirportCode(origin) || "BOG",
      destination: getAirportCode(destination) || "MDE",
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
      origin: getAirportCode(origin) || "BOG",
      destination: getAirportCode(destination) || "MDE",
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
      origin: getAirportCode(origin) || "BOG",
      destination: getAirportCode(destination) || "MDE",
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
      origin: getAirportCode(origin) || "BOG",
      destination: getAirportCode(destination) || "MDE",
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

  const handleOriginChange = (value: string) => {
    setOrigin(value)

    if (value.length > 0) {
      const term = value.toLowerCase()
      const filtered = originCities.filter((city) =>
        city.toLowerCase().includes(term)
      )
      setFilteredOrigins(filtered)
      setShowOriginSuggestions(true)
    } else {
      setShowOriginSuggestions(false)
    }

    // Validate after a short delay to allow selection
    setTimeout(() => {
      validateOriginDestination()
    }, 100)
  }

  const handleSelectOrigin = (city: string) => {
    // Store the full city name for display, but extract code for flight data
    setOrigin(city)
    setShowOriginSuggestions(false)
    // Validate after selection
    setTimeout(() => {
      validateOriginDestination()
    }, 100)
  }

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    // Validate after a short delay
    setTimeout(() => {
      validateOriginDestination()
    }, 100)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        originInputRef.current &&
        !originInputRef.current.contains(event.target as Node)
      ) {
        setShowOriginSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
              <div className="relative z-50" ref={originInputRef}>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input 
                  placeholder={t("Origen", "Origin")} 
                  className="pl-10 h-12"
                  value={origin}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  onFocus={() => {
                    if (origin) {
                      handleOriginChange(origin)
                    }
                  }}
                  onBlur={() => {
                    // Delay to allow click on suggestion
                    setTimeout(() => setShowOriginSuggestions(false), 200)
                  }}
                />
                {showOriginSuggestions && filteredOrigins.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                    <div className="py-2">
                      <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                        {t("Orígenes", "Origins")}
                      </div>
                      {filteredOrigins.map((city, index) => (
                        <div
                          key={`origin-${index}`}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 flex items-center gap-2"
                          onClick={() => handleSelectOrigin(city)}
                        >
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {city}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder={t("Destino", "Destination")} 
                  className="pl-10 h-12"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
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
            {validationError && (
              <div className="mt-4">
                <Alert variant="destructive">
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              </div>
            )}
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
