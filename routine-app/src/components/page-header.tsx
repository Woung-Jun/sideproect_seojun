import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-end justify-between gap-3 pt-8 pb-5">
      <div>
        {eyebrow && <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-bold tracking-tight">{title}</h1>
      </div>
      {action ?? <ThemeToggle />}
    </header>
  );
}
