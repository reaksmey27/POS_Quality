<template>
  <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-100 group">
    
    <td class="py-3.5 px-6 font-mono text-xs text-slate-400 dark:text-slate-500">
      {{ product.id }}
    </td>
    
    <td class="py-3.5 px-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 select-none">
          <img 
            v-if="product.image" 
            :src="product.image" 
            :alt="product.name" 
            class="w-full h-full object-cover" 
          />
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
      <span v-else class="text-slate-400 dark:text-slate-600 italic text-xs select-none">
        Uncategorized
      </span>
    </td>

    <td class="py-3.5 px-6 font-bold text-slate-900 dark:text-slate-100 font-mono">
      ${{ formattedPrice }}
    </td>
    
    <td class="py-3.5 px-6 whitespace-nowrap">
      <span 
        class="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border"
        :class="stockMetrics.classes"
      >
        <AlertTriangleIcon v-if="stockMetrics.isCritical" class="w-3 h-3 shrink-0" /> 
        {{ product.qty }} {{ stockMetrics.label }}
      </span>
    </td>

    <td class="py-3.5 px-6 text-right space-x-2 whitespace-nowrap">
      <button 
        type="button"
        @click="handleEdit" 
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-md transition-colors cursor-pointer"
        :aria-label="`Edit details for ${product.name}`"
      >
        <PencilIcon class="w-3.5 h-3.5" />
        <span>Edit</span>
      </button>
      
      <button 
        type="button"
        @click="handleDelete" 
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-rose-400 hover:text-white dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-rose-600 rounded-md transition-colors cursor-pointer"
        :aria-label="`Delete ${product.name} from inventory`"
      >
        <Trash2Icon class="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>
    </td>
  </tr>
</template>

<script setup>
import { computed } from "vue";
import { ImageIcon, AlertTriangleIcon, PencilIcon, Trash2Icon } from "lucide-vue-next";

const props = defineProps({
  product: { type: Object, required: true }
});

const emit = defineEmits(["edit", "delete"]);

const formattedPrice = computed(() => {
  const numericValue = parseFloat(props.product?.price);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : "0.00";
});

const stockMetrics = computed(() => {
  const quantity = parseInt(props.product?.qty, 10) || 0;

  if (quantity < 5) {
    return {
      label: "Critical",
      classes: "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40",
      isCritical: true
    };
  }
  
  if (quantity < 20) {
    return {
      label: "Low Stock",
      classes: "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40",
      isCritical: false
    };
  }

  return {
    label: "Healthy",
    classes: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40",
    isCritical: false
  };
});

const handleEdit = () => {
  emit("edit", props.product);
};

const handleDelete = () => {
  if (!props.product?.id) return;
  emit("delete", props.product.id);
};
</script>