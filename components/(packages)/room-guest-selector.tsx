
"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/(ui)/button";
import { useLanguageStore } from "@/lib/store";

type GuestsRoomsSelectorProps = {
    isOpen: boolean;
    onToggle: () => void;
};

const MAX_PER_ROOM = 6;
const MAX_ADULTS = 30;
const MAX_ROOMS = 6;

export function GuestsRoomsSelector({
    isOpen,
    onToggle,
}: GuestsRoomsSelectorProps) {
    const { locale } = useLanguageStore();
    const t = (es: string, en: string) => (locale === "es" ? es : en);

    const [adults, setAdults] = useState<number>(1);
    const [rooms, setRooms] = useState<number>(1);

const handleIncrement = (type: "adults" | "rooms"): void => {
    if (type === "adults") {
        if (adults >= MAX_ADULTS) return;
        const nextAdults = adults + 1;
        const minRoomsNeeded = Math.ceil(nextAdults / MAX_PER_ROOM);
        setAdults(nextAdults);
        if (rooms < minRoomsNeeded) {
            setRooms(minRoomsNeeded);
        }
    } else {
        if (rooms >= MAX_ROOMS) return;
        const nextRooms = rooms + 1;
        const neededAdults = Math.max(adults, nextRooms);
        if (neededAdults > MAX_ADULTS) return;
        setRooms(nextRooms);
        setAdults(neededAdults);
    }
};

const handleDecrement = (type: "adults" | "rooms"): void => {
    if (type === "adults") {
        if (adults <= rooms) return;
        const nextAdults = adults - 1;
        if (nextAdults < 1) return;
        setAdults(nextAdults);
    } else {
        if (rooms <= 1) return;
        const nextRooms = rooms - 1;
      if (adults > nextRooms * MAX_PER_ROOM) 
        return;
    }
};

const handleReset = () => {
    setAdults(1);
    setRooms(1);
};

return (
    <div className="relative md:col-span-2">
    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
    <button
        onClick={onToggle}
        className="w-full h-10 pl-10 pr-3 py-2 border border-input rounded-md text-left bg-white hover:border-[#00C2A8] focus:outline-none focus:ring-2 focus:ring-[#00C2A8] focus:border-transparent text-sm text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis"
    >
        {adults > 0
        ? `${adults} ${t(
            adults === 1 ? "huesped" : "huespedes",
            adults === 1 ? "guest" : "guests"
            )}, ${rooms} ${t(
                rooms === 1 ? "habitacion" : "habitaciones",
                rooms === 1 ? "room" : "rooms"
            )}`
        : t("Huespedes y habitaciones", "Guests and rooms")}
    </button>

    {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-50">
          {/* adultos */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="font-medium text-gray-700">
            {t("Adultos", "Adults")}
            </span>
            <div className="flex items-center gap-3">
            <button
                onClick={() => handleDecrement("adults")}
                disabled={adults <= 1}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                adults <= 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white"
                } transition-colors`}
            >
                −
            </button>
            <span className="w-8 text-center font-medium">{adults}</span>
            <button
                onClick={() => handleIncrement("adults")}
                disabled={adults >= MAX_ADULTS}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                adults >= MAX_ADULTS
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white"
                } transition-colors`}
            >
                +
            </button>
            </div>
        </div>

          {/* habitaciones */}
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <span className="font-medium text-gray-700">
            {t("Habitaciones", "Rooms")}
            </span>
            <div className="flex items-center gap-3">
            <button
                onClick={() => handleDecrement("rooms")}
                disabled={rooms <= 1}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                rooms <= 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white"
                } transition-colors`}
            >
                −
            </button>
            <span className="w-8 text-center font-medium">{rooms}</span>
            <button
                onClick={() => handleIncrement("rooms")}
                disabled={rooms >= MAX_ROOMS}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                rooms >= MAX_ROOMS
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-[#00C2A8] text-[#00C2A8] hover:bg-[#00C2A8] hover:text-white"
                } transition-colors`}
            >
                +
            </button>
            </div>
        </div>

          {/* acciones */}
        <div className="flex justify-between mt-4">
            <button
            onClick={handleReset}
            className="text-gray-400 hover:text-gray-600 text-sm font-medium"
            >
            {t("REINICIAR", "RESET")}
            </button>
            <button
            onClick={onToggle}
            className="bg-[#0A2540] hover:bg-[#0A2540]/90 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
            >
            {t("Aceptar", "Accept")}
            </button>
        </div>
        </div>
    )}
    </div>
);
}