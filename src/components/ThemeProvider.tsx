"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "theme";
const THEME_COOKIE_MAX_AGE = 31536000; // 1 year

function getThemeFromDOM(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribeToTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function applyTheme(next: Theme): void {
  document.documentElement.classList.toggle("dark", next === "dark");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    document.cookie = `theme=${next};path=/;max-age=${THEME_COOKIE_MAX_AGE};samesite=lax`;
  } catch {
    /* localStorage may be unavailable in restricted contexts */
  }
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeFromDOM,
    () => "light" as const,
  );

  const toggleTheme = useCallback((): void => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const setTheme = useCallback((next: Theme): void => {
    applyTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
