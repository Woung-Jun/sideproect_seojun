import type {
  Expense,
  ExpenseCategory,
  Feedback,
  Intensity,
  Meal,
  ParsedEntry,
} from "../types";
import type { AiProvider } from "./provider";

/**
 * API 키 없이 화면을 확인하기 위한 목업 공급자.
 * 키워드와 정규식으로 흉내만 내며, 실제 공급자로 교체될 자리다.
 */

const FOODS: Record<string, Omit<Meal, "name" | "confidence">> = {
  제육덮밥: { kcal: 850, proteinG: 35, carbsG: 110, fatG: 28 },
  김치찌개: { kcal: 450, proteinG: 25, carbsG: 20, fatG: 25 },
  비빔밥: { kcal: 600, proteinG: 20, carbsG: 95, fatG: 15 },
  샐러드: { kcal: 250, proteinG: 15, carbsG: 15, fatG: 12 },
  라면: { kcal: 500, proteinG: 10, carbsG: 70, fatG: 18 },
  김밥: { kcal: 480, proteinG: 13, carbsG: 75, fatG: 12 },
  치킨: { kcal: 1200, proteinG: 80, carbsG: 50, fatG: 75 },
  닭가슴살: { kcal: 165, proteinG: 31, carbsG: 0, fatG: 4 },
  계란: { kcal: 150, proteinG: 12, carbsG: 1, fatG: 10 },
  아메리카노: { kcal: 10, proteinG: 0, carbsG: 2, fatG: 0 },
  라떼: { kcal: 190, proteinG: 9, carbsG: 15, fatG: 10 },
};

const WORKOUTS: Array<[RegExp, string]> = [
  [/헬스|웨이트|근력/, "웨이트"],
  [/러닝|(?<!매)달리기|뛰었|뛰고/, "달리기"],
  [/걷|산책/, "걷기"],
  [/자전거/, "자전거"],
  [/수영/, "수영"],
  [/요가/, "요가"],
  [/매달리기|철봉|턱걸이/, "철봉"],
];

const CATEGORY_RULES: Array<[RegExp, ExpenseCategory]> = [
  [/커피|카페|아메리카노|라떼/, "카페"],
  [/택시|버스|지하철|교통/, "교통"],
  [/점심|저녁|아침|밥|배달|식당/, "식비"],
  [/월세|통신|구독/, "고정비"],
  [/옷|쇼핑|쿠팡/, "쇼핑"],
];

function parseMeals(text: string): Meal[] {
  return Object.entries(FOODS)
    .filter(([name]) => text.includes(name))
    .map(([name, n]) => ({ name, ...n, confidence: "medium" as const }));
}

function parseWorkouts(text: string): ParsedEntry["workouts"] {
  const minutes = Number(text.match(/(\d+)\s*분/)?.[1] ?? 30);
  const intensity: Intensity = /빡세|힘들|고강도/.test(text)
    ? "high"
    : /가볍|살살/.test(text)
      ? "low"
      : "medium";
  return WORKOUTS.filter(([re]) => re.test(text)).map(([, type]) => ({
    type,
    minutes: type === "철봉" ? Math.min(minutes, 10) : minutes,
    intensity,
  }));
}

function parseExpenses(text: string): Expense[] {
  const out: Expense[] = [];
  for (const m of text.matchAll(/([가-힣A-Za-z ]{1,12}?)\s*([\d,]+)\s*원/g)) {
    const item = m[1].trim() || "지출";
    const amount = Number(m[2].replaceAll(",", ""));
    const category =
      CATEGORY_RULES.find(([re]) => re.test(item))?.[1] ?? "기타";
    out.push({ item, amount, category });
  }
  return out;
}

export const mockProvider: AiProvider = {
  name: "mock",

  async parse(text, habits) {
    const sleep = text.match(/(\d+(?:\.\d+)?)\s*시간\s*(?:잤|수면)/);
    const workouts = parseWorkouts(text);
    return {
      meals: parseMeals(text),
      workouts,
      expenses: parseExpenses(text),
      sleepHours: sleep ? Number(sleep[1]) : null,
      mood: /좋았|뿌듯|기분 좋/.test(text) ? 4 : /피곤|우울|짜증/.test(text) ? 2 : null,
      habitHits: habits
        .filter((h) =>
          /매달리기|철봉|턱걸이/.test(h.name)
            ? workouts.some((w) => w.type === "철봉")
            : /운동/.test(h.name) && workouts.length > 0,
        )
        .map((h) => h.id),
    };
  },

  async feedback({ entry, habits }) {
    const intake = entry.meals.reduce((s, m) => s + m.kcal, 0);
    const burned = entry.workouts.reduce((s, w) => s + w.kcal, 0);
    const spent = entry.expenses.reduce((s, e) => s + e.amount, 0);

    const feedback: Feedback[] = [];
    const hit = habits.find((h) => entry.habitHits.includes(h.id));
    if (hit) {
      feedback.push({
        expert: "brain",
        message: `${hit.name}, 했네요. 오늘 몇 개였는지보다 했다는 게 중요합니다. 같은 시간대에 반복하면 신호와 행동이 묶여서 점점 덜 힘들어져요. 잊지 말고 계속 오세요.`,
      });
    } else if (entry.workouts.length > 0) {
      feedback.push({
        expert: "trainer",
        message: "운동했네요. 그걸로 충분합니다. 다음에도 일단 가는 것만 챙기세요.",
      });
    }
    if (entry.sleepHours !== null && entry.sleepHours < 6) {
      feedback.push({
        expert: "brain",
        message:
          "잠이 짧았어요. 수면이 부족하면 전전두엽의 억제력이 떨어져 야식과 충동 소비가 늘기 쉽습니다. 오늘은 일찍 눕는 것만 챙기세요.",
      });
    }
    if (feedback.length === 0 && entry.meals.length > 0) {
      feedback.push({
        expert: "nutritionist",
        message: "기록한 것 자체가 시작입니다. 내일도 먹은 걸 한 줄만 남겨 주세요.",
      });
    }

    const parts = [
      intake > 0 && `약 ${intake.toLocaleString("ko-KR")} kcal 섭취`,
      burned > 0 && `약 ${burned.toLocaleString("ko-KR")} kcal 소모`,
      spent > 0 && `${spent.toLocaleString("ko-KR")}원 지출`,
    ].filter(Boolean);

    return {
      summary: parts.length ? `${parts.join(", ")}.` : "기록을 남겼어요.",
      feedback: feedback.slice(0, 2),
    };
  },
};
