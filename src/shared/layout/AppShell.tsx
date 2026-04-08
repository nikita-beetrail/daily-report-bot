import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/Button";
import { useTheme } from "../theme/ThemeProvider";
import { cn } from "../ui/cn";

export function AppShell() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50 light:bg-zinc-50 light:text-zinc-900">
      <header className="sticky top-0 z-10 border-b border-zinc-900/80 bg-zinc-950/80 backdrop-blur light:border-zinc-200 light:bg-zinc-50/80">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Ежедневный отчёт</div>
            <div className="flex flex-wrap items-center gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-1.5 text-xs transition",
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 light:text-zinc-600 light:hover:bg-zinc-100",
                  )
                }
              >
                Новый отчёт
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-1.5 text-xs transition",
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200 light:text-zinc-600 light:hover:bg-zinc-100",
                  )
                }
              >
                История
              </NavLink>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={toggleTheme}
            type="button"
            className="w-full sm:w-auto"
            title="Переключить тему"
          >
            {theme === "dark" ? "☀️ Светлая тема" : "🌙 Тёмная тема"}
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

