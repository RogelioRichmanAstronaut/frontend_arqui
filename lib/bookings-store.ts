import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Hotel, RoomType } from "@/lib/types/packages";

export interface Booking {
    id: string;
    date: string; // ISO string of booking creation
    hotel: Hotel;
    rooms: RoomType[];
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: 'confirmed' | 'cancelled' | 'completed';
}

interface BookingsStore {
    bookings: Booking[];
    addBooking: (booking: Booking) => void;
    cancelBooking: (id: string) => void;
}

export const useBookingsStore = create<BookingsStore>()(
    persist(
        (set) => ({
            bookings: [],
            addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
            cancelBooking: (id) => set((state) => ({
                bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
            })),
        }),
        {
            name: 'bookings-storage',
        }
    )
);
