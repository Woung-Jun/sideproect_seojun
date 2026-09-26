import { processEntry } from "@/lib/entry";
import { HABITS, PROFILE } from "@/lib/mock-data";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text) {
    return Response.json({ error: "기록할 내용을 입력해 주세요." }, { status: 400 });
  }
  if (text.length > 2000) {
    return Response.json({ error: "기록은 2,000자까지 입력할 수 있어요." }, { status: 400 });
  }
  try {
    const result = await processEntry(text, HABITS, PROFILE.weightKg);
    return Response.json(result);
  } catch (error) {
    console.error("entry processing failed", error);
    return Response.json(
      { error: "AI 분석에 실패했어요. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
