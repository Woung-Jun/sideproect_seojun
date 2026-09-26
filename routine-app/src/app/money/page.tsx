import Link from "next/link";
import { connection } from "next/server";

import { WalletView } from "@/components/money/wallet-view";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PROFILE, RECENT_TRANSACTIONS, SPENDING } from "@/lib/mock-data";
import { cn, formatWon, seoulToday } from "@/lib/utils";

export const metadata = { title: "가계부 · 루틴" };

export default async function MoneyPage({ searchParams }: PageProps<"/money">) {
  await connection();
  const tab = (await searchParams).tab === "wallet" ? "wallet" : "spending";
  const categories = Object.entries(SPENDING).sort(([, a], [, b]) => b - a);
  const total = categories.reduce((s, [, v]) => s + v, 0);
  const budget = PROFILE.monthlyBudget;
  const { year, month, day } = seoulToday();
  const lastDay = new Date(year, month, 0).getDate();
  const daysLeft = lastDay - day + 1;
  const perDay = Math.max(0, Math.floor((budget - total) / daysLeft / 100) * 100);
  const max = categories[0][1];

  return (
    <>
      <PageHeader eyebrow={`${month}월`} title="가계부" />
      <nav className="mb-4 grid grid-cols-2 rounded-full bg-muted p-1 text-sm font-semibold" aria-label="가계부 보기">
        {[
          { key: "spending", label: "지출", href: "/money" },
          { key: "wallet", label: "지갑 정산", href: "/money?tab=wallet" },
        ].map((t) => (
          <Link
            key={t.key}
            href={t.href}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "rounded-full py-2 text-center text-muted-foreground transition-colors",
              tab === t.key && "bg-card text-foreground shadow-sm",
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      {tab === "wallet" ? (
        <WalletView />
      ) : (
        <div className="space-y-4">
          <Card className="bg-money-soft border-transparent">
            <p className="text-sm font-medium text-muted-foreground">이번 달 쓴 돈</p>
            <p className="mt-1 text-3xl font-bold tracking-tight">{formatWon(total)}</p>
            <Progress value={(total / budget) * 100} className="mt-4 bg-card" indicatorClassName="bg-money" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>예산 {formatWon(budget)}의 {Math.round((total / budget) * 100)}%</span>
              <span>남은 {daysLeft}일 · 하루 {formatWon(perDay)}</span>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>카테고리별</CardTitle>
            </CardHeader>
            <ul className="space-y-3">
              {categories.map(([name, amount]) => (
                <li key={name} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{name}</span>
                  <Progress value={(amount / max) * 100} indicatorClassName="bg-money" />
                  <span className="w-20 text-right font-semibold">{formatWon(amount)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-0">
            <CardHeader className="mb-0 px-5 pt-5 pb-2">
              <CardTitle>최근 내역</CardTitle>
            </CardHeader>
            <ul className="divide-y">
              {RECENT_TRANSACTIONS.map((t, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-semibold">{t.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.date} · {t.category}
                    </p>
                  </div>
                  <p className="text-sm font-semibold">−{formatWon(t.amount)}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </>
  );
}
