<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-6">
    
    <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
      <div class="flex items-center gap-2">
        <ShoppingCartIcon class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <h3 class="font-bold text-slate-900 dark:text-white text-sm">
          Customer Basket
        </h3>
      </div>
      <button
        v-if="cart.length > 0"
        type="button"
        @click="handleClear"
        class="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
      >
        Clear All
      </button>
    </div>

    <div class="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 px-5">
      <div
        v-if="cart.length === 0"
        class="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12"
      >
        <ShoppingBagIcon class="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
        <h5 class="text-xs font-bold text-slate-700 dark:text-slate-400">
          Basket is empty
        </h5>
        <p class="text-[11px] text-slate-400 dark:text-slate-500 max-w-[180px] mt-0.5">
          Select catalog elements on the left canvas block to populate items.
        </p>
      </div>

      <div
        v-else
        v-for="item in cart"
        :key="item.id"
        class="py-3.5 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-100"
      >
        <div class="min-w-0 flex-1 flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.name"
              class="w-full h-full object-cover"
            />
            <PackageIcon
              v-else
              class="w-4 h-4 text-slate-300 dark:text-slate-700 stroke-1.5"
            />
          </div>
          <div class="min-w-0">
            <h5
              class="text-xs font-semibold text-slate-900 dark:text-white truncate"
              :title="item.name"
            >
              {{ item.name }}
            </h5>
            <span class="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 block">
              ${{ formatCurrency(item.price) }} each
            </span>
          </div>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            @click="handleDecrease(item)"
            class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
            :aria-label="`Decrease quantity of ${item.name}`"
          >
            <MinusIcon class="w-3 h-3" />
          </button>
          <span class="w-7 text-center font-mono text-xs font-bold text-slate-900 dark:text-white">
            {{ item.qty }}
          </span>
          <button
            type="button"
            @click="handleIncrease(item)"
            :disabled="item.qty >= item.stock"
            class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            :aria-label="`Increase quantity of ${item.name}`"
          >
            <PlusIcon class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <div class="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4 shrink-0">
      <div class="space-y-1.5">
        <div class="flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Subtotal</span>
          <span>${{ formatCurrency(total) }}</span>
        </div>
        <div class="flex items-center justify-between text-sm font-bold text-slate-950 dark:text-white pt-1.5 border-t border-dashed border-slate-200 dark:border-slate-800">
          <span>Grand Total</span>
          <span class="text-lg text-indigo-600 dark:text-indigo-400 font-mono">
            ${{ formatCurrency(total) }}
          </span>
        </div>
      </div>

      <button
        type="button"
        @click="handleCheckout"
        :disabled="cart.length === 0 || checkoutLoading"
        class="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 font-semibold text-sm py-3 rounded-xl shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        <CreditCardIcon class="w-4 h-4" />
        Proceed to Payment
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  ShoppingCartIcon,
  ShoppingBagIcon,
  PlusIcon,
  MinusIcon,
  CreditCardIcon,
  PackageIcon,
} from "lucide-vue-next";

const props = defineProps({
  cart: { type: Array, required: true },
  total: { type: Number, required: true },
  checkoutLoading: { type: Boolean, default: false },
});

const emit = defineEmits(["increase", "decrease", "clear", "checkout"]);

const formatCurrency = (value) => {
  const numericValue = parseFloat(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "0.00";
};

const handleIncrease = (item) => {
  if (item.qty >= item.stock) return;
  emit("increase", item);
};

const handleDecrease = (item) => {
  emit("decrease", item);
};

const handleClear = () => {
  emit("clear");
};

const handleCheckout = () => {
  if (props.cart.length === 0 || props.checkoutLoading) return;
  emit("checkout");
};
</script>