<template>
  <div 
    @click.self="handleClose" 
    class="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors duration-150"
  >
    <form 
      @submit.prevent="handleSubmit"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
    >
      
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20 select-none">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {{ isEditing ? "Edit Product Details" : "Create New Product" }}
        </h3>
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
        
        <div 
          v-if="error" 
          class="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400 rounded-xl text-sm flex items-start gap-2 animate-in slide-in-from-top-2 duration-100"
          role="alert"
        >
          <AlertCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
          <span class="font-medium">{{ error }}</span>
        </div>

        <div class="space-y-1.5">
          <label for="product-name-field" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
            Product Name
          </label>
          <input 
            id="product-name-field"
            v-model.trim="localForm.name" 
            required
            type="text"
            :disabled="saving"
            class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            placeholder="e.g. Wireless Mechanical Keyboard" 
          />
        </div>

        <div class="space-y-1.5">
          <label for="product-image-field" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
            Product Image URL
          </label>
          <div class="flex gap-2">
            <div class="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 select-none">
              <img v-if="localForm.image" :src="localForm.image" class="w-full h-full object-cover" alt="Asset preview micro-thumbnail" />
              <ImageIcon v-else class="w-4 h-4 text-slate-300 dark:text-slate-700 stroke-1.5" />
            </div>
            <input 
              id="product-image-field"
              v-model.trim="localForm.image" 
              type="url"
              :disabled="saving"
              class="w-full flex-1 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              placeholder="e.g. https://domain.com/images/item.png" 
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label for="product-price-field" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
              Base Price ($)
            </label>
            <input 
              id="product-price-field"
              v-model.number="localForm.price" 
              required
              type="number" 
              step="0.01" 
              min="0"
              :disabled="saving"
              class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              placeholder="0.00" 
            />
          </div>
          <div class="space-y-1.5">
            <label for="product-qty-field" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
              Opening Quantity
            </label>
            <input 
              id="product-qty-field"
              v-model.number="localForm.qty" 
              type="number" 
              min="0"
              step="1"
              :disabled="saving"
              class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              placeholder="0" 
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="product-category-field" class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider select-none">
            Category Classification
          </label>
          <div class="relative">
            <select 
              id="product-category-field"
              v-model="localForm.category_id" 
              :disabled="saving"
              class="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <option value="" class="dark:bg-slate-900">No category selected</option>
              <option v-for="c in categories" :key="c.id" :value="c.id" class="dark:bg-slate-900">
                {{ c.name }}
              </option>
            </select>
            <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <ChevronDownIcon class="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0 select-none">
        <button 
          type="button"
          @click="handleClose" 
          :disabled="saving"
          class="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          type="submit"
          :disabled="isSubmitDisabled"
          class="inline-flex items-center justify-center min-w-[90px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Loader2Icon v-if="saving" class="w-4 h-4 animate-spin mr-1.5" />
          <span>{{ saving ? "Saving..." : "Save Item" }}</span>
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from "vue";
import { XIcon, AlertCircleIcon, ChevronDownIcon, ImageIcon, Loader2Icon } from "lucide-vue-next";

const props = defineProps({
  initialData: { type: Object, default: null },
  isEditing: { type: Boolean, default: false },
  categories: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false },
  error: { type: String, default: "" }
});

const emit = defineEmits(["close", "save"]);

const localForm = reactive({
  name: "",
  image: "",
  price: "",
  qty: 0,
  category_id: ""
});

const resetFormState = () => {
  localForm.name = "";
  localForm.image = "";
  localForm.price = "";
  localForm.qty = 0;
  localForm.category_id = "";
};

const isSubmitDisabled = computed(() => {
  return props.saving || !localForm.name.trim();
});

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      localForm.name = newVal.name || "";
      localForm.image = newVal.image || "";
      localForm.price = newVal.price ?? "";
      localForm.qty = newVal.qty ?? 0;
      localForm.category_id = newVal.category_id || "";
    } else {
      resetFormState();
    }
  },
  { immediate: true }
);

// Explicit Action Handlers
const handleClose = () => {
  if (props.saving) return;
  emit("close");
};

const handleSubmit = () => {
  if (isSubmitDisabled.value) return;
  emit("save", { ...localForm });
};
</script>