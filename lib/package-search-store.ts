import { create } from "zustand";

const MAX_ADULTS = 30;
const MAX_ROOMS = 5;

interface PackageSearchStore {
  destination: string;
  hotelFilter: string | null;
  adults: number;
  rooms: number;
  checkIn: string | null;
  checkOut: string | null;
  setDestination: (destination: string) => void;
  setHotelFilter: (hotelId: string | null) => void;
  setAdults: (adults: number) => void;
  setRooms: (rooms: number) => void;
  setDates: (checkIn: string | null, checkOut: string | null) => void;
  reset: () => void;
}

export const usePackageSearchStore = create<PackageSearchStore>((set) => ({
  destination: "",
  hotelFilter: null,
  adults: 1,
  rooms: 1,
  checkIn: null,
  checkOut: null,
  setDestination: (destination) => set({ destination }),
  setHotelFilter: (hotelFilter) => set({ hotelFilter }),
  setAdults: (adults) =>
    set((state) => {
      const safeAdults = Math.max(state.rooms, Math.min(MAX_ADULTS, Math.max(1, adults)));
      return { adults: safeAdults };
    }),
  setRooms: (rooms) =>
    set((state) => {
      const safeRooms = Math.max(1, Math.min(MAX_ROOMS, rooms));
      const safeAdults = Math.max(safeRooms, Math.min(MAX_ADULTS, state.adults));
      return { rooms: safeRooms, adults: safeAdults };
    }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  reset: () =>
    set({
      destination: "",
      hotelFilter: null,
      adults: 1,
      rooms: 1,
      checkIn: null,
      checkOut: null,
    }),
}));
