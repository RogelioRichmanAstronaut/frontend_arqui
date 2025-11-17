import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/(ui)/card';

interface PackageCardProps {
  title: string;
  stars: number;
  includes: string;
  displayPrice: string;
  airline: string;
  onSelect: () => void;
  index: number;
}

export function PackageCard({
  title,
  stars,
  includes,
  displayPrice,
  airline,
  onSelect,
  index,
}: PackageCardProps) {
  return (
    <div
      className="h-full animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <Card
        onClick={onSelect}
        className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col cursor-pointer"
      >
        <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
        <CardContent className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-1 mb-2 h-5">
            {Array.from({ length: stars }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-[#00C2A8] text-[#00C2A8]"
              />
            ))}
          </div>
          <h3 className="text-lg font-bold text-[#0A2540] mb-3 min-h-[28px]">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex-grow min-h-[40px]">
            {includes}
          </p>
          <div className="mb-4 space-y-1">
            <p className="text-2xl font-bold text-[#0A2540]">
              Desde {displayPrice}
            </p>
            <p className="text-sm text-gray-600">/ persona</p>
            <p className="text-sm text-gray-600">{airline}</p>
          </div>
          <button className="w-full bg-[#00C2A8] hover:bg-[#00C2A8]/90 text-white font-semibold py-2 px-4 rounded transition-colors">
            Ver Detalles
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
