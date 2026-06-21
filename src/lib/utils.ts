import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(date));
}

export function heightToCm(cm: number) {
  const hands = cm / 10.16;
  return `${hands.toFixed(1)} hh (${cm} cm)`;
}

export function categoryLabel(category: string) {
  const map: Record<string, string> = {
    FUTURE_STARS: "Future Stars",
    COMPETITION_READY: "Competition Ready",
    ELITE_SPORT: "Elite Sport",
    BREEDING_INVESTMENT: "Breeding & Investment",
  };
  return map[category] ?? category;
}

export function categoryClass(category: string) {
  const map: Record<string, string> = {
    FUTURE_STARS: "category-future-stars",
    COMPETITION_READY: "category-competition-ready",
    ELITE_SPORT: "category-elite-sport",
    BREEDING_INVESTMENT: "category-breeding",
  };
  return map[category] ?? "";
}

export function timeUntil(end: Date | string) {
  const diff = new Date(end).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}
