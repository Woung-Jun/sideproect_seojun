/**
 * 지갑 정산: 계좌와 현금 지갑 사이의 이동을 기록하고
 * "지금 지갑에 얼마가 있어야 하는지"를 계산한다.
 *
 * 지갑 예상 잔액 = 기초 잔액 + 인출 합계 − 입금 합계 − 현금 지출 합계
 * B계좌 입금은 항상 지갑 현금에서 나간다 (사용자 확인).
 */

/** check는 실제로 센 금액. 잔액을 바꾸지 않고 예상 잔액과 비교만 한다. */
export type WalletEventKind = "opening" | "withdraw" | "deposit" | "spend" | "check";

export interface WalletEvent {
  id: string;
  /** YYYY-MM-DD */
  date: string;
  kind: WalletEventKind;
  /** 항상 양수. 방향은 kind로 정한다. */
  amount: number;
  /** withdraw는 출처 계좌, deposit은 대상 계좌 */
  account?: string;
  memo?: string;
}

export interface WalletTimelineRow extends WalletEvent {
  /** 지갑 잔액 변동. opening은 0 (잔액 자체를 정한다). */
  delta: number;
  balance: number;
  /** check일 때만: 실제 금액 − 예상 잔액 */
  diff?: number;
}

export interface WalletSummary {
  hasOpening: boolean;
  balance: number;
  withdrawn: number;
  deposited: number;
  spent: number;
  /** 인출했지만 아직 입금하지 않은 금액. 음수면 인출보다 많이 입금한 것. */
  notYetMoved: number;
  /** 가장 최근의 실제 확인 기록 */
  lastCheck: WalletTimelineRow | null;
  /** 최신순 */
  timeline: WalletTimelineRow[];
}

const DELTA_SIGN: Record<WalletEventKind, number> = {
  opening: 0,
  withdraw: 1,
  deposit: -1,
  spend: -1,
  check: 0,
};

/** 같은 날짜 안에서는 기초 잔액을 가장 먼저 반영한다. */
const KIND_ORDER: Record<WalletEventKind, number> = {
  opening: 0,
  withdraw: 1,
  spend: 2,
  deposit: 3,
  check: 4,
};

export function summarizeWallet(events: WalletEvent[]): WalletSummary {
  const ordered = [...events].sort(
    (a, b) => a.date.localeCompare(b.date) || KIND_ORDER[a.kind] - KIND_ORDER[b.kind],
  );

  let balance = 0;
  let withdrawn = 0;
  let deposited = 0;
  let spent = 0;
  const rows: WalletTimelineRow[] = [];
  let lastCheck: WalletTimelineRow | null = null;

  for (const e of ordered) {
    if (e.kind === "opening") balance = e.amount;
    if (e.kind === "withdraw") withdrawn += e.amount;
    if (e.kind === "deposit") deposited += e.amount;
    if (e.kind === "spend") spent += e.amount;
    const delta = DELTA_SIGN[e.kind] * e.amount;
    balance += delta;
    const row: WalletTimelineRow = { ...e, delta, balance };
    if (e.kind === "check") {
      row.diff = e.amount - balance;
      lastCheck = row;
    }
    rows.push(row);
  }

  return {
    hasOpening: events.some((e) => e.kind === "opening"),
    balance,
    withdrawn,
    deposited,
    spent,
    notYetMoved: withdrawn - deposited,
    lastCheck,
    timeline: rows.reverse(),
  };
}
