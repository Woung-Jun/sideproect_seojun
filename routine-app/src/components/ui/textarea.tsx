import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content min-h-24 w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
