import React from "react";
import { cn } from "./cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 shadow-sm backdrop-blur " +
          "light:border-zinc-200 light:bg-white",
        className,
      )}
      {...props}
    />
  );
}

