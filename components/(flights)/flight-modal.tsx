"use client";

import { useEffect, useState } from "react";
import { X, Plane, Clock, MapPin } from "lucide-react";
import { useLanguageStore } from "@/lib/store";
import { useFlightsStore } from "@/lib/flights-store";
import type { Flight, FlightClass } from "./flight-card";

interface FlightDetailsModalProps {
  flight: Flight;
  onClose: () => void;
}

export function FlightDetailsModal({ flight, onClose }: FlightDetailsModalProps) {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  const passengers = useFlightsStore((state) => state.passengers);
  
  const [classSelections, setClassSelections] = useState<(FlightClass | null)[]>(
    () => Array.from({ length: passengers }, () => null)
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    setClassSelections(Array.from({ length: passengers }, () => null));
  }, [passengers, flight.flightId]);

  const availableClasses = flight.classes.filter((c) => c.available);
  const selectedClasses = classSelections.filter(
    (cls): cls is FlightClass => cls !== null
  );
  const canConfirm = passengers > 0 && selectedClasses.length === passengers;
  const totalPrice = selectedClasses.reduce((acc, cls) => acc + cls.price, 0);

  const handleClassChange = (passengerIndex: number, classId: string) => {
    const selected = availableClasses.find((cls) => cls.classId === classId) ?? null;
    setClassSelections((prev) => {
      const next = [...prev];
      next[passengerIndex] = selected;
      return next;
    });
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    // Aquí puedes agregar la lógica para guardar la selección
    console.log("Flight confirmed:", flight, "Classes:", selectedClasses);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-400 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="pr-12">
            <h2 className="text-2xl font-bold mb-2">{flight.airline}</h2>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{flight.origin} → {flight.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{flight.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Flight Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 mb-1">{t("Salida", "Departure")}</p>
                <p className="text-2xl font-bold text-[#0A2540]">{flight.departureTime}</p>
                <p className="text-sm text-gray-500 mt-1">{flight.origin}</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-0.5 bg-gray-300"></div>
                  <Plane className="h-5 w-5 text-gray-400" />
                  <div className="w-16 h-0.5 bg-gray-300"></div>
                </div>
              </div>
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600 mb-1">{t("Llegada", "Arrival")}</p>
                <p className="text-2xl font-bold text-[#0A2540]">{flight.arrivalTime}</p>
                <p className="text-sm text-gray-500 mt-1">{flight.destination}</p>
              </div>
            </div>
          </div>

          {/* Class Selection for Each Passenger */}
          <div className="mb-6">
            <h3 className="font-bold text-[#0A2540] mb-4 text-lg">
              {t("Selecciona la clase para cada persona", "Select class for each person")}
            </h3>
            {passengers === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                {t("Configura el número de personas en la búsqueda antes de continuar.", "Configure the number of passengers in the search before continuing.")}
              </div>
            ) : availableClasses.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                {t("No hay clases disponibles en este momento.", "No classes available at this time.")}
              </div>
            ) : (
              <div className="space-y-4">
                {Array.from({ length: passengers }).map((_, index) => {
                  const selectedClass = classSelections[index];
                  return (
                    <div
                      key={`passenger-${index}`}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#0A2540]">
                            {t("Persona", "Person")} {index + 1}
                          </p>
                          <p className="text-sm text-gray-500">
                            {selectedClass
                              ? selectedClass.className
                              : t("Selecciona una clase", "Select a class")}
                          </p>
                        </div>
                        {selectedClass && (
                          <div className="text-right">
                            <p className="text-xl font-bold text-[#00C2A8]">
                              ${selectedClass.price.toLocaleString("es-CO")}
                            </p>
                            <p className="text-xs text-gray-500">
                              {t("por persona", "per person")}
                            </p>
                          </div>
                        )}
                      </div>
                      <select
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2A8]"
                        value={selectedClass?.classId ?? ""}
                        onChange={(event) => handleClassChange(index, event.target.value)}
                      >
                        <option value="">
                          {t("Selecciona una clase", "Select a class")}
                        </option>
                        {availableClasses.map((flightClass) => (
                          <option key={flightClass.classId} value={flightClass.classId}>
                            {flightClass.className} - $
                            {flightClass.price.toLocaleString("es-CO")}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total Price */}
          {totalPrice > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg text-[#0A2540]">
                  {t("Total", "Total")}
                </p>
                <p className="text-2xl font-bold text-[#00C2A8]">
                  ${totalPrice.toLocaleString("es-CO")}
                </p>
              </div>
              <p className="text-sm text-gray-500 text-right mt-1">
                {t("Para", "For")} {passengers} {t("persona(s)", "person(s)")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-[#0A2540] font-medium hover:bg-gray-50 transition-colors"
          >
            {t("Cancelar", "Cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 px-6 py-3 bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("Confirmar selección", "Confirm selection")}
          </button>
        </div>
      </div>
    </div>
  );
}

