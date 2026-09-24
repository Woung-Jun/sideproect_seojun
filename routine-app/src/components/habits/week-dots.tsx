import { cn } from "@/lib/utils";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export function WeekDots({ week }: { week: boolean[] }) {
  return (
    <ol className="flex gap-1.5" aria-label="최근 7일 실천 기록">
      {week.map((done, i) => (
        <li key={i} className="flex flex-col items-center gap-1">
          <span
            className={cn(
              "grid size-7 place-items-center rounded-full text-[11px] font-semibold",
              done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
            )}
            aria-label={`${DAYS[i]} ${done ? "함" : "안 함"}`}
          >
            {DAYS[i]}
          </span>
        </li>
      ))}
    </ol>
  );
}
