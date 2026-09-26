import type { Intensity } from "./types";

/**
 * 대표 운동의 MET 값 (Compendium of Physical Activities 기준 근사치).
 * 강도별 값이 없는 운동은 medium 값을 기준으로 ±20%를 적용한다.
 */
const MET_TABLE: Record<string, Partial<Record<Intensity, number>>> = {
  걷기: { low: 2.8, medium: 3.5, high: 4.3 },
  달리기: { low: 7.0, medium: 9.8, high: 11.5 },
  자전거: { low: 4.0, medium: 6.8, high: 10.0 },
  수영: { low: 5.8, medium: 8.3, high: 9.8 },
  웨이트: { low: 3.5, medium: 5.0, high: 6.0 },
  요가: { low: 2.3, medium: 3.0, high: 4.0 },
  철봉: { medium: 4.0 },
  등산: { medium: 6.0 },
  필라테스: { medium: 3.0 },
};

const INTENSITY_FACTOR: Record<Intensity, number> = {
  low: 0.8,
  medium: 1,
  high: 1.2,
};

const DEFAULT_MET = 4.0;

export function metFor(type: string, intensity: Intensity): number {
  const row = MET_TABLE[type];
  if (!row) return DEFAULT_MET * INTENSITY_FACTOR[intensity];
  return row[intensity] ?? (row.medium ?? DEFAULT_MET) * INTENSITY_FACTOR[intensity];
}

/** kcal = MET × 체중(kg) × 시간(h) */
export function workoutKcal(
  type: string,
  minutes: number,
  intensity: Intensity,
  weightKg: number,
): number {
  return Math.round(metFor(type, intensity) * weightKg * (minutes / 60));
}
