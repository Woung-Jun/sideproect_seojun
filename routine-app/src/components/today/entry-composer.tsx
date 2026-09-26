"use client";

import { ArrowUp, Loader2, Mic } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { EntryResult } from "@/lib/types";

import { EntryResultView } from "./entry-result";

const EXAMPLES = [
  "점심에 제육덮밥 먹고, 저녁에 헬스장에서 40분 운동했어. 철봉 매달리기도 했어. 아메리카노 4,500원",
  "5시간 잤더니 피곤해. 라면 먹고 편의점 3,200원",
];

export function EntryComposer() {
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<EntryResult | null>(null);

  async function submit() {
    if (!text.trim() || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "기록을 처리하지 못했어요.");
      setResult(data);
      setText("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "기록을 처리하지 못했어요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border bg-card p-4 shadow-[0_1px_2px_rgb(0_0_0/0.03)] focus-within:ring-[3px] focus-within:ring-ring/30">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          placeholder="오늘 뭐 했어요? 먹은 것, 운동, 쓴 돈, 기분까지 편하게 말해 주세요."
          aria-label="오늘의 기록"
        />
        <div className="mt-2 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            aria-label="음성 입력 (준비 중)"
            onClick={() => toast("음성 입력은 2단계에서 추가돼요.")}
          >
            <Mic />
          </Button>
          <Button onClick={submit} disabled={!text.trim() || pending} className="gap-1.5">
            {pending ? <Loader2 className="animate-spin" /> : <ArrowUp />}
            기록하기
          </Button>
        </div>
      </div>

      {!result && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-muted-foreground">이렇게 말해 보세요</p>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => setText(ex)}
              className="rounded-lg bg-muted px-3 py-2.5 text-left text-[13px] leading-snug text-muted-foreground transition-colors hover:text-foreground"
            >
              “{ex}”
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={JSON.stringify(result)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <EntryResultView result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
