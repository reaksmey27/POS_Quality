<template>
  <div 
    @click.self="handleClose" 
    class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors"
  >
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-xl shadow-xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
      
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Order #{{ order.id }}
          </h3>
          <p class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            {{ formatDate(order.created_at) }} &bull; Cashier: {{ order.cashier?.name || "—" }}
          </p>
        </div>
        <button 
          type="button"
          @click="handleClose" 
          class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div class="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-white dark:bg-slate-950">
          <table class="w-full text-left text-xs text-slate-600 dark:text-slate-400">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
                <th class="py-2.5 px-4">Product</th>
                <th class="py-2.5 px-4 text-center">Qty</th>
                <th class="py-2.5 px-4 text-right">Unit Price</th>
                <th class="py-2.5 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-950">
              <tr 
                v-for="item in order.items" 
                :key="item.id" 
                class="align-middle hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
              >
                <td class="py-2.5 px-4 font-medium text-slate-900 dark:text-white max-w-[200px]">
                  <div class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                      <img v-if="item.product?.image" :src="item.product.image" :alt="item.product?.name" class="w-full h-full object-cover" />
                      <ImageIcon v-else class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                    </div>
                    <span class="truncate block font-semibold text-sm">
                      {{ item.product?.name || "Deleted product" }}
                    </span>
                  </div>
                </td>
                <td class="py-2 px-4 text-center text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {{ item.qty }}
                </td>
                <td class="py-2 px-4 text-right text-slate-500 dark:text-slate-400 font-mono">
                  ${{ formatCurrency(item.price) }}
                </td>
                <td class="py-2 px-4 text-right font-bold text-slate-900 dark:text-white font-mono">
                  ${{ getItemSubtotal(item.price, item.qty) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pt-3 border-t-2 border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-center text-base">
          <span class="font-bold text-slate-700 dark:text-slate-300">Total Invoice Amount</span>
          <span class="font-black text-indigo-600 dark:text-indigo-400 text-xl font-mono">
            ${{ formatCurrency(order.total_price) }}
          </span>
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
        <button 
          type="button"
          @click="handleClose" 
          class="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { XIcon, ImageIcon } from "lucide-vue-next";

defineProps({
  order: { type: Object, required: true }
});

const emit = defineEmits(["close"]);

const handleClose = () => {
  emit("close");
};

const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "0.00";
};

const getItemSubtotal = (price, qty) => {
  const numericPrice = parseFloat(price) || 0;
  const numericQty = parseInt(qty, 10) || 0;
  return (numericPrice * numericQty).toFixed(2);
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });
};
</script>