import { ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Habit } from "@/lib/types";

import { WeekDots } from "./week-dots";

export function HabitCard({ habit }: { habit: Habit }) {
  const done = habit.week.filter(Boolean).length;
  const lastDone = habit.week.lastIndexOf(true);
  const daysSince = lastDone === -1 ? null : habit.week.length - 1 - lastDone;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold tracking-tight">{habit.name}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{habit.why}</p>
        </div>
        <p className="shrink-0 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary">
          이번 주 {done}번
        </p>
      </div>

      <WeekDots week={habit.week} />

      <div className="rounded-lg bg-muted p-3">
        <p className="mb-2 text-[11px] font-semibold text-muted-foreground">습관 루프</p>
        <div className="flex items-center gap-1.5 text-[13px]">
          <LoopStep label="신호" text={habit.trigger} />
          <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
          <LoopStep label="행동" text={habit.name} />
          <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
          <LoopStep label="보상" text={habit.reward} />
        </div>
      </div>

      <p className="text-sm leading-relaxed">
        {daysSince === 0
          ? "오늘 했어요. 이 흐름 그대로 가면 됩니다."
          : daysSince !== null && daysSince <= 2
            ? `마지막으로 한 지 ${daysSince}일. 오늘 한 번이면 다시 이어집니다.`
            : "끊겼어도 괜찮아요. 다시 시작하는 것만 신경 쓰세요."}
      </p>
    </Card>
  );
}

function LoopStep({ label, text }: { label: string; text: string }) {
  return (
    <div className="min-w-0 flex-1 rounded-md bg-card px-2 py-1.5">
      <p className="text-[10px] font-semibold text-primary">{label}</p>
      <p className="line-clamp-2 leading-snug">{text}</p>
    </div>
  );
}
