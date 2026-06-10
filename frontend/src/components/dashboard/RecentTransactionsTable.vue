<template>
  <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
    
    <div class="mb-4">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
        Recent Transactions
      </h3>
      <p class="text-xs text-slate-400 mt-0.5">
        Live updates of last cashier activities
      </p>
    </div>

    <div
      v-if="!orders?.length"
      class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500"
    >
      <HistoryIcon class="w-8 h-8 opacity-30 mb-2" />
      <p class="text-xs font-semibold">No recent orders logged.</p>
    </div>

    <div v-else class="space-y-3 max-h-[260px] overflow-y-auto pr-1">
      <div
        v-for="order in orders"
        :key="order.id"
        class="flex items-center justify-between p-3.5 bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900/60 rounded-xl"
      >
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-100/30 dark:border-none">
            #{{ order.id }}
          </div>
          <div class="flex flex-col">
            <span class="text-[10px] text-slate-400 font-semibold">
              {{ formatTime(order.created_at) }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div
            :class="getStatusMeta(order.status)"
            class="inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wide whitespace-nowrap"
          >
            {{ getStatusLabel(order.status) }}
          </div>

          <div class="w-24 text-right">
            <p class="text-xs font-extrabold text-slate-900 dark:text-white">
              ${{ safeUsdTotal(order.total_price) }}
            </p>
            <p class="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">
              {{ formatRiel(order.total_price) }} ៛
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { HistoryIcon } from "lucide-vue-next";

defineProps({
  orders: { type: Array, default: () => [] },
});

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    classes: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
  },
  completed: {
    label: "Completed",
    classes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
  }
};

const DEFAULT_STATUS = "completed";

// Helpers
const getNormalizedKey = (status) => {
  const cleanStatus = typeof status === "string" ? status.trim().toLowerCase() : "";
  return STATUS_CONFIG[cleanStatus] ? cleanStatus : DEFAULT_STATUS;
};

// Formatting & Conversion Layer
const formatRiel = (usdValue) => {
  const numericUsd = parseFloat(usdValue) || 0;
  return Math.round(numericUsd * 4100).toLocaleString();
};

const safeUsdTotal = (usdValue) => {
  const n = parseFloat(usdValue);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
};

const formatTime = (timeString) => {
  if (!timeString) return "—:—";
  return new Date(timeString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lifecycle State Visual Mappers
const getStatusLabel = (status) => {
  return STATUS_CONFIG[getNormalizedKey(status)].label;
};

const getStatusMeta = (status) => {
  return STATUS_CONFIG[getNormalizedKey(status)].classes;
};
</script>