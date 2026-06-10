<template>
  <button
    @click="themeStore.toggleTheme"
    type="button"
    class="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer select-none border border-transparent dark:border-slate-700/50 shadow-xs"
    aria-label="Toggle user interface application color theme"
  >
    <SunIcon v-if="themeStore.isDark" class="w-5 h-5 text-amber-400 animate-in fade-in zoom-in-75 duration-200" />
    
    <MoonIcon v-else class="w-5 h-5 text-indigo-600 animate-in fade-in zoom-in-75 duration-200" />
  </button>
</template>

<script setup>
import { useThemeStore } from "../stores/theme.store.js";
import { SunIcon, MoonIcon } from "lucide-vue-next";

const themeStore = useThemeStore();
</script>