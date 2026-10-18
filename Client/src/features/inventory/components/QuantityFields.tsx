import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MeasurementUnit } from "@/lib/api/generated";
import { MEASUREMENT_UNITS, humanize } from "@/lib/enums";

export type UnitChoice = MeasurementUnit | "none";

export const toUnit = (choice: UnitChoice): MeasurementUnit | null => (choice === "none" ? null : choice);
export const toChoice = (unit: MeasurementUnit | null): UnitChoice => unit ?? "none";

export function parseAmount(text: string): number | null {
  const amount = Number(text);
  return text.trim() !== "" && Number.isFinite(amount) && amount > 0 ? amount : null;
}

type QuantityFieldsProps = {
  label: string;
  quantity: string;
  unit: UnitChoice;
  onQuantityChange: (quantity: string) => void;
  onUnitChange: (unit: UnitChoice) => void;
};

export function QuantityFields({ label, quantity, unit, onQuantityChange, onUnitChange }: QuantityFieldsProps) {
  return (
    <div className="flex gap-2">
      <Input
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        aria-label={`${label} amount`}
        value={quantity}
        onChange={event => onQuantityChange(event.target.value)}
        className="h-10 w-24"
      />
      <Select value={unit} onValueChange={value => onUnitChange(value as UnitChoice)}>
        <SelectTrigger aria-label={`${label} unit`} className="h-10 w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">No unit</SelectItem>
          {MEASUREMENT_UNITS.map(option => (
            <SelectItem key={option} value={option}>
              {humanize(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
