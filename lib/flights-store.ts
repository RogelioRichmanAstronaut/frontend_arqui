import { create } from "zustand";

interface FlightsStore {
  origin: string;
  destination: string;
  departureDate: string | null;
  returnDate: string | null;
  passengers: number;
  classType: "economica" | "vip";
  setOrigin: (origin: string) => void;
  setDestination: (destination: string) => void;
  setDepartureDate: (date: string | null) => void;
  setReturnDate: (date: string | null) => void;
  setPassengers: (passengers: number) => void;
  setClassType: (classType: "economica" | "vip") => void;
  initializeFromReservation: (data: {
    destination: string;
    checkIn: string | null;
    checkOut: string | null;
    adults: number;
  }) => void;
  reset: () => void;
}

export const useFlightsStore = create<FlightsStore>((set) => ({
  origin: "",
  destination: "",
  departureDate: null,
  returnDate: null,
  passengers: 1,
  classType: "economica",
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setDepartureDate: (date) => set({ departureDate: date }),
  setReturnDate: (date) => set({ returnDate: date }),
  setPassengers: (passengers) => set({ passengers: Math.max(1, passengers) }),
  setClassType: (classType) => set({ classType }),
  initializeFromReservation: (data) =>
    set({
      destination: data.destination,
      departureDate: data.checkIn,
      returnDate: data.checkOut,
      passengers: data.adults,
    }),
  reset: () =>
    set({
      origin: "",
      destination: "",
      departureDate: null,
      returnDate: null,
      passengers: 1,
      classType: "economica",
    }),
}));

