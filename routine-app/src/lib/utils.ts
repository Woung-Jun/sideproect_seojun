import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const won = new Intl.NumberFormat("ko-KR");

export function formatWon(amount: number) {
  return `${won.format(amount)}원`;
}

export function formatKcal(kcal: number) {
  return `${won.format(Math.round(kcal))} kcal`;
}

/** 서버가 UTC로 돌아도 한국 날짜 기준으로 계산한다. */
export function seoulToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}
