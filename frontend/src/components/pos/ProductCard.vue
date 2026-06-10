<template>
  <div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col group transition-all duration-150 relative"
  >
    <span
      v-if="cartQty > 0"
      class="absolute top-2.5 right-2.5 z-10 bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm animate-in zoom-in-75 duration-100"
    >
      {{ cartQty }} selected
    </span>

    <div
      class="aspect-square w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center border-b border-slate-100 dark:border-slate-900 p-6 relative overflow-hidden group"
    >
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
      />
      <PackageIcon
        v-else
        class="w-12 h-12 text-slate-300 dark:text-slate-700 group-hover:scale-110 transition-transform duration-200"
      />
    </div>

    <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
      <div>
        <h4
          class="font-semibold text-slate-950 dark:text-white line-clamp-1 text-sm tracking-tight"
        >
          {{ product.name }}
        </h4>
        <p
          class="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mt-0.5 min-h-8"
        >
          {{ product.description || "No description provided." }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-1">
        <div class="flex flex-col">
          <span class="text-base font-bold text-slate-900 dark:text-slate-100">
            ${{ parseFloat(product.price).toFixed(2) }}
          </span>
          <span
            class="text-[10px] font-bold uppercase tracking-wider mt-0.5"
            :class="
              product.qty > 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            "
          >
            {{ product.qty > 0 ? `${product.qty} In Stock` : "Out of Stock" }}
          </span>
        </div>

        <button
          @click="$emit('add-to-cart', product)"
          type="button"
          :disabled="product.qty === 0 || cartQty >= product.qty"
          class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white disabled:bg-slate-50 dark:disabled:bg-slate-950 disabled:text-slate-300 dark:disabled:text-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
          title="Add item to checkout basket"
        >
          <PlusIcon class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PackageIcon, PlusIcon } from "lucide-vue-next";

defineProps({
  product: { type: Object, required: true },
  cartQty: { type: Number, default: 0 },
});

defineEmits(["add-to-cart"]);
</script>
