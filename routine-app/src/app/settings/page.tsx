import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAiProvider } from "@/lib/ai";
import { PROFILE } from "@/lib/mock-data";
import { formatKcal, formatWon } from "@/lib/utils";

export const metadata = { title: "설정 · 루틴" };

export default function SettingsPage() {
  const provider = getAiProvider().name;
  const rows = [
    ["체중", `${PROFILE.weightKg} kg`, "운동 소모 kcal 계산에 사용"],
    ["목표 섭취량", formatKcal(PROFILE.targetKcal), "하루 기준"],
    ["월 예산", formatWon(PROFILE.monthlyBudget), "가계부 진행률 기준"],
  ];

  return (
    <>
      <PageHeader title="설정" />
      <div className="space-y-4">
        <Card className="p-0">
          <CardHeader className="mb-0 px-5 pt-5 pb-2">
            <CardTitle>내 정보</CardTitle>
          </CardHeader>
          <ul className="divide-y">
            {rows.map(([label, value, hint]) => (
              <li key={label} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{hint}</p>
                </div>
                <p className="text-sm font-semibold">{value}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI 코치</CardTitle>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {provider === "mock" ? "목업 모드" : provider}
            </span>
          </CardHeader>
          <p className="text-sm leading-relaxed text-muted-foreground">
            지금은 API 키 없이 동작하는 목업이에요. Claude 또는 Gemini를 연결하면 실제 분석과
            피드백으로 바뀝니다. 말투: 직설적.
          </p>
        </Card>
      </div>
    </>
  );
}
