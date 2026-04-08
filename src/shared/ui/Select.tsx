import React from "react";
import { cn } from "./cn";

export type SelectOption = { value: string; label: string };

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  error?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, Props>(
  ({ className, options, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 " +
              "focus:outline-none focus:ring-2 focus:ring-indigo-400/70 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
            error && "border-rose-500/70 focus:ring-rose-400/70",
            className,
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error ? (
          <div className="mt-1 text-xs text-rose-400">{error}</div>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";

