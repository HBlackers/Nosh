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

const SPOKEN_UNITS: Record<MeasurementUnit, [string, string]> = {
  Gram: ["gram", "grams"],
  Millilitre: ["millilitre", "millilitres"],
  Tablespoon: ["tablespoon", "tablespoons"],
  Teaspoon: ["teaspoon", "teaspoons"],
  Tin: ["tin", "tins"],
  Clove: ["clove", "cloves"],
  Slice: ["slice", "slices"],
  Thumb: ["thumb", "thumbs"],
  Handful: ["handful", "handfuls"],
  Rasher: ["rasher", "rashers"],
  Ball: ["ball", "balls"],
};

// Written out in full, as "200 g" would be read as "200 gee".
export function spokenQuantity(amount: number | string, unit: MeasurementUnit | null | undefined): string {
  const value = roundAmount(toNumber(amount));
  if (!unit) {
    return String(value);
  }
  const [one, many] = SPOKEN_UNITS[unit];
  return `${value} ${value === 1 ? one : many}`;
}
