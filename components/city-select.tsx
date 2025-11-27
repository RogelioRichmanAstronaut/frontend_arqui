"use client";

import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { Input } from '@/components/(ui)/input';
import { useCities, groupCitiesByCountry, COUNTRY_NAMES } from '@/lib/hooks/useCities';
import type { City } from '@/lib/api/catalog';

interface CitySelectProps {
  value: string;
  onChange: (value: string, city?: City) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  showIataCode?: boolean;
  className?: string;
}

export function CitySelect({
  value,
  onChange,
  placeholder = "Seleccionar ciudad",
  label,
  disabled = false,
  showIataCode = true,
  className = "",
}: CitySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: cities, isLoading, error } = useCities();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper para obtener iataCode de forma segura
  const safeIataCode = (city: City) => city.iataCode || city.id.split('-')[1] || '';

  // Filtrar ciudades por búsqueda
  const filteredCities = cities?.filter(city => {
    const term = searchTerm.toLowerCase();
    const iata = safeIataCode(city).toLowerCase();
    return (
      city.name.toLowerCase().includes(term) ||
      iata.includes(term) ||
      city.id.toLowerCase().includes(term)
    );
  }) || [];

  // Agrupar por país
  const groupedCities = groupCitiesByCountry(filteredCities);

  // Encontrar ciudad actual
  const selectedCity = cities?.find(c => {
    const iata = safeIataCode(c);
    return (
      c.id === value || 
      iata === value || 
      c.name === value ||
      (value && iata && value.includes(iata))
    );
  });

  const handleSelect = (city: City) => {
    onChange(city.id, city);
    setSearchTerm('');
    setIsOpen(false);
  };

  const displayValue = selectedCity 
    ? (showIataCode ? `${safeIataCode(selectedCity)} - ${selectedCity.name}` : selectedCity.name)
    : value;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
        <Input
          placeholder={placeholder}
          className={`pl-10 pr-10 h-12 ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}`}
          value={isOpen ? searchTerm : displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          readOnly={disabled}
        />
        {!disabled && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            ) : (
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
              Cargando ciudades...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              Error al cargar ciudades
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No se encontraron ciudades
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedCities).map(([countryCode, countryCities]) => (
                <div key={countryCode}>
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0">
                    {COUNTRY_NAMES[countryCode] || countryCode}
                  </div>
                  {countryCities.map((city) => (
                    <div
                      key={city.id}
                      className={`px-4 py-2 hover:bg-[#00C2A8]/10 cursor-pointer text-sm flex items-center gap-2 ${
                        selectedCity?.id === city.id ? 'bg-[#00C2A8]/20 text-[#00C2A8]' : 'text-gray-700'
                      }`}
                      onClick={() => handleSelect(city)}
                    >
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="font-medium">{safeIataCode(city)}</span>
                      <span className="text-gray-500">-</span>
                      <span>{city.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

