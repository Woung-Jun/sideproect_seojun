import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "루틴 — 나의 루틴 코치",
    short_name: "루틴",
    description: "말로 기록하면 숫자로 바꿔 주고, 루틴을 이어 가게 돕는 개인 코치",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#faf9f5",
    lang: "ko",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
