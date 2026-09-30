import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "theme";
const THEMES = ["dark", "light"];

const getSystemTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "dark";
  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return THEMES.includes(storedTheme) ? storedTheme : document.documentElement.dataset.theme || getSystemTheme();
};

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  const applyTheme = useCallback((nextTheme, persist = true) => {
    const resolvedTheme = THEMES.includes(nextTheme) ? nextTheme : getSystemTheme();
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
    window.__portfolioTheme = resolvedTheme;
    window.dispatchEvent(new CustomEvent("portfolio:themechange", { detail: { theme: resolvedTheme } }));

    if (persist) {
      window.localStorage.setItem(STORAGE_KEY, resolvedTheme);
    }

    setTheme(resolvedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme, false);
  }, [applyTheme, theme]);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [applyTheme, theme]);

  return { theme, setTheme: applyTheme, toggleTheme };
}
