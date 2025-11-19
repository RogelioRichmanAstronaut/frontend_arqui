"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/(ui)/card";
import { Button } from "@/components/(ui)/button";
import { useLanguageStore } from "@/lib/store";

export interface FlightClass {
  classId: string;
  className: string;
  price: number;
  available: boolean;
}

export interface Flight {
  flightId: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: FlightClass[];
}

interface FlightCardProps {
  flight: Flight;
  index: number;
  onSelect?: (flight: Flight, selectedClass: FlightClass) => void;
}

export function FlightCard({ flight, index, onSelect }: FlightCardProps) {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const selectedClass = flight.classes.find((c) => c.classId === selectedClassId);
  const availableClasses = flight.classes.filter((c) => c.available);

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
  };

  const handleSelect = () => {
    if (selectedClass && onSelect) {
      onSelect(flight, selectedClass);
    }
  };

  return (
    <div
      className="h-full animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-2xl font-bold">{flight.airline}</p>
            <p className="text-sm opacity-90 mt-1">
              {flight.origin} → {flight.destination}
            </p>
          </div>
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-gray-600">{t("Salida", "Departure")}</p>
                <p className="text-lg font-semibold text-[#0A2540]">
                  {flight.departureTime}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">{flight.duration}</p>
                <div className="w-12 h-0.5 bg-gray-300 my-1"></div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{t("Llegada", "Arrival")}</p>
                <p className="text-lg font-semibold text-[#0A2540]">
                  {flight.arrivalTime}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <p className="text-sm font-medium text-[#0A2540]">
              {t("Selecciona tu clase", "Select your class")}
            </p>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00C2A8]"
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
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

          {selectedClass && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-[#0A2540]">
                    {selectedClass.className}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("Precio por persona", "Price per person")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#00C2A8]">
                    ${selectedClass.price.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSelect}
            disabled={!selectedClass}
            className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("Seleccionar vuelo", "Select flight")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

