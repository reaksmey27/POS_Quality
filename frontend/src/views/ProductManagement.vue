<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 text-slate-800 dark:text-slate-100 transition-colors duration-150">
    
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Products
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage and track your retail product inventory.
        </p>
      </div>
      <div>
        <button
          @click="openModal(null)"
          type="button"
          class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors duration-150 cursor-pointer select-none"
        >
          <PlusIcon class="w-4 h-4" />
          Add Product
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative w-full max-w-xs">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <SearchIcon class="w-4 h-4" />
          </span>
          <input
            v-model="search"
            type="text"
            @input="handleSearchInput"
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Search products..."
          />
        </div>
        <div class="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
          Showing
          <span class="font-bold text-slate-800 dark:text-slate-200">{{ filtered.length }}</span>
          items
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
        <Loader2Icon class="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mb-2" />
        <p class="text-sm font-medium">Syncing warehouse quantities...</p>
      </div>

      <div v-else-if="paginatedProducts.length === 0" class="flex flex-col items-center justify-center py-20 text-center px-4">
        <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 mb-3 border border-slate-200/50 dark:border-slate-700/50">
          <PackageIcon class="w-6 h-6" />
        </div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-200">
          No products discovered
        </h3>
        <p class="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Try adjusting your active search text string filtering criteria.
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/20 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] select-none">
              <th class="py-3 px-6 w-20">SKU ID</th>
              <th class="py-3 px-6">Product Details</th>
              <th class="py-3 px-6">Category Group</th>
              <th class="py-3 px-6">Price</th>
              <th class="py-3 px-6">Stock Level</th>
              <th class="py-3 px-6 text-right w-44">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <ProductRow
              v-for="p in paginatedProducts"
              :key="p.id"
              :product="p"
              @edit="openModal"
              @delete="remove"
            />
          </tbody>
        </table>
      </div>

      <div
        v-if="!loading && filtered.length > 0"
        class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-800/10 select-none"
      >
        <div class="text-xs text-slate-500 dark:text-slate-400">
          Showing page
          <span class="font-semibold text-slate-800 dark:text-slate-200">{{ currentPage }}</span> of
          <span class="font-semibold text-slate-800 dark:text-slate-200">{{ totalPages }}</span>
        </div>
        
        <div class="inline-flex items-center gap-1.5">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            type="button"
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon class="w-3.5 h-3.5" />
            Previous
          </button>

          <button
            v-if="currentPage > 1"
            @click="currentPage--"
            type="button"
            class="w-8 h-8 text-xs font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {{ currentPage - 1 }}
          </button>

          <button
            type="button"
            class="w-8 h-8 text-xs font-black text-white bg-indigo-600 rounded-lg pointer-events-none shadow-sm"
          >
            {{ currentPage }}
          </button>

          <button
            v-if="currentPage < totalPages"
            @click="currentPage++"
            type="button"
            class="w-8 h-8 text-xs font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {{ currentPage + 1 }}
          </button>

          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            type="button"
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRightIcon class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>

    <ProductModal
      v-if="showModal"
      :is-editing="!!editing"
      :initial-data="editing"
      :categories="categories"
      :saving="saving"
      :error="modalError"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";

import {
  PlusIcon,
  SearchIcon,
  Loader2Icon,
  PackageIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-vue-next";

import ProductRow from "@/components/products/ProductRow.vue";
import ProductModal from "@/components/products/ProductModal.vue";

// -----------------------------------------------------------------------------
// Core Component Reactive State Pools
// -----------------------------------------------------------------------------
const products = ref([]);
const categories = ref([]);
const loading = ref(false);
const showModal = ref(false);
const editing = ref(null);
const saving = ref(false);
const modalError = ref("");
const search = ref("");

const currentPage = ref(1);
const itemsPerPage = ref(8);

// -----------------------------------------------------------------------------
// Data Grid Sorting and Filtration Pipes
// -----------------------------------------------------------------------------
const filtered = computed(() => {
  const queryToken = search.value.trim().toLowerCase();
  if (!queryToken) return products.value;

  return products.value.filter((p) => {
    const fallbackName = p.name || "";
    return fallbackName.toLowerCase().includes(queryToken);
  });
});

const totalPages = computed(() => {
  return Math.ceil(filtered.value.length / itemsPerPage.value) || 1;
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filtered.value.slice(start, end);
});

// -----------------------------------------------------------------------------
// Sync UI Mutation Handlers
// -----------------------------------------------------------------------------
const handleSearchInput = () => {
  currentPage.value = 1;
};

const openModal = (productTarget = null) => {
  editing.value = productTarget;
  modalError.value = "";
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editing.value = null;
};

// -----------------------------------------------------------------------------
// Async Network Ingress Middleware Integration Triggers
// -----------------------------------------------------------------------------
const handleSave = async (formData) => {
  const normalizedName = formData.name?.trim();
  
  if (!normalizedName || formData.price === undefined || formData.price === null) {
    modalError.value = "Name and price fields are required parameters.";
    return;
  }

  saving.value = true;
  modalError.value = "";
  
  try {
    const payload = {
      name: normalizedName,
      image: formData.image || null,
      price: Number(formData.price),
      qty: Math.max(0, parseInt(formData.qty, 10) || 0),
      category_id: formData.category_id ? Number(formData.category_id) : null,
    };

    if (editing.value) {
      await api.put(`/products/${editing.value.id}`, payload);
    } else {
      await api.post("/products", payload);
    }

    await loadInventory();
    closeModal();
  } catch (err) {
    modalError.value = err.response?.data?.message || "Failed to persist database mutations.";
  } finally {
    saving.value = false;
  }
};

const remove = async (id) => {
  if (!confirm("Are you sure you want to completely drop this item from inventory logs?")) return;
  try {
    await api.delete(`/products/${id}`);
    await loadInventory();
    
    // Boundary structural drop calculation fallback mapping logic
    if (paginatedProducts.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
  } catch (err) {
    alert(err.response?.data?.message || "Internal repository server failure dropped processing call.");
  }
};

const loadInventory = async () => {
  loading.value = true;
  try {
    const [pRes, cRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
    ]);
    products.value = pRes.data?.data || [];
    categories.value = cRes.data?.data || [];
  } catch (err) {
    console.error("An error occurred during warehouse dependency repository fetching sequence: ", err);
    products.value = [];
    categories.value = [];
  } finally {
    loading.value = false;
  }
};

// -----------------------------------------------------------------------------
// Component Lifecycle Hooks Lifecycle Entry
// -----------------------------------------------------------------------------
onMounted(loadInventory);
</script>