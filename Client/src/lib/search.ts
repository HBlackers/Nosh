export function parseText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

export function parsePage(value: unknown): number | undefined {
  return typeof value === "number" && Number.isInteger(value) && value > 1 ? value : undefined;
}

export function parseList<T extends string>(value: unknown, allowed: readonly T[]): T[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = allowed.filter(option => value.includes(option));
  return items.length > 0 ? items : undefined;
}

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

export function parseWeek(value: unknown): string | undefined {
  return typeof value === "string" && isoDate.test(value) ? value : undefined;
}
