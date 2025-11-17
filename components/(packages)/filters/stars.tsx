import { Card, CardContent } from "@/components/(ui)/card";
import { Checkbox } from "@/components/(ui)/checkbox";
import { Star } from "lucide-react";

interface StarsFilterProps {
  selectedStars: number[];
  onToggleStar: (star: number) => void;
  t: (es: string, en: string) => string;
}

export function StarsFilter({ selectedStars, onToggleStar, t }: StarsFilterProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold text-[#0A2540] mb-4">
          {t("Estrellas", "Stars")}
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <Checkbox
                id={`star-${star}`}
                checked={selectedStars.includes(star)}
                onCheckedChange={() => onToggleStar(star)}
              />
              <label
                htmlFor={`star-${star}`}
                className="text-sm text-gray-700 cursor-pointer flex items-center gap-1"
              >
                {star}
                <Star className="h-3 w-3 fill-[#00C2A8] text-[#00C2A8]" />
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
