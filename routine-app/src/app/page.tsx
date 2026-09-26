import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";

import { WeekDots } from "@/components/habits/week-dots";
import { PageHeader } from "@/components/page-header";
import { EntryComposer } from "@/components/today/entry-composer";
import { WeekEnergyChart } from "@/components/today/week-energy-chart";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { HABITS } from "@/lib/mock-data";

export default async function TodayPage() {
  await connection();
  const today = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "Asia/Seoul",
  }).format(new Date());

  return (
    <>
      <PageHeader eyebrow={today} title="오늘 하루, 어땠어요?" />
      <div className="space-y-5">
        <EntryComposer />

        <Card>
          <CardHeader>
            <CardTitle>이어 가는 중인 습관</CardTitle>
            <Link href="/habits" className="flex items-center text-xs font-medium text-muted-foreground">
              전체 <ChevronRight className="size-3.5" />
            </Link>
          </CardHeader>
          <ul className="space-y-4">
            {HABITS.slice(0, 2).map((h) => (
              <li key={h.id} className="space-y-2">
                <p className="text-sm font-semibold">{h.name}</p>
                <WeekDots week={h.week} />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>이번 주 에너지</CardTitle>
          </CardHeader>
          <WeekEnergyChart />
        </Card>
      </div>
    </>
  );
}
