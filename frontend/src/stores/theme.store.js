import { defineStore } from "pinia";
import { computed, ref } from "vue";

const THEME_KEY = "pos_theme";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref("light");
  const isDark = computed(() => theme.value === "dark");

  const applyThemeClass = (value) => {
    const htmlRoot = document.documentElement;
    if (value === "dark") {
      htmlRoot.classList.add("dark");
    } else {
      htmlRoot.classList.remove("dark");
    }
  };

  const init = () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      theme.value = saved;
      applyThemeClass(theme.value);
      return;
    }
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    theme.value = prefersDark ? "dark" : "light";
    applyThemeClass(theme.value);
  };

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, theme.value);
    applyThemeClass(theme.value);
  };

  return { theme, isDark, init, toggleTheme };
});