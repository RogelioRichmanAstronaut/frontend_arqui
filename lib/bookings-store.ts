import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Hotel, RoomType } from "@/lib/types/packages";
import type { Flight, FlightClass } from "@/components/(flights)/flight-card";

export interface Booking {
    id: string;
    date: string; // ISO string of booking creation
    hotel: Hotel;
    rooms: RoomType[];
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface FlightBooking {
    id: string;
    date: string; // ISO string of booking creation
    flight: Flight;
    selectedClasses: FlightClass[];
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string | null;
    passengers: number;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

interface BookingsStore {
    bookings: Booking[];
    flightBookings: FlightBooking[];
    addBooking: (booking: Booking) => void;
    addFlightBooking: (booking: FlightBooking) => void;
    cancelBooking: (id: string) => void;
    cancelFlightBooking: (id: string) => void;
    removeBooking: (id: string) => void;
    removeFlightBooking: (id: string) => void;
}

export const useBookingsStore = create<BookingsStore>()(
    persist(
        (set) => ({
            bookings: [],
            flightBookings: [],
            addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),
            addFlightBooking: (booking) => set((state) => ({ flightBookings: [booking, ...state.flightBookings] })),
            cancelBooking: (id) => set((state) => ({
                bookings: state.bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
            })),
            cancelFlightBooking: (id) => set((state) => ({
                flightBookings: state.flightBookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
            })),
            removeBooking: (id) => set((state) => ({
                bookings: state.bookings.filter(b => b.id !== id)
            })),
            removeFlightBooking: (id) => set((state) => ({
                flightBookings: state.flightBookings.filter(b => b.id !== id)
            })),
        }),
        {
            name: 'bookings-storage',
        }
    )
);
