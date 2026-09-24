import { mockProvider } from "./mock";
import type { AiProvider } from "./provider";

/**
 * 사용할 AI 공급자를 고른다. 실제 공급자(Claude 또는 Gemini)는
 * 결정 후 이 파일에 추가하고 AI_PROVIDER 환경변수로 선택한다.
 */
export function getAiProvider(): AiProvider {
  return mockProvider;
}
