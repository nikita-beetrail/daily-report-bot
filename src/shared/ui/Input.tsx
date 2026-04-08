import React from "react";
import { cn } from "./cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 " +
              "focus:outline-none focus:ring-2 focus:ring-indigo-400/70 dark:border-zinc-800 dark:bg-zinc-950 " +
              "light:border-zinc-200 light:bg-white light:text-zinc-900 light:placeholder:text-zinc-400",
            error && "border-rose-500/70 focus:ring-rose-400/70",
            className,
          )}
          {...props}
        />
        {error ? (
          <div className="mt-1 text-xs text-rose-400">{error}</div>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";

