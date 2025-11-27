"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Search } from "lucide-react"
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
import { CitySelect } from "@/components/city-select"

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

  // Solo mostrar datos reales de la API
  const flightsToDisplay = apiFlights || []

  const handleFlightSelect = (flight: Flight, selectedClass?: FlightClass) => {
    setSelectedFlight(flight)
  }

  // Validar origen y destino
  const validateSearch = () => {
    if (!origin) {
      setValidationError(t("Selecciona una ciudad de origen", "Select an origin city"))
      return false
    }
    if (!destination) {
      setValidationError(t("Selecciona una ciudad de destino", "Select a destination city"))
      return false
    }
    // Extraer códigos para comparar
    const originCode = origin.split('-').pop()?.split(' ')[0] || origin
    const destCode = destination.split('-').pop()?.split(' ')[0] || destination
    if (originCode === destCode) {
      setValidationError(t("El origen y destino no pueden ser el mismo", "Origin and destination cannot be the same"))
      return false
    }
    setValidationError(null)
    return true
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BannerSection imageUrl="/images/banner/flight-banner.jpg">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white z-20 tracking-[0.3em]">
          {t("V U E L O S", "F L I G H T S")}
        </h1>
      </BannerSection>

      <section className="container mx-auto px-4 lg:px-8 -mt-8 relative z-30">
        {/* Banner informativo cuando hay hotel seleccionado */}
        {searchDetails?.destination && (
          <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🏨✈️</span>
              <div>
                <p className="text-green-800 font-medium">
                  {t("Hotel seleccionado - Solo falta el origen", "Hotel selected - Just pick your origin")}
                </p>
                <p className="text-green-600 text-sm">
                  {t("Los demás datos vienen de tu reserva de hotel", "Other data comes from your hotel booking")}
                </p>
              </div>
            </div>
            {/* Resumen de datos bloqueados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm bg-white/50 rounded-lg p-3">
              <div>
                <span className="text-gray-500">📍 {t("Destino:", "Destination:")}</span>
                <span className="ml-1 font-medium text-green-700">{destination}</span>
              </div>
              <div>
                <span className="text-gray-500">📅 {t("Llegada:", "Arrival:")}</span>
                <span className="ml-1 font-medium text-green-700">{departureDate || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">📅 {t("Regreso:", "Return:")}</span>
                <span className="ml-1 font-medium text-green-700">{returnDate || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">👥 {t("Pasajeros:", "Passengers:")}</span>
                <span className="ml-1 font-medium text-green-700">{passengers}</span>
              </div>
            </div>
          </div>
        )}
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            {/* Si hay hotel, solo mostrar selector de origen */}
            {searchDetails?.destination ? (
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("¿Desde dónde viajas?", "Where are you traveling from?")} *
                  </label>
                  <CitySelect
                    value={origin}
                    onChange={(value) => {
                      setOrigin(value)
                      setValidationError(null)
                    }}
                    placeholder={t("Selecciona tu ciudad de origen", "Select your origin city")}
                    className="z-50"
                  />
                </div>
                <Button 
                  className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white h-12 px-8"
                  onClick={() => {
                    if (!validateSearch()) return
                    setShouldSearch(true)
                  }}
                  disabled={isLoading || !origin}
                >
                  <Search className="h-5 w-5 mr-2" />
                  {isLoading ? t("Buscando...", "Searching...") : t("Buscar vuelos", "Search flights")}
                </Button>
              </div>
            ) : (
              /* Sin hotel: mostrar todos los campos */
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <CitySelect
                  value={origin}
                  onChange={(value) => {
                    setOrigin(value)
                    setValidationError(null)
                  }}
                  placeholder={t("¿De dónde sales?", "Where are you leaving from?")}
                  className="z-50"
                />
                <CitySelect
                  value={destination}
                  onChange={(value) => {
                    setDestination(value)
                    setValidationError(null)
                  }}
                  placeholder={t("¿A dónde vas?", "Where are you going?")}
                  className="z-40"
                />
                <div className="relative">
                  <DateRangePicker
                    isOpen={activePanel === "dates"}
                    onToggle={toggleDates}
                  />
                  {!departureDate && !returnDate && (
                    <span className="absolute -bottom-5 left-0 text-xs text-gray-400">
                      {t("(opcional)", "(optional)")}
                    </span>
                  )}
                </div>
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
                    if (!validateSearch()) return
                    setShouldSearch(true)
                  }}
                  disabled={isLoading}
                >
                  <Search className="h-5 w-5 mr-2" />
                  {isLoading ? t("Buscando...", "Searching...") : t("Buscar vuelos", "Search flights")}
                </Button>
              </div>
            )}
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
