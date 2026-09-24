"use client";

import { ArrowDownToLine, Coins, Landmark, Receipt, Trash2, type LucideIcon } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Field, Sheet } from "@/components/ui/sheet";
import { cn, formatWon, seoulToday } from "@/lib/utils";
import { summarizeWallet, type WalletEvent, type WalletEventKind } from "@/lib/wallet";
import {
  getWalletServerSnapshot,
  getWalletSnapshot,
  saveWallet,
  subscribeWallet,
} from "@/lib/wallet-store";

const KIND_META: Record<
  WalletEventKind,
  { label: string; action: string; icon: LucideIcon; defaultAccount?: string; tone: string }
> = {
  withdraw: { label: "인출", action: "계좌에서 인출", icon: ArrowDownToLine, defaultAccount: "A계좌", tone: "bg-primary-soft text-primary" },
  deposit: { label: "입금", action: "계좌에 입금", icon: Landmark, defaultAccount: "B계좌", tone: "bg-workout-soft text-workout" },
  spend: { label: "현금 지출", action: "현금 지출", icon: Receipt, tone: "bg-food-soft text-food" },
  opening: { label: "기초 잔액", action: "기초 잔액", icon: Coins, tone: "bg-money-soft text-money" },
};

function todayIso() {
  const { year, month, day } = seoulToday();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}월 ${d}일`;
}

export function WalletView() {
  const events = useSyncExternalStore(subscribeWallet, getWalletSnapshot, getWalletServerSnapshot);
  const [formKind, setFormKind] = useState<WalletEventKind | null>(null);
  const s = summarizeWallet(events);
  const moveRatio = s.withdrawn > 0 ? (s.deposited / s.withdrawn) * 100 : 0;

  function add(e: Omit<WalletEvent, "id">) {
    const next = e.kind === "opening" ? events.filter((x) => x.kind !== "opening") : events;
    saveWallet([...next, { ...e, id: crypto.randomUUID() }]);
    setFormKind(null);
    toast.success(`${KIND_META[e.kind].label} ${formatWon(e.amount)} 기록했어요.`);
  }

  function remove(id: string) {
    if (!window.confirm("이 기록을 지울까요?")) return;
    saveWallet(events.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-4">
      <Card className="border-transparent bg-money-soft">
        <p className="text-sm font-medium text-muted-foreground">지금 지갑에 있어야 할 돈</p>
        <p className="mt-1 text-3xl font-bold tracking-tight" data-testid="wallet-balance">
          {s.hasOpening ? formatWon(s.balance) : "—"}
        </p>
        {s.hasOpening ? (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            기초 {formatWon(s.timeline.find((r) => r.kind === "opening")?.amount ?? 0)} + 인출 {formatWon(s.withdrawn)} − 입금{" "}
            {formatWon(s.deposited)} − 현금 지출 {formatWon(s.spent)}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            시작할 때 지갑에 있던 돈부터 입력해 주세요.
          </p>
        )}
      </Card>

      <div className="grid grid-cols-4 gap-2">
        {(["withdraw", "deposit", "spend", "opening"] as const).map((kind) => {
          const meta = KIND_META[kind];
          const Icon = meta.icon;
          const highlight = kind === "opening" && !s.hasOpening;
          return (
            <button
              key={kind}
              onClick={() => setFormKind(kind)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border bg-card px-1 py-3 text-xs font-semibold transition-transform active:scale-95",
                highlight && "ring-2 ring-primary",
              )}
            >
              <span className={cn("grid size-9 place-items-center rounded-full", meta.tone)}>
                <Icon className="size-4" />
              </span>
              {meta.label}
            </button>
          );
        })}
      </div>

      {s.withdrawn > 0 && (
        <Card>
          <CardHeader className="mb-3">
            <CardTitle>계좌 이동 현황</CardTitle>
            <span className="text-xs font-semibold text-muted-foreground">{Math.round(moveRatio)}%</span>
          </CardHeader>
          <Progress value={moveRatio} indicatorClassName="bg-workout" />
          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Metric label="인출" value={formatWon(s.withdrawn)} />
            <Metric label="입금" value={formatWon(s.deposited)} />
            <Metric
              label={s.notYetMoved >= 0 ? "아직 옮길 돈" : "더 입금함"}
              value={formatWon(Math.abs(s.notYetMoved))}
              strong
            />
          </dl>
        </Card>
      )}

      {s.timeline.length > 0 && (
        <Card className="p-0">
          <CardHeader className="mb-0 px-5 pt-5 pb-2">
            <CardTitle>내역</CardTitle>
            <span className="text-xs text-muted-foreground">최신순</span>
          </CardHeader>
          <ul className="divide-y">
            {s.timeline.map((r) => {
              const meta = KIND_META[r.kind];
              const Icon = meta.icon;
              return (
                <li key={r.id} className="flex items-center gap-3 px-5 py-3">
                  <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", meta.tone)}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {r.kind === "withdraw" ? `${r.account} 인출` : r.kind === "deposit" ? `${r.account} 입금` : r.kind === "spend" ? (r.memo || "현금 지출") : "기초 잔액"}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(r.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {r.kind === "opening" ? formatWon(r.amount) : `${r.delta > 0 ? "+" : "−"}${formatWon(r.amount)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">잔액 {formatWon(r.balance)}</p>
                  </div>
                  <button onClick={() => remove(r.id)} aria-label="기록 삭제" className="-mr-2 rounded-full p-2 text-muted-foreground hover:bg-muted">
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <p className="px-1 text-xs text-muted-foreground">
        시안 단계라 기록은 이 기기의 브라우저에만 저장돼요. DB를 연결하면 옮겨집니다.
      </p>

      <Sheet open={formKind !== null} onOpenChange={(o) => !o && setFormKind(null)} title={formKind ? KIND_META[formKind].action : ""}>
        {formKind && <WalletForm key={formKind} kind={formKind} onSubmit={add} />}
      </Sheet>
    </div>
  );
}

function Metric({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="text-[11px] text-muted-foreground">{label}</dt>
      <dd className={cn("mt-0.5 text-[13px] font-semibold", strong && "text-foreground")}>{value}</dd>
    </div>
  );
}

function WalletForm({ kind, onSubmit }: { kind: WalletEventKind; onSubmit: (e: Omit<WalletEvent, "id">) => void }) {
  const meta = KIND_META[kind];
  const [date, setDate] = useState(todayIso);
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(meta.defaultAccount ?? "");
  const [memo, setMemo] = useState("");
  const value = Number(amount.replace(/[^\d]/g, ""));

  return (
    <form
      className="space-y-3"
      onSubmit={(ev) => {
        ev.preventDefault();
        if (!value) return;
        onSubmit({
          kind,
          date,
          amount: value,
          ...(meta.defaultAccount && { account: account.trim() || meta.defaultAccount }),
          ...(kind === "spend" && memo.trim() && { memo: memo.trim() }),
        });
      }}
    >
      <Field label="날짜" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <Field
        label={kind === "opening" ? "그날 지갑에 있던 돈 (원)" : "금액 (원)"}
        inputMode="numeric"
        placeholder="0"
        value={value ? value.toLocaleString("ko-KR") : ""}
        onChange={(e) => setAmount(e.target.value)}
        autoFocus
      />
      {meta.defaultAccount && (
        <Field label={kind === "withdraw" ? "어느 계좌에서" : "어느 계좌로"} value={account} onChange={(e) => setAccount(e.target.value)} />
      )}
      {kind === "spend" && <Field label="어디에 썼나요" placeholder="예: 점심, 택시" value={memo} onChange={(e) => setMemo(e.target.value)} />}
      <Button type="submit" size="lg" className="w-full" disabled={!value}>
        기록하기
      </Button>
    </form>
  );
}
