import { claudeProvider } from "./claude";
import { mockProvider } from "./mock";
import type { AiProvider } from "./provider";

/** ANTHROPIC_API_KEY가 설정돼 있으면 Claude, 없으면 목업을 쓴다. */
export function getAiProvider(): AiProvider {
  return process.env.ANTHROPIC_API_KEY ? claudeProvider : mockProvider;
}
