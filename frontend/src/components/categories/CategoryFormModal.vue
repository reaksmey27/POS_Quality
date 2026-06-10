<template>
  <div 
    @click.self="handleCancel" 
    class="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors duration-150"
  >
    <form 
      @submit.prevent="handleSubmit"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
    >
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {{ isEditMode ? "Edit Category" : "Add Category" }}
        </h3>
        <button 
          type="button"
          :disabled="saving"
          @click="handleCancel" 
          class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close modal"
        >
          <XIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6 space-y-4">
        <div 
          v-if="error" 
          class="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-100"
          role="alert"
        >
          <AlertCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
          <span class="font-medium">{{ error }}</span>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Name <span class="text-rose-500">*</span>
          </label>
          <input 
            v-model="form.name" 
            type="text"
            required
            :disabled="saving"
            placeholder="e.g. Electronics" 
            class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900" 
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</label>
          <textarea 
            v-model="form.description" 
            rows="3"
            :disabled="saving"
            placeholder="Optional description of the category..." 
            class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-colors disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900" 
          />
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
        <button 
          type="button"
          :disabled="saving"
          @click="handleCancel" 
          class="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button 
          type="submit"
          :disabled="saving"
          class="inline-flex items-center justify-center min-w-[80px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Loader2Icon v-if="saving" class="w-4 h-4 animate-spin mr-1.5" />
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch, computed } from "vue";
import api from "@/services/api";
import { XIcon, AlertCircleIcon, Loader2Icon } from "lucide-vue-next";

// Component Props & Emits
const props = defineProps({
  category: { type: Object, default: null }
});

const emit = defineEmits(["close", "saved"]);

// Component State
const saving = ref(false);
const error = ref("");
const form = reactive({ name: "", description: "" });

// Computed State
const isEditMode = computed(() => !!props.category?.id);

// Synchronizes incoming prop payloads with reactive form values
const syncFormWithProps = (catData) => {
  form.name = catData?.name || "";
  form.description = catData?.description || "";
  error.value = "";
};

// Immediate watch handles the initial mount synchronization AND deep change tracking efficiently
watch(
  () => props.category,
  (newCategory) => {
    syncFormWithProps(newCategory);
  },
  { immediate: true }
);

// Actions
const handleCancel = () => {
  if (saving.value) return;
  emit("close");
};

const handleSubmit = async () => {
  const trimmedName = form.name.trim();
  if (!trimmedName) { 
    error.value = "Name is required"; 
    return; 
  }
  
  saving.value = true; 
  error.value = "";
  
  try {
    const payload = {
      name: trimmedName,
      description: form.description?.trim() || null
    };

    if (isEditMode.value) {
      await api.put(`/categories/${props.category.id}`, payload);
    } else {
      await api.post("/categories", payload);
    }
    
    emit("saved");
  } catch (err) {
    error.value = err.response?.data?.message || "An unexpected error occurred while saving";
  } finally { 
    saving.value = false; 
  }
};
</script>