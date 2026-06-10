<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Categories</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and organize your product categories.</p>
      </div>
      <div>
        <button 
          @click="openFormModal(null)" 
          type="button"
          class="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors duration-150 cursor-pointer"
        >
          <PlusIcon class="w-4 h-4" />
          Add Category
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="relative w-full max-w-xs">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-600">
            <SearchIcon class="w-4 h-4" />
          </span>
          <input 
            v-model="search" 
            type="text"
            @input="handleSearchInput"
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
            placeholder="Search categories..." 
          />
        </div>
        <div class="text-xs font-medium text-slate-500 dark:text-slate-400 select-none">
          Showing <span class="font-bold text-slate-800 dark:text-slate-200">{{ filtered.length }}</span> items
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
        <Loader2Icon class="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-500 mb-2" />
        <p class="text-sm">Loading categories...</p>
      </div>

      <div v-else-if="paginatedCategories.length === 0" class="flex flex-col items-center justify-center py-16 text-center px-4">
        <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-600 mb-3 border border-slate-200/40 dark:border-slate-800">
          <FolderOpenIcon class="w-6 h-6" />
        </div>
        <h3 class="text-sm font-bold text-slate-900 dark:text-white tracking-tight">No categories found</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">Try adjusting your search criteria or create a new category.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] select-none">
              <th class="py-3 px-6 w-20">ID</th>
              <th class="py-3 px-6">Name</th>
              <th class="py-3 px-6">Description</th>
              <th class="py-3 px-6 text-right w-40">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
            <CategoryRow 
              v-for="c in paginatedCategories" 
              :key="c.id" 
              :category="c" 
              @edit="openFormModal" 
              @delete="removeCategory" 
            />
          </tbody>
        </table>
      </div>

      <div v-if="!loading && filtered.length > 0" class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-slate-950/20 select-none">
        <div class="text-xs text-slate-500 dark:text-slate-400">
          Showing page <span class="font-bold text-slate-800 dark:text-slate-200">{{ currentPage }}</span> of <span class="font-bold text-slate-800 dark:text-slate-200">{{ totalPages }}</span>
        </div>
        <div class="inline-flex items-center gap-1.5">
          <button 
            @click="currentPage--" 
            type="button"
            :disabled="currentPage === 1"
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 dark:disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon class="w-3.5 h-3.5" />
            Previous
          </button>
          
          <button 
            @click="currentPage--" 
            type="button"
            v-if="currentPage > 1"
            class="w-8 h-8 text-xs font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {{ currentPage - 1 }}
          </button>
          
          <button type="button" class="w-8 h-8 text-xs font-black text-white bg-indigo-600 rounded-lg pointer-events-none shadow-sm">
            {{ currentPage }}
          </button>
          
          <button 
            @click="currentPage++" 
            type="button"
            v-if="currentPage < totalPages"
            class="w-8 h-8 text-xs font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {{ currentPage + 1 }}
          </button>

          <button 
            @click="currentPage++" 
            type="button"
            :disabled="currentPage === totalPages"
            class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 dark:disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRightIcon class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <CategoryFormModal 
      v-if="showModal" 
      :category="selectedCategory" 
      @close="closeFormModal" 
      @saved="handleCategorySaveSuccess" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";

import { 
  PlusIcon, 
  FolderOpenIcon, 
  Loader2Icon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-vue-next";

import CategoryRow from "@/components/categories/CategoryRow.vue";
import CategoryFormModal from "@/components/categories/CategoryFormModal.vue";

// -----------------------------------------------------------------------------
// Reactive Component State Variables Pools
// -----------------------------------------------------------------------------
const categories = ref([]);
const loading = ref(false);
const showModal = ref(false);
const selectedCategory = ref(null);
const search = ref("");

const currentPage = ref(1);
const itemsPerPage = ref(8);

// -----------------------------------------------------------------------------
// Computed Processing Filters & Slice Pagination Trees
// -----------------------------------------------------------------------------
const filtered = computed(() => {
  const token = search.value.trim().toLowerCase();
  if (!token) return categories.value;
  
  return categories.value.filter((c) => {
    const matchName = c.name?.toLowerCase().includes(token);
    const matchDesc = c.description?.toLowerCase().includes(token);
    return matchName || matchDesc;
  });
});

const totalPages = computed(() => {
  return Math.ceil(filtered.value.length / itemsPerPage.value) || 1;
});

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filtered.value.slice(start, end);
});

// -----------------------------------------------------------------------------
// Handlers & Mutator Actions Routines
// -----------------------------------------------------------------------------
const handleSearchInput = () => {
  currentPage.value = 1;
};

const openFormModal = (category = null) => {
  selectedCategory.value = category;
  showModal.value = true;
};

const closeFormModal = () => {
  showModal.value = false;
  selectedCategory.value = null;
};

const handleCategorySaveSuccess = async () => {
  await loadCategories();
  closeFormModal();
};

const removeCategory = async (id) => {
  if (!confirm("Are you sure you want to delete this category?")) return;
  try { 
    await api.delete(`/categories/${id}`); 
    await loadCategories(); 
    
    // Safety Fallback Guard: Adjust bounding scope step backwards if index target is lost
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  } catch (err) { 
    alert(err.response?.data?.message || "Failed to complete processing operations logic for data entry deletion."); 
  }
};

const loadCategories = async () => {
  loading.value = true;
  try { 
    const response = await api.get("/categories");
    categories.value = response.data?.data || []; 
  } catch (err) {
    console.error("Failed loading categories dataset repository:", err);
    categories.value = [];
  } finally { 
    loading.value = false; 
  }
};

// -----------------------------------------------------------------------------
// Life-cycle Ingress Initializations Hooks
// -----------------------------------------------------------------------------
onMounted(loadCategories);
</script>