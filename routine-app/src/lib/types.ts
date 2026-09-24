export type Confidence = "high" | "medium" | "low";
export type Intensity = "low" | "medium" | "high";

export type ExpenseCategory =
  | "식비"
  | "카페"
  | "교통"
  | "쇼핑"
  | "고정비"
  | "기타";

export type ExpertId = "nutritionist" | "trainer" | "finance" | "brain";

export interface Meal {
  name: string;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: Confidence;
}

export interface Workout {
  type: string;
  minutes: number;
  intensity: Intensity;
  /** 앱이 MET 표로 계산한 값. AI가 직접 계산하지 않는다. */
  kcal: number;
}

export interface Expense {
  item: string;
  amount: number;
  category: ExpenseCategory;
}

export interface Feedback {
  expert: ExpertId;
  message: string;
}

/** AI가 자연어에서 뽑아내는 값. 운동 소모 kcal은 포함하지 않는다. */
export interface ParsedEntry {
  meals: Meal[];
  workouts: Omit<Workout, "kcal">[];
  expenses: Expense[];
  sleepHours: number | null;
  mood: 1 | 2 | 3 | 4 | 5 | null;
  habitHits: string[];
}

export interface EntryResult extends Omit<ParsedEntry, "workouts"> {
  workouts: Workout[];
  summary: string;
  feedback: Feedback[];
}

export interface Habit {
  id: string;
  name: string;
  /** 사용자가 정한 이유나 방향. 숫자 목표는 선택 사항이다. */
  why: string;
  trigger: string;
  reward: string;
  timesPerWeek: number;
  /** 최근 7일, 오래된 날부터. */
  week: boolean[];
}
