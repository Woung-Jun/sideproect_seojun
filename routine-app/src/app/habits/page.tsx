import { Plus } from "lucide-react";

import { HabitCard } from "@/components/habits/habit-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { HABITS } from "@/lib/mock-data";

export const metadata = { title: "습관 · 루틴" };

export default function HabitsPage() {
  return (
    <>
      <PageHeader
        eyebrow="숫자보다 이어 가는 게 먼저"
        title="습관"
        action={
          <Button size="sm" variant="secondary">
            <Plus /> 새 습관
          </Button>
        }
      />
      <div className="space-y-4">
        {HABITS.map((h) => (
          <HabitCard key={h.id} habit={h} />
        ))}
      </div>
    </>
  );
}
