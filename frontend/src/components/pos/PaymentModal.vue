<template>
  <div 
    @click.self="$emit('close')" 
    class="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200"
  >
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in scale-in duration-150">
      
      <div class="px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-200">
          <DollarSignIcon class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Select Payment Method</span>
        </div>
        <button 
          @click="$emit('close')" 
          type="button"
          class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
        >
          [Close]
        </button>
      </div>

      <div class="p-5 space-y-5">
        
        <div class="bg-indigo-50/60 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100/70 dark:border-indigo-900/30 text-center">
          <span class="text-[11px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">Total Amount Due</span>
          <span class="text-3xl font-black text-indigo-900 dark:text-indigo-300 font-mono block mt-1">${{ total.toFixed(2) }}</span>
        </div>

        <div class="space-y-2">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 block">Payment Options</span>
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="paymentMethod = 'cash'"
              type="button"
              class="flex flex-col items-center justify-center gap-2 p-4 border rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
              :class="paymentMethod === 'cash' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md dark:shadow-none' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
            >
              <BanknoteIcon class="w-5 h-5" />
              Pay with Cash
            </button>
            
            <button 
              @click="paymentMethod = 'qr'"
              type="button"
              class="flex flex-col items-center justify-center gap-2 p-4 border rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
              :class="paymentMethod === 'qr' 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md dark:shadow-none' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
            >
              <QrCodeIcon class="w-5 h-5" />
              Scan QR Code
            </button>
          </div>
        </div>

        <div 
          v-if="paymentMethod === 'cash'" 
          class="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <label class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Amount Tendered</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-bold text-slate-400 dark:text-slate-600">$</span>
            <input 
              type="number" 
              v-model.number="amountTendered"
              ref="cashInput"
              step="0.01"
              min="0"
              class="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
              placeholder="0.00" 
            />
          </div>
          <div class="flex justify-between items-center text-xs font-medium pt-2.5 border-t border-slate-200 dark:border-slate-800">
            <span class="text-slate-500 dark:text-slate-400">Change Due:</span>
            <span 
              class="font-bold font-mono text-sm" 
              :class="changeDue >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'"
            >
              ${{ changeDue.toFixed(2) }}
            </span>
          </div>
        </div>

        <div 
          v-if="paymentMethod === 'qr'" 
          class="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div class="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl relative overflow-hidden shadow-xs">
            <div class="absolute inset-x-0 h-0.5 bg-indigo-500 shadow-md shadow-indigo-400 top-0 anonymity animate-bounce"></div>
            <QrCodeIcon class="w-24 h-24 text-slate-800 dark:text-slate-200 opacity-90" />
          </div>
          <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-2.5 animate-pulse">Awaiting terminal customer capture...</span>
        </div>
      </div>

      <div class="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-3">
        <button 
          @click="$emit('close')"
          type="button"
          class="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs uppercase tracking-wider py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          @click="submitPayment"
          type="button"
          :disabled="checkoutLoading || (paymentMethod === 'cash' && changeDue < 0)"
          class="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:border-transparent disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-xs py-2.5 rounded-xl shadow-md dark:shadow-none transition-all cursor-pointer"
        >
          <Loader2Icon v-if="checkoutLoading" class="w-3.5 h-3.5 animate-spin" />
          <CheckCircleIcon v-else class="w-3.5 h-3.5" />
          <span>Complete Checkout</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from "vue";
import { DollarSignIcon, BanknoteIcon, QrCodeIcon, Loader2Icon, CheckCircleIcon } from "lucide-vue-next";

const props = defineProps({
  total: { type: Number, required: true },
  checkoutLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'confirm-checkout']);

const paymentMethod = ref("cash");
const amountTendered = ref(null);
const cashInput = ref(null);

const changeDue = computed(() => {
  if (!amountTendered.value) return -props.total;
  return amountTendered.value - props.total;
});

watch(paymentMethod, (newMethod) => {
  if (newMethod === 'cash') {
    nextTick(() => cashInput.value?.focus());
  }
});

const submitPayment = () => {
  emit('confirm-checkout', {
    method: paymentMethod.value,
    tendered: paymentMethod.value === 'cash' ? amountTendered.value : props.total
  });
};
</script>