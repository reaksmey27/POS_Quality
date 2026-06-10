<template>
  <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useThemeStore } from "@/stores/theme.store";

const themeStore = useThemeStore();

onMounted(() => {
  themeStore.init();
});
</script>