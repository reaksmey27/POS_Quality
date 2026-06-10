<template>
  <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
    <div class="mb-4">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Recent Transactions</h3>
      <p class="text-xs text-slate-400 mt-0.5">Live updates of last cashier activities</p>
    </div>

    <div v-if="orders.length === 0" class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
      <HistoryIcon class="w-8 h-8 opacity-30 mb-2" />
      <p class="text-xs font-semibold">No recent orders logged.</p>
    </div>

    <div v-else class="space-y-3 max-h-[260px] overflow-y-auto pr-1">
      <div v-for="order in orders" :key="order.id" class="flex items-center justify-between p-3.5 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900/60 rounded-xl">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-100/30 dark:border-none">
            #{{ order.id }}
          </div>
          <div>
            <p class="text-xs font-bold text-slate-800 dark:text-slate-200">Order Completed</p>
            <p class="text-[10px] text-slate-400 font-semibold">{{ formatTime(order.created_at) }}</p>
          </div>
        </div>
        
        <div class="text-right">
          <p class="text-xs font-extrabold text-slate-900 dark:text-white">${{ parseFloat(order.total_price).toFixed(2) }}</p>
          <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">{{ formatRiel(order.total_price) }} ៛</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HistoryIcon } from "lucide-vue-next";

defineProps({
  orders: { type: Array, default: () => [] }
});

const formatRiel = (usdValue) => (parseFloat(usdValue || 0) * 4100).toLocaleString();
const formatTime = (timeString) => {
  if (!timeString) return "";
  return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>