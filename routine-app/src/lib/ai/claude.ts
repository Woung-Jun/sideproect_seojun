import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import type { ParsedEntry } from "../types";
import { EXPERTS, FEEDBACK_PRINCIPLES } from "./prompts";
import type { AiProvider } from "./provider";

/** 파싱은 빠르고 저렴한 모델, 피드백은 더 깊이 있는 모델 (PRD 결정 사항). */
const PARSE_MODEL = "claude-haiku-4-5";
const FEEDBACK_MODEL = "claude-sonnet-5";

const ParsedSchema = z.object({
  meals: z.array(
    z.object({
      name: z.string(),
      kcal: z.number(),
      proteinG: z.number(),
      carbsG: z.number(),
      fatG: z.number(),
      confidence: z.enum(["high", "medium", "low"]),
    }),
  ),
  workouts: z.array(
    z.object({
      type: z.string(),
      minutes: z.number(),
      intensity: z.enum(["low", "medium", "high"]),
    }),
  ),
  expenses: z.array(
    z.object({
      item: z.string(),
      amount: z.number(),
      category: z.enum(["식비", "카페", "교통", "쇼핑", "고정비", "기타"]),
    }),
  ),
  sleepHours: z.number().nullable(),
  mood: z.number().int().nullable(),
  learning: z.object({ tool: z.string(), minutes: z.number().nullable() }).nullable(),
  habitHits: z.array(z.string()),
});

const FeedbackSchema = z.object({
  summary: z.string(),
  feedback: z.array(
    z.object({
      expert: z.enum(["nutritionist", "trainer", "finance", "brain", "mental", "english"]),
      message: z.string(),
    }),
  ),
});

const PARSE_SYSTEM = `너는 한국어 생활 기록을 구조화된 데이터로 바꾸는 파서다.
- meals: 먹은 음식마다 한국 1인분 기준으로 kcal와 단백질·탄수화물·지방(g)을 추정한다. 양이 모호하면 1인분으로 보고 confidence를 low로 둔다. 음료도 포함한다.
- workouts: 운동 종류(걷기, 달리기, 자전거, 수영, 웨이트, 요가, 철봉, 등산, 필라테스 중 가까운 것, 없으면 그대로), 시간(분), 강도. 시간이 없으면 30분으로 둔다. 소모 kcal은 계산하지 않는다.
- expenses: 원 단위 금액이 나온 지출만. 금액을 지어내지 않는다.
- sleepHours: 잔 시간이 나오면 숫자로, 없으면 null.
- mood: 기분이 드러나면 1(매우 나쁨)~5(매우 좋음), 없으면 null.
- learning: 듀오링고나 영어 공부 등 외국어 학습 기록. 없으면 null.
- habitHits: 주어진 습관 목록 중 오늘 실천한 것의 id만.
기록에 없는 내용은 만들지 않는다.`;

const FEEDBACK_SYSTEM = `너는 사용자의 하루 기록을 보고 피드백하는 코치 팀이다. 코치는 다음과 같다.
${Object.entries(EXPERTS)
  .map(([id, desc]) => `- ${id}: ${desc}`)
  .join("\n")}

원칙:
${FEEDBACK_PRINCIPLES}

출력:
- summary: 오늘을 한 문장으로. 숫자에는 "약"을 붙인다.
- feedback: 오늘 가장 관련 있는 코치 1~2명만. 각 메시지는 2~3문장, 한국어, 직설적으로.
- 영어 문장이 있으면 english 코치가 짧게 교정한다.`;

let client: Anthropic | null = null;
function getClient() {
  client ??= new Anthropic();
  return client;
}

export const claudeProvider: AiProvider = {
  name: "claude",

  async parse(text, habits) {
    const response = await getClient().messages.parse({
      model: PARSE_MODEL,
      max_tokens: 2000,
      system: PARSE_SYSTEM,
      messages: [
        {
          role: "user",
          content: `습관 목록: ${JSON.stringify(habits.map((h) => ({ id: h.id, name: h.name })))}\n\n오늘의 기록:\n${text}`,
        },
      ],
      output_config: { format: zodOutputFormat(ParsedSchema) },
    });
    const out = response.parsed_output;
    if (!out) throw new Error(`parse failed: stop_reason=${response.stop_reason}`);
    const habitIds = new Set(habits.map((h) => h.id));
    return {
      ...out,
      mood: out.mood === null ? null : (Math.min(5, Math.max(1, out.mood)) as ParsedEntry["mood"]),
      habitHits: out.habitHits.filter((id) => habitIds.has(id)),
    };
  },

  async feedback({ text, entry, habits }) {
    const response = await getClient().messages.parse({
      model: FEEDBACK_MODEL,
      max_tokens: 4000,
      system: FEEDBACK_SYSTEM,
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            원문: text,
            분석: entry,
            습관: habits.map(({ id, name, why, week }) => ({ id, name, why, 최근7일: week })),
          }),
        },
      ],
      output_config: { effort: "medium", format: zodOutputFormat(FeedbackSchema) },
    });
    const out = response.parsed_output;
    if (!out) throw new Error(`feedback failed: stop_reason=${response.stop_reason}`);
    return { summary: out.summary, feedback: out.feedback.slice(0, 2) };
  },
};
