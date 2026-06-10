<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200"
  >
    <AppSidebar @logout="handleLogout" />

    <main class="flex-1 md:pl-64 min-w-0 transition-all">
      <div class="min-h-screen">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import AppSidebar from "@/components/layout/AppSidebar.vue";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
</script>
