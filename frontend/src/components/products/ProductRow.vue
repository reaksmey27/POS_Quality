<template>
  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-100 group">
    <td class="py-3.5 px-6 font-mono text-xs text-slate-400 dark:text-slate-500">
      #{{ product.id }}
    </td>
    
    <td class="py-3.5 px-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
          <img v-if="product.image" :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
          <ImageIcon v-else class="w-4 h-4 text-slate-300 dark:text-slate-700 stroke-1.5" />
        </div>
        <span class="font-semibold text-slate-900 dark:text-white tracking-tight text-sm">
          {{ product.name }}
        </span>
      </div>
    </td>

    <td class="py-3.5 px-6 whitespace-nowrap">
      <span 
        v-if="product.category?.name" 
        class="inline-flex items-center text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/60"
      >
        {{ product.category.name }}
      </span>
      <span v-else class="text-slate-400 dark:text-slate-600 italic text-xs">
        Uncategorized
      </span>
    </td>

    <td class="py-3.5 px-6 font-bold text-slate-900 dark:text-slate-100 font-mono">
      ${{ parseFloat(product.price).toFixed(2) }}
    </td>
    
    <td class="py-3.5 px-6 whitespace-nowrap">
      <span 
        v-if="product.qty < 5" 
        class="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40"
      >
        <AlertTriangleIcon class="w-3 h-3" /> 
        {{ product.qty }} Critical
      </span>
      
      <span 
        v-else-if="product.qty < 20" 
        class="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40"
      >
        {{ product.qty }} Low Stock
      </span>
      
      <span 
        v-else 
        class="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40"
      >
        {{ product.qty }} Healthy
      </span>
    </td>

    <td class="py-3.5 px-6 text-right space-x-2 whitespace-nowrap">
      <button 
        @click="$emit('edit', product)" 
        type="button"
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-md transition-colors cursor-pointer"
      >
        <PencilIcon class="w-3.5 h-3.5" />
        Edit
      </button>
      
      <button 
        @click="$emit('delete', product.id)" 
        type="button"
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-rose-400 hover:text-white dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-rose-600 rounded-md transition-colors cursor-pointer"
      >
        <Trash2Icon class="w-3.5 h-3.5" />
        Delete
      </button>
    </td>
  </tr>
</template>

<script setup>
import { ImageIcon, AlertTriangleIcon, PencilIcon, Trash2Icon } from "lucide-vue-next";

defineProps({
  product: { type: Object, required: true }
});

defineEmits(["edit", "delete"]);
</script>