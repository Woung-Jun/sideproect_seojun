# 루틴 (routine-app)

말로 하루를 기록하면 AI가 숫자(kcal, 지출, 수면)로 바꾸고, 분야별 코치가 루틴을 이어 가도록 피드백하는 개인용 웹앱(PWA).

현재 단계: **UI 목업**. API 키 없이 동작하며, AI 자리는 키워드 기반 목업(`src/lib/ai/mock.ts`)이 채운다.

## 실행

```bash
npm install
npm run dev   # http://localhost:3000
```

## 구조

| 경로 | 역할 |
| --- | --- |
| `src/app/page.tsx` | 오늘: 자연어 기록 → 변환 카드, 코치 피드백, 주간 차트 |
| `src/app/habits` | 습관: 주간 실천, 습관 루프(신호→행동→보상) |
| `src/app/money` | 가계부: 예산 진행률, 카테고리별, 최근 내역 |
| `src/app/settings` | 설정: 프로필, AI 공급자 상태 |
| `src/app/api/entries` | 기록 처리 API (파싱 → MET 계산 → 피드백) |
| `src/lib/ai` | AI 공급자 인터페이스, 목업, 공유 프롬프트 |
| `src/lib/calories.ts` | MET 표 기반 운동 소모 kcal 계산 |
| `src/components/ui` | shadcn/ui 방식의 기본 컴포넌트 |

## 사용 라이브러리

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- shadcn/ui 방식 컴포넌트 + Radix UI, lucide-react 아이콘
- Recharts (차트), motion (애니메이션), sonner (토스트), next-themes (다크 모드)
- Pretendard (한글 폰트)
