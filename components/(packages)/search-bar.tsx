"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Input } from "@/components/(ui)/input";
import { Button } from "@/components/(ui)/button";
import { Card, CardContent } from "@/components/(ui)/card";
import { useLanguageStore } from "@/lib/store";
import { usePackageSearchStore } from "@/lib/package-search-store";
import { DateRangePicker } from "./calendar";
import { GuestsRoomsSelector } from "./room-guest-selector";

export function PackagesSearchBar() {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);

  const [activePanel, setActivePanel] = useState<"dates" | "guests" | null>(null);
  const destination = usePackageSearchStore((state) => state.destination);
  const setDestination = usePackageSearchStore((state) => state.setDestination);

  const toggleDates = () => {
    setActivePanel((prev) => (prev === "dates" ? null : "dates"));
  };

  const toggleGuests = () => {
    setActivePanel((prev) => (prev === "guests" ? null : "guests"));
  };

  return (
    <Card className="shadow-2xl">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* destino */}
          <div className="relative md:col-span-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder={t("Destino", "Destination")}
              className="pl-10"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </div>

          {/* fechas */}
          <DateRangePicker
            isOpen={activePanel === "dates"}
            onToggle={toggleDates}
          />

          {/* huespedes y habitaciones */}
          <GuestsRoomsSelector
            isOpen={activePanel === "guests"}
            onToggle={toggleGuests}
          />

          {/* boton buscar */}
          <Button className="bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white">
            <Search className="h-5 w-5 mr-2" />
            {t("Encuentra tu paquete", "Find your package")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
