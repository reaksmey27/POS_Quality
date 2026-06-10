<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 text-slate-900 dark:text-slate-100 transition-colors duration-150">
    
    <div class="border-b border-slate-100 dark:border-slate-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, <span class="font-semibold text-slate-700 dark:text-indigo-400">{{ auth.user?.name || "User" }}</span>
        </p>
      </div>
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold flex items-center gap-2 select-none">
        <span class="text-slate-400 dark:text-slate-500">EXCHANGE RATE:</span>
        <span class="text-emerald-600 dark:text-emerald-400">$1.00 = 4,100 ៛</span>
      </div>
    </div>

    <div 
      class="grid grid-cols-1 sm:grid-cols-2 gap-5"
      :class="auth.canManage ? 'lg:grid-cols-4' : 'lg:grid-cols-2'"
    >
      <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Products</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ stats.products }}</p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <PackageIcon class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categories</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ stats.categories }}</p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <FolderOpenIcon class="w-6 h-6" />
        </div>
      </div>

      <div 
        v-if="auth.canManage" 
        class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
      >
        <div class="space-y-2">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</p>
          <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.orders }}</p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <ClipboardListIcon class="w-6 h-6" />
        </div>
      </div>

      <div 
        v-if="auth.canManage" 
        class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
      >
        <div class="space-y-0.5">
          <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revenue</p>
          <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${{ (stats.revenue || 0).toFixed(2) }}</p>
          <p class="text-[11px] font-bold text-emerald-600 dark:text-emerald-500 tracking-wide">≈ {{ formatRiel(stats.revenue) }} ៛</p>
        </div>
        <div class="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <DollarSignIcon class="w-6 h-6" />
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
        <h2 class="font-semibold text-slate-700 dark:text-slate-300 text-sm">Quick Actions</h2>
      </div>
      <div class="p-6 flex flex-wrap items-center gap-3">
        <RouterLink to="/pos" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
          <ShoppingCartIcon class="w-4 h-4" />
          Open POS
        </RouterLink>
        <RouterLink v-if="auth.canManage" to="/products" class="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
          <PackageIcon class="w-4 h-4" />
          Manage Products
        </RouterLink>
        <RouterLink v-if="auth.canManage" to="/orders" class="inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer">
          <ClipboardListIcon class="w-4 h-4" />
          View Orders
        </RouterLink>
        
        <button 
          @click="themeStore.toggleTheme" 
          type="button" 
          class="sm:ml-auto inline-flex items-center gap-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <SunIcon v-if="themeStore.isDark" class="w-4 h-4 text-amber-500" />
          <MoonIcon v-else class="w-4 h-4 text-slate-500" />
          <span>{{ themeStore.isDark ? "Light" : "Dark" }} Mode</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <SalesTrendChart class="lg:col-span-7" />
      <RecentTransactionsTable class="lg:col-span-5" :orders="recentOrders" />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store"; 
import api from "@/services/api";

import SalesTrendChart from "@/components/dashboard/SalesTrendChart.vue";
import RecentTransactionsTable from "@/components/dashboard/RecentTransactionsTable.vue";

import { 
  PackageIcon, 
  FolderOpenIcon, 
  ClipboardListIcon, 
  DollarSignIcon, 
  ShoppingCartIcon, 
  SunIcon, 
  MoonIcon 
} from "lucide-vue-next";

// -----------------------------------------------------------------------------
// Core Ingress State Pinia Adapters
// -----------------------------------------------------------------------------
const auth = useAuthStore();
const themeStore = useThemeStore(); 

const stats = ref({ products: 0, categories: 0, orders: 0, revenue: 0 });
const recentOrders = ref([]);

// -----------------------------------------------------------------------------
// Numeric Computations & Localization Formatters
// -----------------------------------------------------------------------------
const formatRiel = (usdValue) => {
  const numericUsd = parseFloat(usdValue || 0);
  return Math.round(numericUsd * 4100).toLocaleString();
};

// -----------------------------------------------------------------------------
// Async Framework Life-cycle Synchronizations
// -----------------------------------------------------------------------------
onMounted(async () => {
  try {
    const [pRes, cRes] = await Promise.all([
      api.get("/products"), 
      api.get("/categories")
    ]);
    
    stats.value.products = pRes.data?.data?.length || 0;
    stats.value.categories = cRes.data?.data?.length || 0;

    // Conditionally query operations metrics if structural scope matches privileges
    if (auth.canManage) {
      const oRes = await api.get("/orders");
      const orderList = oRes.data?.data || [];
      
      stats.value.orders = orderList.length;
      stats.value.revenue = orderList.reduce((sum, o) => {
        return sum + parseFloat(o?.total_price || 0);
      }, 0);
      
      recentOrders.value = orderList.slice(-4).reverse();
    }
  } catch (err) {
    console.error("Failed to load dashboard statistics components layout context:", err);
  }
});
</script>