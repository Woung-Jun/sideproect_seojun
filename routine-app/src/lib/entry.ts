import { getAiProvider } from "./ai";
import { workoutKcal } from "./calories";
import type { EntryResult, Habit } from "./types";

export async function processEntry(
  text: string,
  habits: Habit[],
  weightKg: number,
): Promise<EntryResult> {
  const ai = getAiProvider();
  const parsed = await ai.parse(text, habits);
  const entry = {
    ...parsed,
    workouts: parsed.workouts.map((w) => ({
      ...w,
      kcal: workoutKcal(w.type, w.minutes, w.intensity, weightKg),
    })),
  };
  const { summary, feedback } = await ai.feedback({ entry, habits });
  return { ...entry, summary, feedback };
}
