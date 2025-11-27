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
    status: 'confirmed' | 'cancelled' | 'completed';
    refundRequested?: boolean;
    refundReason?: string;
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
    status: 'confirmed' | 'cancelled' | 'completed';
    refundRequested?: boolean;
    refundReason?: string;
}

interface BookingsStore {
    bookings: Booking[];
    flightBookings: FlightBooking[];
    addBooking: (booking: Booking) => void;
    addFlightBooking: (booking: FlightBooking) => void;
    cancelBooking: (id: string) => void;
    cancelFlightBooking: (id: string) => void;
    requestRefund: (id: string, reason?: string) => void;
    requestFlightRefund: (id: string, reason?: string) => void;
}

// Mock bookings for testing
const mockBookings: Booking[] = [
    {
        id: 'booking-demo-confirmed',
        date: new Date().toISOString(),
        hotel: {
            hotel_id: 'HOT-001',
            nombre: 'Hotel Tequendama',
            categoria_estrellas: 5,
            ciudad: 'Cartagena',
            pais: 'Colombia',
            direccion: 'Carrera 10 #26-21',
            servicios_hotel: ['wifi', 'spa', 'piscina', 'restaurante gourmet'],
            fotos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/LasVegas_Casino_MGM_Grand.jpg/960px-LasVegas_Casino_MGM_Grand.jpg'],
            habitaciones: [{
                habitacion_id: 'HAB-001',
                tipo: 'Suite Deluxe',
                disponibilidad: 'DISPONIBLE',
                codigo_tipo_habitacion: 'STE-DELUX',
                precio: 850000,
                servicios_habitacion: ['wifi', 'tv', 'jacuzzi', 'minibar', 'vista al mar']
            }]
        },
        rooms: [{
            habitacion_id: 'HAB-001',
            tipo: 'Suite Deluxe',
            disponibilidad: 'DISPONIBLE',
            codigo_tipo_habitacion: 'STE-DELUX',
            precio: 850000,
            servicios_habitacion: ['wifi', 'tv', 'jacuzzi', 'minibar', 'vista al mar']
        }],
        checkIn: '2025-12-15',
        checkOut: '2025-12-20',
        totalPrice: 4250000,
        status: 'confirmed'
    }
];

export const useBookingsStore = create<BookingsStore>()(
    persist(
        (set, get) => ({
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
            requestRefund: (id, reason) => set((state) => ({
                bookings: state.bookings.map(b =>
                    b.id === id ? { ...b, refundRequested: true, refundReason: reason } : b
                )
            })),
            requestFlightRefund: (id, reason) => set((state) => ({
                flightBookings: state.flightBookings.map(b =>
                    b.id === id ? { ...b, refundRequested: true, refundReason: reason } : b
                )
            })),
        }),
        {
            name: 'bookings-storage',
            onRehydrateStorage: () => (state) => {
                // Después de cargar del localStorage, asegurar que el booking demo esté presente
                if (state) {
                    const hasDemoBooking = state.bookings.some(b => b.id === 'booking-demo-confirmed');
                    if (!hasDemoBooking) {
                        state.bookings = [...mockBookings, ...state.bookings];
                    }
                }
            },
        }
    )
);
