import React from "react";
import { cn } from "./cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<NonNullable<Props["variant"]>, string> = {
    primary:
      "bg-indigo-500 text-white hover:bg-indigo-400 active:bg-indigo-500/90",
    secondary:
      "bg-zinc-800 text-zinc-50 hover:bg-zinc-700 active:bg-zinc-800/90 dark:bg-zinc-900 dark:hover:bg-zinc-800",
    ghost:
      "bg-transparent text-zinc-200 hover:bg-zinc-900/60 active:bg-zinc-900/80",
    danger: "bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-600/90",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}

