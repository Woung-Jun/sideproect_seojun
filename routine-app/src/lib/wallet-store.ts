import type { WalletEvent } from "./wallet";

/**
 * DB 연결 전 임시 저장소: 이 기기의 브라우저(localStorage)에만 저장된다.
 * Supabase 연결 후 transactions 테이블로 옮긴다.
 */
const KEY = "routine.wallet.v1";
const EMPTY: WalletEvent[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cached: WalletEvent[] = EMPTY;

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function getWalletSnapshot(): WalletEvent[] {
  const raw = read();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? (JSON.parse(raw) as WalletEvent[]) : EMPTY;
    } catch {
      cached = EMPTY;
    }
  }
  return cached;
}

export function getWalletServerSnapshot(): WalletEvent[] {
  return EMPTY;
}

export function subscribeWallet(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function saveWallet(events: WalletEvent[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    // 저장 공간이 막힌 환경(사생활 보호 모드 등)에서는 이번 세션 동안만 유지된다.
    cachedRaw = null;
    cached = events;
  }
  listeners.forEach((l) => l());
}
