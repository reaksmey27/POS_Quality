<template>
  <tr class="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors duration-100 group">
    <td class="py-3.5 px-6 font-mono text-xs text-slate-400 dark:text-slate-500">
      {{ category.id }}
    </td>
    
    <td class="py-3.5 px-6 font-semibold text-slate-900 dark:text-white tracking-tight text-sm">
      {{ category.name }}
    </td>
    
    <td class="py-3.5 px-6 text-slate-500 dark:text-slate-400 max-w-md truncate text-sm">
      {{ category.description || "—" }}
    </td>
    
    <td class="py-3.5 px-6 text-right space-x-2 whitespace-nowrap">
      <button 
        type="button"
        @click="handleEdit" 
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-md transition-colors cursor-pointer"
        :aria-label="`Edit category ${category.name}`"
      >
        <PencilIcon class="w-3.5 h-3.5" />
        Edit
      </button>
      
      <button 
        type="button"
        @click="handleDelete" 
        class="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-rose-400 hover:text-white dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-red-600 dark:hover:bg-rose-600 rounded-md transition-colors cursor-pointer"
        :aria-label="`Delete category ${category.name}`"
      >
        <Trash2Icon class="w-3.5 h-3.5" />
        Delete
      </button>
    </td>
  </tr>
</template>

<script setup>
import { PencilIcon, Trash2Icon } from "lucide-vue-next";

const props = defineProps({
  category: { type: Object, required: true }
});

const emit = defineEmits(["edit", "delete"]);

const handleEdit = () => {
  emit("edit", props.category);
};

const handleDelete = () => {
  emit("delete", props.category.id);
};
</script>