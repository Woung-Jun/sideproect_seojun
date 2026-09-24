import { Brain, Dumbbell, PiggyBank, Salad, type LucideIcon } from "lucide-react";

import type { ExpertId } from "./types";

export const EXPERT_META: Record<
  ExpertId,
  { label: string; icon: LucideIcon; tone: string }
> = {
  nutritionist: { label: "영양사", icon: Salad, tone: "bg-food-soft text-food" },
  trainer: { label: "트레이너", icon: Dumbbell, tone: "bg-workout-soft text-workout" },
  finance: { label: "재무 코치", icon: PiggyBank, tone: "bg-money-soft text-money" },
  brain: { label: "뇌과학 코치", icon: Brain, tone: "bg-brain-soft text-brain" },
};
