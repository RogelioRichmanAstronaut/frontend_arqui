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
    // ID real de la reserva del hotel (del backend)
    hotelReservationId?: string;
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
    // ID real de la reserva del vuelo (del backend)
    flightReservationId?: string;
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
    // Actualizar IDs de reservación reales del backend
    updateBookingReservationId: (hotelId: string, hotelReservationId: string) => void;
    updateFlightBookingReservationId: (flightId: string, flightReservationId: string) => void;
    // Limpiar todas las reservas locales (después del checkout exitoso)
    clearAllBookings: () => void;
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
            // Actualizar el hotelReservationId buscando por hotel_id
            updateBookingReservationId: (hotelId, hotelReservationId) => set((state) => ({
                bookings: state.bookings.map(b => 
                    b.hotel.hotel_id === hotelId 
                        ? { ...b, hotelReservationId } 
                        : b
                )
            })),
            // Actualizar el flightReservationId buscando por flightId
            updateFlightBookingReservationId: (flightId, flightReservationId) => set((state) => ({
                flightBookings: state.flightBookings.map(b => 
                    b.flight.flightId === flightId 
                        ? { ...b, flightReservationId } 
                        : b
                )
            })),
            // Limpiar todas las reservas locales (después del checkout exitoso)
            clearAllBookings: () => set({ bookings: [], flightBookings: [] }),
        }),
        {
            name: 'bookings-storage',
        }
    )
);
