<template>
  <tr
    class="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-100"
  >
    <td
      class="py-3.5 px-6 font-mono text-xs text-slate-400 dark:text-slate-500"
    >
      #{{ order.id }}
    </td>

    <td
      class="py-3.5 px-6 text-slate-600 dark:text-slate-400 text-sm whitespace-nowrap"
    >
      {{ formatDate(order.created_at) }}
    </td>

    <td class="py-3.5 px-6">
      <div
        :class="getStatusMeta(order?.status)"
        class="inline-flex items-center text-[10px] font-extrabold px-2.5 py-1 rounded-md border capitalize"
      >
        {{ getStatusLabel(order?.status) }}
      </div>
    </td>

    <td
      class="py-3.5 px-6 font-semibold text-slate-900 dark:text-white tracking-tight text-sm"
    >
      {{ order.cashier?.name || "—" }}
    </td>

    <td class="py-3.5 px-6 text-slate-500 dark:text-slate-400 text-sm">
      {{ order.items?.length || 0 }} item(s)
    </td>

    <td
      class="py-3.5 px-6 font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm"
    >
      ${{ parseFloat(order.total_price).toFixed(2) }}
    </td>

    <td class="py-3.5 px-6 text-right">
      <button
        @click="$emit('view', order)"
        type="button"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-md transition-colors cursor-pointer"
      >
        <EyeIcon class="w-3.5 h-3.5" />
        View Details
      </button>
    </td>
  </tr>
</template>

<script setup>
import { EyeIcon } from "lucide-vue-next";

defineProps({
  order: { type: Object, required: true },
});

defineEmits(["view"]);

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const normalizeStatus = (status) => {
  const s =
    typeof status === "string" && status.trim().length > 0
      ? status.trim().toLowerCase()
      : "";

  return s || "completed";
};

const getStatusLabel = (status) => {
  const s = normalizeStatus(status);
  if (s === "pending") return "Pending";
  if (s === "cancelled") return "Cancelled";
  return "Completed";
};

const getStatusMeta = (status) => {
  const s = normalizeStatus(status);

  const themes = {
    completed:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    pending:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    cancelled:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  return themes[s] || themes.completed;
};
</script>
