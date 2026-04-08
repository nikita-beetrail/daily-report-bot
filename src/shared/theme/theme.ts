export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "drb.theme";

export function applyThemeToDocument(theme: Theme) {
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
}

