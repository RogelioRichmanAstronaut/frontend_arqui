import { useMemo, useState } from "react";

interface RoomType {
  habitacion_id: string;
  tipo: string;
  disponibilidad: string;
  codigo_tipo_habitacion: string;
  precio: number;
  servicios_habitacion: string[];
}

interface Hotel {
  hotel_id: string;
  nombre: string;
  categoria_estrellas: number;
  ciudad: string;
  direccion: string;
  servicios_hotel: string[];
  fotos: string[];
  habitaciones: RoomType[];
}

interface Package {
  title: string;
  stars: number;
  includes: string;
  price: number;
  displayPrice: string;
  airline: string;
  hasBreakfast: boolean;
  hotel?: Hotel;
}

export function usePackagesFilters(allPackages: Package[]) {
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([100]);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [includesBreakfast, setIncludesBreakfast] = useState<boolean>(false);

  const maxPackagePrice = Math.max(...allPackages.map((pkg) => pkg.price));

  const filteredPackages = useMemo(() => {
    return allPackages.filter((pkg) => {
      const min = minPrice ? parseFloat(minPrice.replace(/\D/g, "")) : 0;
      if (min && pkg.price < min) return false;

      const max = maxPrice ? parseFloat(maxPrice.replace(/\D/g, "")) : Infinity;
      if (max && pkg.price > max) return false;

      const maxFromSlider = (priceRange[0] / 100) * maxPackagePrice;
      if (pkg.price > maxFromSlider) return false;

      if (selectedStars.length > 0 && !selectedStars.includes(pkg.stars)) {
        return false;
      }

      if (includesBreakfast && !pkg.hasBreakfast) {
        return false;
      }

      return true;
    });
  }, [
    minPrice,
    maxPrice,
    priceRange,
    selectedStars,
    includesBreakfast,
    allPackages,
    maxPackagePrice,
  ]);

  const handleStarToggle = (star: number) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMinPrice(value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setMaxPrice(value);
  };

  return {
    // state
    minPrice,
    maxPrice,
    priceRange,
    selectedStars,
    includesBreakfast,
    maxPackagePrice,
    filteredPackages,

    // setters y handlers
    setPriceRange,
    setIncludesBreakfast,
    handleStarToggle,
    handleMinPriceChange,
    handleMaxPriceChange,
  };
}
