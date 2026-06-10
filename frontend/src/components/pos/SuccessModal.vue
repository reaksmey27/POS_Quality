<template>
  <div 
    @click.self="$emit('close')" 
    class="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors duration-150"
  >
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center transform transition-all animate-in scale-in duration-150">
      
      <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100 dark:border-emerald-900/40 shadow-sm animate-bounce">
        <CheckIcon class="w-8 h-8 stroke-3" />
      </div>
      
      <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Order Completed!</h3>
      <p class="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">Receipt ID: #{{ order.id }}</p>
      
      <div class="my-5 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80 text-center space-y-3">
        <div>
          <span class="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Amount Paid</span>
          <span class="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono block mt-0.5">
            ${{ parseFloat(order.total_price || order.total || 0).toFixed(2) }}
          </span>
        </div>
        
        <div class="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
          <span>Channel</span>
          <span class="capitalize font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <component 
              :is="order.payment_method === 'qr' ? QrCodeIcon : BanknoteIcon" 
              class="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" 
            />
            {{ order.payment_method || 'Cash' }}
          </span>
        </div>
      </div>
      
      <button 
        @click="$emit('close')" 
        type="button"
        class="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all cursor-pointer select-none"
      >
        Open Next Transaction
      </button>
    </div>
  </div>
</template>

<script setup>
import { CheckIcon, QrCodeIcon, BanknoteIcon } from "lucide-vue-next";

defineProps({
  order: { type: Object, required: true }
});

defineEmits(['close']);
</script>