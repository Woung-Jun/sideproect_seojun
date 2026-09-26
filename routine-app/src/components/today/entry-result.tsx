import { BedDouble, Dumbbell, Languages, Utensils, Wallet } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EXPERT_META } from "@/lib/experts";
import type { Confidence, EntryResult } from "@/lib/types";
import { cn, formatKcal, formatWon } from "@/lib/utils";

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  high: "정확",
  medium: "추정",
  low: "대략",
};

export function EntryResultView({ result }: { result: EntryResult }) {
  const intake = result.meals.reduce((s, m) => s + m.kcal, 0);
  const burned = result.workouts.reduce((s, w) => s + w.kcal, 0);
  const spent = result.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="섭취" value={intake ? `약 ${intake.toLocaleString("ko-KR")}` : "–"} unit="kcal" tone="text-food" />
        <Stat label="소모" value={burned ? `약 ${burned.toLocaleString("ko-KR")}` : "–"} unit="kcal" tone="text-workout" />
        <Stat label="지출" value={spent ? spent.toLocaleString("ko-KR") : "–"} unit="원" tone="text-money" />
      </div>

      {result.feedback.map((f, i) => {
        const meta = EXPERT_META[f.expert];
        const Icon = meta.icon;
        return (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2">
              <span className={cn("grid size-7 place-items-center rounded-full", meta.tone)}>
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-semibold">{meta.label}</span>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed">{f.message}</p>
          </Card>
        );
      })}

      <Card className="divide-y p-0">
        {result.meals.map((m) => (
          <Row key={m.name} icon={<Utensils />} tone="bg-food-soft text-food" title={m.name}
            sub={`단백질 ${m.proteinG}g · 탄수 ${m.carbsG}g · 지방 ${m.fatG}g`}
            value={`약 ${formatKcal(m.kcal)}`} badge={CONFIDENCE_LABEL[m.confidence]} />
        ))}
        {result.workouts.map((w) => (
          <Row key={w.type} icon={<Dumbbell />} tone="bg-workout-soft text-workout" title={w.type}
            sub={`${w.minutes}분`} value={`약 ${formatKcal(w.kcal)} 소모`} />
        ))}
        {result.expenses.map((e, i) => (
          <Row key={i} icon={<Wallet />} tone="bg-money-soft text-money" title={e.item}
            sub={e.category} value={formatWon(e.amount)} />
        ))}
        {result.learning && (
          <Row icon={<Languages />} tone="bg-sleep-soft text-sleep" title={result.learning.tool}
            sub="외국어 학습" value={result.learning.minutes ? `${result.learning.minutes}분` : "완료"} />
        )}
        {result.sleepHours !== null && (
          <Row icon={<BedDouble />} tone="bg-sleep-soft text-sleep" title="수면"
            sub="기록에서 추출" value={`${result.sleepHours}시간`} />
        )}
      </Card>
      <p className="px-1 text-xs text-muted-foreground">
        {result.summary} 숫자가 다르면 눌러서 고칠 수 있게 될 예정이에요.
      </p>
    </div>
  );
}

function Stat({ label, value, unit, tone }: { label: string; value: string; unit: string; tone: string }) {
  return (
    <div className="rounded-xl border bg-card px-3 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-lg font-bold tracking-tight", tone)}>{value}</p>
      <p className="text-[11px] text-muted-foreground">{unit}</p>
    </div>
  );
}

function Row({ icon, tone, title, sub, value, badge }: {
  icon: ReactNode; tone: string; title: string; sub: string; value: string; badge?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg [&_svg]:size-4", tone)}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          {title}
          {badge && <Badge className="px-1.5 py-0 text-[10px]">{badge}</Badge>}
        </p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      <p className="text-sm font-semibold whitespace-nowrap">{value}</p>
    </div>
  );
}
