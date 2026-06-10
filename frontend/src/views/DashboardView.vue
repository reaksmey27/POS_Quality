<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-150">
    
    <div class="border-b border-slate-100 dark:border-slate-800 pb-5">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
        Dashboard
      </h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
        Welcome back,
        <span class="font-semibold text-slate-700 dark:text-indigo-400">
          {{ auth.user?.name || "User" }}
        </span>
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
      <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Products
          </p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">
            {{ stats.products }}
          </p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <PackageIcon class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Categories
          </p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">
            {{ stats.categories }}
          </p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <FolderOpenIcon class="w-6 h-6" />
        </div>
      </div>

      <div v-if="auth.canManage" class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Orders
          </p>
          <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {{ stats.orders }}
          </p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <ClipboardListIcon class="w-6 h-6" />
        </div>
      </div>

      <div v-if="auth.canManage" class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Revenue
          </p>
          <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            ${{ stats.revenue.toFixed(2) }}
          </p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <DollarSignIcon class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <h2 class="font-semibold text-slate-700 dark:text-slate-300">Quick Actions</h2>
      </div>
      
      <div class="p-6 flex flex-wrap gap-3">
        <RouterLink
          to="/pos"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <ShoppingCartIcon class="w-4 h-4" />
          Open POS
        </RouterLink>

        <RouterLink
          v-if="auth.canManage"
          to="/products"
          class="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <PackageIcon class="w-4 h-4 text-slate-500 dark:text-slate-400" />
          Manage Products
        </RouterLink>

        <RouterLink
          v-if="auth.canManage"
          to="/orders"
          class="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors"
        >
          <ClipboardListIcon class="w-4 h-4 text-slate-500 dark:text-slate-400" />
          View Orders
        </RouterLink>

        <button
          @click="themeStore.toggleTheme"
          type="button"
          class="ml-auto inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <SunIcon v-if="themeStore.isDark" class="w-4 h-4 text-amber-500" />
          <MoonIcon v-else class="w-4 h-4 text-slate-500" />
          <span>{{ themeStore.isDark ? "Light Mode" : "Dark Mode" }}</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store"; 
import api from "@/services/api";

import {
  PackageIcon,
  FolderOpenIcon,
  ClipboardListIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  SunIcon,
  MoonIcon
} from "lucide-vue-next";

const auth = useAuthStore();
const themeStore = useThemeStore(); 
const stats = ref({ products: 0, categories: 0, orders: 0, revenue: 0 });

onMounted(async () => {
  try {
    const [pRes, cRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
    ]);
    stats.value.products = pRes.data.data.length;
    stats.value.categories = cRes.data.data.length;

    if (auth.canManage) {
      const oRes = await api.get("/orders");
      stats.value.orders = oRes.data.data.length;
      stats.value.revenue = oRes.data.data.reduce(
        (sum, o) => sum + parseFloat(o.total_price || 0),
        0,
      );
    }
  } catch (err) {
    console.error("Failed to load dashboard statistics:", err);
  }
});
</script>