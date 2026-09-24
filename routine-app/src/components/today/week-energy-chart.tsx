"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { WEEK_ENERGY } from "@/lib/mock-data";

/** 최근 7일 섭취·소모 kcal. 색은 globals.css 토큰(검증된 food/workout)을 그대로 쓴다. */
export function WeekEnergyChart() {
  return (
    <div>
      <div className="mb-3 flex gap-4 text-xs text-muted-foreground">
        <Legend color="var(--food)" label="섭취" />
        <Legend color="var(--workout)" label="운동 소모" />
      </div>
      <div className="h-44" role="img" aria-label="최근 7일 섭취와 운동 소모 칼로리 막대 그래프">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WEEK_ENERGY} barGap={2} barCategoryGap="22%" margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={36}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(value, name) => [`약 ${Number(value).toLocaleString("ko-KR")} kcal`, name]}
            />
            <Bar dataKey="intake" name="섭취" fill="var(--food)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="burned" name="운동 소모" fill="var(--workout)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="size-2.5 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}
