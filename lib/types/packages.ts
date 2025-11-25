export interface RoomType {
  habitacion_id: string;
  tipo: string;
  disponibilidad: string;
  codigo_tipo_habitacion: string;
  precio: number;
  servicios_habitacion: string[];
}

export interface Hotel {
  hotel_id: string;
  nombre: string;
  categoria_estrellas: number;
  ciudad: string;
  pais: string;
  direccion: string;
  servicios_hotel: string[];
  fotos: string[];
  habitaciones: RoomType[];
}

export interface Package {
  title: string;
  stars: number;
  includes: string;
  price: number;
  displayPrice: string;
  airline: string;
  hasBreakfast: boolean;
  hotel?: Hotel;
  imageUrl?: string; // Image URL for the package card
}
