<template>
  <div 
    @click.self="$emit('close')" 
    class="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors duration-150"
  >
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
      
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {{ category ? "Edit Category" : "Add Category" }}
        </h3>
        <button 
          @click="$emit('close')" 
          type="button"
          class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        
        <div 
          v-if="error" 
          class="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-100"
        >
          <AlertCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
          <span class="font-medium">{{ error }}</span>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</label>
          <input 
            v-model="form.name" 
            type="text"
            class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
            placeholder="e.g. Electronics" 
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</label>
          <textarea 
            v-model="form.description" 
            rows="3"
            class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors" 
            placeholder="Optional description of the category..." 
          />
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
        <button 
          @click="$emit('close')" 
          type="button"
          class="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit" 
          type="button"
          :disabled="saving"
          class="inline-flex items-center justify-center min-w-[80px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Loader2Icon v-if="saving" class="w-4 h-4 animate-spin mr-1.5" />
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import api from "@/services/api";
import { XIcon, AlertCircleIcon, Loader2Icon } from "lucide-vue-next";

const props = defineProps({
  category: { type: Object, default: null }
});

const emit = defineEmits(["close", "saved"]);

const saving = ref(false);
const error = ref("");
const form = reactive({ name: "", description: "" });

onMounted(() => {
  if (props.category) {
    form.name = props.category.name || "";
    form.description = props.category.description || "";
  }
});

const handleSubmit = async () => {
  if (!form.name.trim()) { 
    error.value = "Name is required"; 
    return; 
  }
  
  saving.value = true; 
  error.value = "";
  try {
    if (props.category) {
      await api.put(`/categories/${props.category.id}`, form);
    } else {
      await api.post("/categories", form);
    }
    emit("saved");
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to save";
  } finally { 
    saving.value = false; 
  }
};
</script>