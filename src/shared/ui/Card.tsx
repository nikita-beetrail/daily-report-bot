import React from "react";
import { cn } from "./cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 bg-zinc-100 p-4 shadow-sm backdrop-blur " +
          "dark:border-zinc-800 dark:bg-zinc-900/60",
        className,
      )}
      {...props}
    />
  );
}

