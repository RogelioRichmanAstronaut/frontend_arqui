"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useLanguageStore } from "@/lib/store";
import { usePackageSearchStore } from "@/lib/package-search-store";

type DateRangePickerProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function DateRangePicker({ isOpen, onToggle }: DateRangePickerProps) {
  const { locale } = useLanguageStore();
  const t = (es: string, en: string) => (locale === "es" ? es : en);
  const checkIn = usePackageSearchStore((state) => state.checkIn);
  const checkOut = usePackageSearchStore((state) => state.checkOut);
  const setDates = usePackageSearchStore((state) => state.setDates);

  const monthNames =
    locale === "es"
      ? ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
      : ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const [currentMonth, setCurrentMonth] = useState<Date>(
    checkIn ? new Date(checkIn) : new Date()
  );
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    checkIn ? new Date(checkIn) : null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    checkOut ? new Date(checkOut) : null
  );

  useEffect(() => {
    setSelectedStartDate(checkIn ? new Date(checkIn) : null);
    setSelectedEndDate(checkOut ? new Date(checkOut) : null);
    if (checkIn) {
      setCurrentMonth(new Date(checkIn));
    }
  }, [checkIn, checkOut]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateClick = (day: number, monthOffset: number = 0) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + monthOffset;
    const clickedDate = new Date(year, month, day);

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      setDates(clickedDate.toISOString(), null);
    } else if (clickedDate > selectedStartDate) {
      setSelectedEndDate(clickedDate);
      setDates(selectedStartDate.toISOString(), clickedDate.toISOString());
      onToggle(); // cerrar cuando se elige rango
    } else {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      setDates(clickedDate.toISOString(), null);
    }
  };

  const isDateInRange = (day: number, monthOffset: number = 0): boolean => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + monthOffset;
    const date = new Date(year, month, day);
    return date > selectedStartDate && date < selectedEndDate;
  };

  const isDateSelected = (day: number, monthOffset: number = 0): string | false => {
    const year = currentMonth.getMonth() + monthOffset;
    const date = new Date(currentMonth.getFullYear(), year, day);
    if (selectedStartDate && date.toDateString() === selectedStartDate.toDateString()) return "start";
    if (selectedEndDate && date.toDateString() === selectedEndDate.toDateString()) return "end";
    return false;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const day = date.getDate();
    const month = monthNames[date.getMonth()].slice(0, 3).toLowerCase();
    return `${day} ${month}`;
  };

  const renderCalendar = (monthOffset: number = 0) => {
    const displayDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1
    );
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(displayDate);
    const days: JSX.Element[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${monthOffset}-${i}`} className="h-10" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isDateSelected(day, monthOffset);
      const inRange = isDateInRange(day, monthOffset);

      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + monthOffset;
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);
      const isPast = currentDate < today;

      days.push(
        <button
          key={`${monthOffset}-${day}`}
          onClick={() => !isPast && handleDateClick(day, monthOffset)}
          disabled={isPast}
          className={`h-10 w-10 flex items-center justify-center rounded-full text-sm
            ${
              selected === "start" || selected === "end"
                ? "bg-[#0071C2] text-white font-bold"
                : ""
            }
            ${inRange ? "bg-[#E6F2FF]" : ""}
            ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
            ${!selected && !inRange && !isPast ? "hover:bg-gray-100" : ""}
            transition-colors`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  return (
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
      <button
        onClick={onToggle}
        className="w-full h-12 pl-10 pr-3 border border-input rounded-md text-left bg-white hover:border-[#00C2A8] focus:outline-none focus:ring-2 focus:ring-[#00C2A8] focus:border-transparent text-sm whitespace-nowrap overflow-hidden text-ellipsis"
      >
        <span className="text-gray-700">
          {selectedStartDate && selectedEndDate
            ? `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)}`
            : t("Llegada/salida", "Check-in/Check-out")}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-2xl p-6 z-50 w-[700px]">
          <div className="flex gap-8">
            {/* mes 1 */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                  &lt;
                </button>
                <h3 className="font-bold text-lg">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="w-10" />
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-600 h-8 flex items-center justify-center"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">{renderCalendar(0)}</div>
            </div>

            {/* mes 2 */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <div className="w-10" />
                <h3 className="font-bold text-lg">
                  {monthNames[(currentMonth.getMonth() + 1) % 12]}{" "}
                  {currentMonth.getMonth() === 11
                    ? currentMonth.getFullYear() + 1
                    : currentMonth.getFullYear()}
                </h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-600 h-8 flex items-center justify-center"
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">{renderCalendar(1)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


