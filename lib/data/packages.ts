import type { Package } from "@/lib/types/packages";

export const allPackages: Package[] = [
    {
        title: "Water City Dreams",
        stars: 4,
        includes: "Vuelo directo + Traslado + Desayuno",
        price: 1250000,
        displayPrice: "$1.250.000 COP",

        hasBreakfast: true,
        hotel: {
            hotel_id: "HOT-001",
            nombre: "Hotel Andes Plaza",
            categoria_estrellas: 4,
            ciudad: "Bogotá",
            pais: "Colombia",
            direccion: "Av. 15 #100-11",
            servicios_hotel: ["wifi", "desayuno incluido", "gimnasio", "restaurante"],
            fotos: [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/H%C3%B4tel_Negresco_03.jpg/960px-H%C3%B4tel_Negresco_03.jpg",
            ],
            habitaciones: [
                {
                    habitacion_id: "HAB-001",
                    tipo: "Doble Estándar",
                    disponibilidad: "DISPONIBLE",
                    codigo_tipo_habitacion: "DBL-STD",
                    precio: 320000,
                    servicios_habitacion: ["wifi", "tv", "aire acondicionado"],
                },
                {
                    habitacion_id: "HAB-002",
                    tipo: "Suite Ejecutiva",
                    disponibilidad: "DISPONIBLE",
                    codigo_tipo_habitacion: "STE-EJEC",
                    precio: 580000,
                    servicios_habitacion: ["wifi", "tv", "jacuzzi", "minibar"],
                },
            ],
        },
    },
    {
        title: "Mountain Paradise",
        stars: 3,
        includes: "Vuelo directo + Traslado",
        price: 850000,
        displayPrice: "$850.000 COP",

        hasBreakfast: false,
        hotel: {
            hotel_id: "HOT-003",
            nombre: "Hotel Mountain View",
            categoria_estrellas: 3,
            ciudad: "Medellín",
            pais: "Colombia",
            direccion: "Calle 50 #15-25",
            servicios_hotel: ["wifi", "restaurante", "terraza"],
            fotos: [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Hotel_K%C3%A4mp_by_Night_in_Winter_-_panoramio.jpg/1280px-Hotel_K%C3%A4mp_by_Night_in_Winter_-_panoramio.jpg",
            ],
            habitaciones: [
                {
                    habitacion_id: "HAB-003",
                    tipo: "Doble Estándar",
                    disponibilidad: "DISPONIBLE",
                    codigo_tipo_habitacion: "DBL-STD",
                    precio: 250000,
                    servicios_habitacion: ["wifi", "tv", "balcón"],
                },
            ],
        },
    },
    {
        title: "Luxury Beach Resort",
        stars: 5,
        includes: "Vuelo directo + Traslado + Desayuno + Cena",
        price: 2500000,
        displayPrice: "$2.500.000 COP",

        hasBreakfast: true,
        hotel: {
            hotel_id: "HOT-002",
            nombre: "Hotel Tequendama",
            categoria_estrellas: 5,
            ciudad: "Cartagena",
            pais: "Colombia",
            direccion: "Carrera 10 #26-21",
            servicios_hotel: ["wifi", "spa", "piscina", "restaurante gourmet"],
            fotos: [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/LasVegas_Casino_MGM_Grand.jpg/960px-LasVegas_Casino_MGM_Grand.jpg",
            ],
            habitaciones: [
                {
                    habitacion_id: "HAB-010",
                    tipo: "Suite Presidencial",
                    disponibilidad: "NO DISPONIBLE",
                    codigo_tipo_habitacion: "STE-PRES",
                    precio: 1200000,
                    servicios_habitacion: ["wifi", "tv", "jacuzzi", "vista panorámica"],
                },
                {
                    habitacion_id: "HAB-011",
                    tipo: "Suite Deluxe",
                    disponibilidad: "DISPONIBLE",
                    codigo_tipo_habitacion: "STE-DELUX",
                    precio: 850000,
                    servicios_habitacion: ["wifi", "tv", "jacuzzi", "minibar", "vista al mar"],
                },
            ],
        },
    },
    {
        title: "City Explorer",
        stars: 4,
        includes: "Vuelo directo + Traslado + Desayuno",
        price: 1100000,
        displayPrice: "$1.100.000 COP",

        hasBreakfast: true,
        hotel: {
            hotel_id: "HOT-004",
            nombre: "Hotel City Center",
            categoria_estrellas: 4,
            ciudad: "Cali",
            pais: "Colombia",
            direccion: "Av. Colombia #5-50",
            servicios_hotel: ["wifi", "gimnasio", "restaurante", "bar"],
            fotos: [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Hotel_Riosol_en_Gran_Canaria.jpg/2560px-Hotel_Riosol_en_Gran_Canaria.jpg",
            ],
            habitaciones: [
                {
                    habitacion_id: "HAB-004",
                    tipo: "Doble Deluxe",
                    disponibilidad: "DISPONIBLE",
                    codigo_tipo_habitacion: "DBL-DELUX",
                    precio: 400000,
                    servicios_habitacion: ["wifi", "tv", "minibar", "vista a la ciudad"],
                },
            ],
        },
    },
    {
        title: "Budget Adventure",
        stars: 2,
        includes: "Vuelo directo + Traslado",
        price: 650000,
        displayPrice: "$650.000 COP",

        hasBreakfast: false,
        hotel: {
            hotel_id: "HOT-005",
            nombre: "Hotel Budget Plus",
            categoria_estrellas: 2,
            ciudad: "Santa Marta",
            pais: "Colombia",
            direccion: "Calle 1 #2-10",
            servicios_hotel: ["wifi", "restaurante"],
            fotos: [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Icehotel-se-27.JPG/960px-Icehotel-se-27.JPG",
            ],
            habitaciones: [
                {
                    habitacion_id: "HAB-005",
                    tipo: "Habitación Doble",
                    disponibilidad: "DISPONIBLE",
                    codigo_tipo_habitacion: "DOBLE",
                    precio: 180000,
                    servicios_habitacion: ["wifi", "tv"],
                },
            ],
        },
    },
    {
        title: "Premium Experience",
        stars: 5,
        includes: "Vuelo directo + Traslado + Desayuno + Spa",
        price: 3200000,
        displayPrice: "$3.200.000 COP",

        hasBreakfast: true,
        hotel: {
            hotel_id: "HOT-006",
            nombre: "Hotel Spa Luxury",
            categoria_estrellas: 5,
            ciudad: "Santa Marta",
            pais: "Colombia",
            direccion: "Av. Costanera #100-1",
            servicios_hotel: [
                "wifi",
                "spa completo",
                "piscina infinity",
                "restaurante 5 estrellas",
                "playa privada",
            ],
            fotos: [
                "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/1a/ea/54/hotel-presidente-4s.jpg?w=900&h=500&s=1",
            ],
            habitaciones: [
                {
                    habitacion_id: "HAB-006",
                    tipo: "Villa Privada",
                    disponibilidad: "DISPONIBLE",
                    codigo_tipo_habitacion: "VILLA",
                    precio: 1500000,
                    servicios_habitacion: ["wifi", "jacuzzi privado", "piscina", "butler", "vista al océano"],
                },
            ],
        },
    },
];
