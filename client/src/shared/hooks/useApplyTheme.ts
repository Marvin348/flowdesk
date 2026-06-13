import type { AppearanceTheme } from "@shared/types/user";
import { useEffect } from "react";

export const useApplyTheme = (theme: AppearanceTheme) => {
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      return;
    }
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
};
