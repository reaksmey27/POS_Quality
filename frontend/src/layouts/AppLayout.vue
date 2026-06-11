<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200"
  >
    <AppSidebar @logout="handleLogout" />

    <main class="flex-1 md:pl-64 min-w-0 transition-all">
      <div class="min-h-screen">
        <TopNavbar />
        <!-- Spacer under navbar (adjusted to reduce extra gap) -->
        <div>
          <div class="px-4 sm:px-6 py-6">
            <RouterView />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import AppSidebar from "@/components/layout/AppSidebar.vue";
import TopNavbar from "@/components/layout/TopNavbar.vue";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push("/login");
};
</script>
