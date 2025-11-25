import { create } from "zustand";
import type { Hotel, RoomType } from "@/lib/types/packages";

interface SearchDetails {
  destination: string;
  adults: number;
  rooms: number;
  checkIn: string | null;
  checkOut: string | null;
}

interface ReservationState {
  hotel: Hotel | null;
  rooms: RoomType[];
  searchDetails: SearchDetails | null;
  setReservation: (payload: {
    hotel: Hotel;
    rooms: RoomType[];
    searchDetails: SearchDetails;
  }) => void;
  updateSearchDetails: (updates: Partial<SearchDetails>) => void;
  reset: () => void;
}

export const usePackageReservationStore = create<ReservationState>((set) => ({
  hotel: null,
  rooms: [],
  searchDetails: null,
  setReservation: ({ hotel, rooms, searchDetails }) =>
    set({
      hotel,
      rooms,
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
      hotel: null,
      rooms: [],
      searchDetails: null,
    }),
}));

