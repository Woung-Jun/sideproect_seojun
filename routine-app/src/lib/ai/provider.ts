import type { EntryResult, Feedback, Habit, ParsedEntry } from "../types";

export interface FeedbackInput {
  entry: Omit<EntryResult, "summary" | "feedback">;
  habits: Habit[];
}

export interface FeedbackOutput {
  summary: string;
  feedback: Feedback[];
}

/**
 * AI 공급자 공통 인터페이스. Claude, Gemini, 목업이 모두 이 모양을 따른다.
 * 공급자를 바꿔도 화면과 계산 로직은 그대로 둔다.
 */
export interface AiProvider {
  name: string;
  parse(text: string, habits: Habit[]): Promise<ParsedEntry>;
  feedback(input: FeedbackInput): Promise<FeedbackOutput>;
}
