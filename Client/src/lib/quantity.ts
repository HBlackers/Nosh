import type { MeasurementUnit } from "@/lib/api/generated";

const SYMBOLS: Partial<Record<MeasurementUnit, string>> = {
  Gram: "g",
  Millilitre: "ml",
  Tablespoon: "tbsp",
  Teaspoon: "tsp",
};

const COUNT_NAMES: Partial<Record<MeasurementUnit, [string, string]>> = {
  Tin: ["tin", "tins"],
  Clove: ["clove", "cloves"],
  Slice: ["slice", "slices"],
  Thumb: ["thumb", "thumbs"],
  Handful: ["handful", "handfuls"],
  Rasher: ["rasher", "rashers"],
  Ball: ["ball", "balls"],
};

// The API sends decimals as numbers or strings.
export const toNumber = (value: number | string) => Number(value);

export const roundAmount = (value: number) => Math.round(value * 100) / 100;

export function formatQuantity(amount: number | string, unit: MeasurementUnit | null | undefined): string {
  const value = roundAmount(toNumber(amount));
  if (!unit) {
    return String(value);
  }
  const symbol = SYMBOLS[unit];
  if (symbol) {
    return `${value} ${symbol}`;
  }
  const [one, many] = COUNT_NAMES[unit] ?? [unit.toLowerCase(), unit.toLowerCase()];
  return `${value} ${value === 1 ? one : many}`;
}
