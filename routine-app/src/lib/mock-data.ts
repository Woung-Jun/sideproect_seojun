import type { ExpenseCategory, Habit } from "./types";

/** DB 연결 전까지 화면을 채우는 예시 데이터. */

export const PROFILE = {
  weightKg: 70,
  targetKcal: 2200,
  monthlyBudget: 600000,
};

export const HABITS: Habit[] = [
  {
    id: "hang",
    name: "철봉 매달리기",
    why: "연말까지 턱걸이 1회",
    trigger: "퇴근하고 헬스장 도착하면",
    reward: "끝나고 좋아하는 음악 한 곡",
    timesPerWeek: 3,
    week: [true, false, true, false, false, true, false],
  },
  {
    id: "workout",
    name: "저녁 운동",
    why: "몸이 가벼워지는 느낌",
    trigger: "저녁 7시 알람이 울리면",
    reward: "운동 후 샤워하고 넷플릭스",
    timesPerWeek: 3,
    week: [true, true, false, true, false, false, false],
  },
  {
    id: "sleep",
    name: "12시 전에 눕기",
    why: "다음 날 덜 피곤하게",
    trigger: "11시 30분에 휴대폰을 충전기에 꽂으면",
    reward: "침대에서 책 10쪽",
    timesPerWeek: 5,
    week: [false, true, true, false, true, false, false],
  },
];

export const SPENDING: Record<ExpenseCategory, number> = {
  식비: 214000,
  카페: 58500,
  교통: 42000,
  쇼핑: 67000,
  고정비: 95000,
  기타: 12000,
};

export const RECENT_TRANSACTIONS = [
  { date: "9월 24일", item: "아이스 아메리카노", amount: 4500, category: "카페" as const },
  { date: "9월 24일", item: "점심 제육덮밥", amount: 9500, category: "식비" as const },
  { date: "9월 23일", item: "지하철", amount: 1550, category: "교통" as const },
  { date: "9월 23일", item: "배달 치킨", amount: 23000, category: "식비" as const },
  { date: "9월 22일", item: "운동복", amount: 39000, category: "쇼핑" as const },
];

/** 최근 7일 섭취·소모 kcal (월~일). */
export const WEEK_ENERGY = [
  { day: "월", intake: 2100, burned: 320 },
  { day: "화", intake: 2450, burned: 0 },
  { day: "수", intake: 1980, burned: 280 },
  { day: "목", intake: 2300, burned: 0 },
  { day: "금", intake: 2650, burned: 0 },
  { day: "토", intake: 2050, burned: 410 },
  { day: "일", intake: 1900, burned: 300 },
];
