<template>
  <div class="p-6 max-w-[1600px] mx-auto space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-150">
    <div class="border-b border-slate-200 dark:border-slate-800 pb-5">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Point of Sale</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Select catalog items to build a customer basket.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-8 xl:col-span-9 space-y-4">
        
        <div class="relative w-full max-w-md">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <SearchIcon class="w-4 h-4" />
          </span>
          <input
            v-model="search"
            @input="resetToFirstPage"
            class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            placeholder="Search products by title..."
          />
        </div>

        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            @click="setCategory(null)"
            type="button"
            class="px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all border cursor-pointer"
            :class="!activeCategory
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          >
            All Products
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="setCategory(cat.id)"
            type="button"
            class="px-4 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all border cursor-pointer"
            :class="activeCategory === cat.id
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'"
          >
            {{ cat.name }}
          </button>
        </div>

        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-300 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
        >
          <Loader2Icon class="w-8 h-8 animate-spin text-indigo-600 mb-2" />
          <p class="text-sm font-medium">Populating catalog items...</p>
        </div>

        <div v-else class="space-y-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            <ProductCard
              v-for="p in paginatedProducts"
              :key="p.id"
              :product="p"
              :cart-qty="getItemQtyInCart(p.id)"
              @add-to-cart="addToCart"
            />
          </div>

          <div 
            v-if="filteredProducts.length > 0" 
            class="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 px-2"
          >
            <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing <span class="font-bold text-slate-800 dark:text-slate-200">{{ startIndex + 1 }}</span> to 
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ Math.min(endIndex, filteredProducts.length) }}</span> of 
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ filteredProducts.length }}</span> products
            </div>

            <div class="flex items-center gap-1">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Prev
              </button>
              
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                class="w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer"
                :class="currentPage === page
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'"
              >
                {{ page }}
              </button>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="!loading && filteredProducts.length === 0"
          class="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center"
        >
          <PackageXIcon class="w-10 h-10 text-slate-400 mb-2" />
          <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-200">No matching items</h4>
          <p class="text-xs text-slate-400 mt-0.5">Try altering your search keywords or active tab filter presets.</p>
        </div>
      </div>

      <div class="lg:col-span-4 xl:col-span-3">
        <CartPane
          :cart="cart"
          :total="total"
          :checkout-loading="checkoutLoading"
          @increase="increaseQty"
          @decrease="decreaseQty"
          @clear="clearCart"
          @checkout="openPaymentGateway"
        />
      </div>
    </div>

    <PaymentModal
      v-if="showPaymentModal"
      :total="total"
      :checkout-loading="checkoutLoading"
      @close="showPaymentModal = false"
      @confirm-checkout="executeCheckout"
    />

    <SuccessModal
      v-if="successOrder"
      :order="successOrder"
      @close="successOrder = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "@/services/api";
import { SearchIcon, Loader2Icon, PackageXIcon } from "lucide-vue-next";

import ProductCard from "@/components/pos/ProductCard.vue";
import CartPane from "@/components/pos/CartPane.vue";
import PaymentModal from "@/components/pos/PaymentModal.vue";
import SuccessModal from "@/components/pos/SuccessModal.vue";

const products = ref([]);
const categories = ref([]);
const cart = ref([]);
const search = ref("");
const activeCategory = ref(null);
const loading = ref(false);
const checkoutLoading = ref(false);

const showPaymentModal = ref(false);
const successOrder = ref(null);

// 📑 PAGINATION CONFIGURATION STATE VALUES
const currentPage = ref(1);
const itemsPerPage = ref(8); // Displays 8 perfectly matching products per grid view sheet

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.value.toLowerCase());
    const matchCat = !activeCategory.value || p.category_id === activeCategory.value;
    return matchSearch && matchCat;
  });
});

// Calculate metrics indexes dynamically
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 1);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => startIndex.value + itemsPerPage.value);

// Returns only the current section window slice of array items
const paginatedProducts = computed(() => {
  return filteredProducts.value.slice(startIndex.value, endIndex.value);
});

const resetToFirstPage = () => {
  currentPage.value = 1;
};

const setCategory = (catId) => {
  activeCategory.value = catId;
  resetToFirstPage();
};

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0),
);

const getItemQtyInCart = (productId) => {
  const row = cart.value.find((i) => i.id === productId);
  return row ? row.qty : 0;
};

const addToCart = (product) => {
  if (product.qty === 0) return;
  const existing = cart.value.find((i) => i.id === product.id);
  if (existing) {
    if (existing.qty < product.qty) existing.qty++;
  } else {
    cart.value.push({ ...product, qty: 1, stock: product.qty });
  }
};

const increaseQty = (item) => {
  if (item.qty < item.stock) item.qty++;
};

const decreaseQty = (item) => {
  if (item.qty > 1) item.qty--;
  else cart.value = cart.value.filter((i) => i.id !== item.id);
};

const clearCart = () => {
  cart.value = [];
};

const loadProducts = async () => {
  const { data } = await api.get("/products");
  products.value = data.data;
};

const openPaymentGateway = () => {
  showPaymentModal.value = true;
};

const executeCheckout = async (paymentPayload) => {
  checkoutLoading.value = true;
  try {
    const itemsPayload = cart.value.map((i) => ({
      product_id: Number(i.id),
      qty: Number(i.qty),
    }));

    const requestBody = {
      items: itemsPayload,
      payment_method: String(paymentPayload.method),
      amount_paid: Number(paymentPayload.tendered),
    };

    const { data } = await api.post("/orders", requestBody, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    showPaymentModal.value = false;
    successOrder.value = data.data;
    cart.value = [];
    await loadProducts();
    resetToFirstPage();
  } catch (err) {
    console.error("❌ Full Server Rejection Payload:", err.response?.data);
    const serverMsg = err.response?.data?.message || "Checkout execution halted";
    const validationDetails = err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : "";
    alert(`${serverMsg}\n${validationDetails}`);
  } finally {
    checkoutLoading.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const [pRes, cRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories"),
    ]);
    products.value = pRes.data.data;
    categories.value = cRes.data.data;
  } catch (err) {
    console.error("Failed loading base dependencies repositories:", err);
  } finally {
    loading.value = false;
  }
});
</script>