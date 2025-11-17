import { Card, CardContent } from "@/components/(ui)/card";
import { Checkbox } from "@/components/(ui)/checkbox";

interface DetailsFilterProps {
  includesBreakfast: boolean;
  onChangeIncludesBreakfast: (value: boolean) => void;
  t: (es: string, en: string) => string;
}

export function DetailsFilter({
  includesBreakfast,
  onChangeIncludesBreakfast,
  t,
}: DetailsFilterProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-bold text-[#0A2540] mb-4">
          {t("Detalles", "Details")}
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="breakfast"
              checked={includesBreakfast}
              onCheckedChange={(checked) =>
                onChangeIncludesBreakfast(checked as boolean)
              }
            />
            <label
              htmlFor="breakfast"
              className="text-sm text-gray-700 cursor-pointer"
            >
              {t("Incluye desayuno", "Includes breakfast")}
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
