import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { endOfDay, endOfMonth, endOfYear, startOfDay, startOfMonth, startOfYear } from "date-fns";

export const JAKARTA_TZ = "Asia/Jakarta";

export function nowInJakarta(date = new Date()) {
  return toZonedTime(date, JAKARTA_TZ);
}

export function startOfJakartaDay(date = new Date()) {
  const local = startOfDay(toZonedTime(date, JAKARTA_TZ));
  return fromZonedTime(local, JAKARTA_TZ);
}

export function startOfJakartaMonth(date = new Date()) {
  const local = startOfMonth(toZonedTime(date, JAKARTA_TZ));
  return fromZonedTime(local, JAKARTA_TZ);
}

export function startOfJakartaYear(date = new Date()) {
  const local = startOfYear(toZonedTime(date, JAKARTA_TZ));
  return fromZonedTime(local, JAKARTA_TZ);
}

export function endOfJakartaDay(date = new Date()) {
  const local = endOfDay(toZonedTime(date, JAKARTA_TZ));
  return fromZonedTime(local, JAKARTA_TZ);
}

export function endOfJakartaMonth(date = new Date()) {
  const local = endOfMonth(toZonedTime(date, JAKARTA_TZ));
  return fromZonedTime(local, JAKARTA_TZ);
}

export function endOfJakartaYear(date = new Date()) {
  const local = endOfYear(toZonedTime(date, JAKARTA_TZ));
  return fromZonedTime(local, JAKARTA_TZ);
}

export function parseJakartaDateRange(from?: string | null, to?: string | null) {
  const start = from ? startOfJakartaDay(new Date(`${from}T00:00:00`)) : undefined;
  const end = to ? endOfJakartaDay(new Date(`${to}T00:00:00`)) : undefined;
  return { start, end };
}
