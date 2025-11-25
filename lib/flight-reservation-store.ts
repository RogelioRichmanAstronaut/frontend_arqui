import { create } from "zustand";
import type { Flight, FlightClass } from "@/components/(flights)/flight-card";

interface FlightSearchDetails {
  origin: string;
  destination: string;
  departureDate: string | null;
  returnDate: string | null;
  passengers: number;
}

interface ReservationState {
  flight: Flight | null;
  selectedClasses: FlightClass[];
  searchDetails: FlightSearchDetails | null;
  setReservation: (payload: {
    flight: Flight;
    selectedClasses: FlightClass[];
    searchDetails: FlightSearchDetails;
  }) => void;
  updateSearchDetails: (updates: Partial<FlightSearchDetails>) => void;
  reset: () => void;
}

export const useFlightReservationStore = create<ReservationState>((set) => ({
  flight: null,
  selectedClasses: [],
  searchDetails: null,
  setReservation: ({ flight, selectedClasses, searchDetails }) =>
    set({
      flight,
      selectedClasses,
      searchDetails,
    }),
  updateSearchDetails: (updates) =>
    set((state) => ({
      searchDetails: state.searchDetails
        ? { ...state.searchDetails, ...updates }
        : null,
    })),
  reset: () =>
    set({
      flight: null,
      selectedClasses: [],
      searchDetails: null,
    }),
}));

