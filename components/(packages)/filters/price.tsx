import { Card, CardContent } from "@/components/(ui)/card";
import { Input } from "@/components/(ui)/input";
import { Slider } from "@/components/(ui)/slider";

interface PriceFilterProps {
  minPrice: string;
  maxPrice: string;
  priceRange: number[];
  maxPackagePrice: number;
  t: (es: string, en: string) => string;
  onMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRangeChange: (value: number[]) => void;
}

export function PriceFilter({
  minPrice,
  maxPrice,
  priceRange,
  maxPackagePrice,
  t,
  onMinChange,
  onMaxChange,
  onRangeChange,
}: PriceFilterProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold text-[#0A2540] mb-4">
          {t("Precio", "Price")}
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Min $"
              className="flex-1"
              value={minPrice}
              onChange={onMinChange}
              type="text"
            />
            <Input
              placeholder="Max $"
              className="flex-1"
              value={maxPrice}
              onChange={onMaxChange}
              type="text"
            />
          </div>
          <div className="space-y-2">
            <Slider
              value={priceRange}
              onValueChange={onRangeChange}
              max={100}
              step={1}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 text-center">
              {t("Hasta", "Up to")} $
              {Math.floor((priceRange[0] / 100) * maxPackagePrice).toLocaleString("es-CO")} COP
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
