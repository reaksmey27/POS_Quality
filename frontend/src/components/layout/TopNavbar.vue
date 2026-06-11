<template>
  <header
    class="sticky top-0 z-30 bg-white/95 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800"
  >
    <div class="h-16 px-4 sm:px-6 flex items-center gap-3">
      <!-- Left: Breadcrumbs -->
      <div class="min-w-0 flex-1">
        <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <RouterLink
            v-if="breadcrumbs.length"
            to="/dashboard"
            class="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </RouterLink>

          <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.key">
            <ChevronRightIcon
              class="w-4 h-4 text-slate-400 dark:text-slate-600"
            />
            <span
              class="truncate font-semibold text-slate-700 dark:text-slate-200"
              :title="crumb.label"
            >
              {{ crumb.label }}
            </span>
          </template>

          <span
            v-if="breadcrumbs.length === 0"
            class="font-semibold text-slate-700 dark:text-slate-200"
          >
            Dashboard
          </span>
        </nav>
      </div>

      <!-- Center: Global Search -->
      <div class="relative flex-1 flex justify-center" style="max-width: 520px">
        <div class="w-full">
          <div class="relative">
            <span
              class="absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none"
            >
              <SearchIcon class="w-4 h-4" />
            </span>
            <input
              v-model="query"
              type="text"
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="Search products, orders, users..."
              @focus="openDropdown = true"
              @keydown.esc="closeDropdown"
            />

            <button
              v-if="query"
              type="button"
              class="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
              @click="
                query = '';
                closeDropdown();
              "
              aria-label="Clear search"
            >
              <XIcon class="w-4 h-4" />
            </button>
          </div>

          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="openDropdown && query.trim()"
              ref="dropdownRef"
              class="absolute left-0 right-0 mt-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
            >
              <div class="p-3">
                <div
                  v-if="loading"
                  class="text-sm text-slate-500 dark:text-slate-400"
                >
                  Searching...
                </div>

                <div
                  v-else-if="
                    !groupedResults.products.length &&
                    !groupedResults.orders.length &&
                    !groupedResults.users.length
                  "
                  class="text-sm text-slate-500 dark:text-slate-400"
                >
                  No results.
                </div>

                <div v-else class="space-y-3">
                  <div v-if="groupedResults.products.length" class="space-y-1">
                    <div
                      class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2"
                    >
                      Products
                    </div>
                    <button
                      v-for="p in groupedResults.products"
                      :key="`p-${p.id}`"
                      type="button"
                      class="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      @click="goTo('/products')"
                    >
                      <div
                        class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate"
                      >
                        {{ p.name }}
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">
                        SKU: {{ p.sku || p.id }}
                      </div>
                    </button>
                  </div>

                  <div v-if="groupedResults.orders.length" class="space-y-1">
                    <div
                      class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2"
                    >
                      Orders
                    </div>
                    <button
                      v-for="o in groupedResults.orders"
                      :key="`o-${o.id}`"
                      type="button"
                      class="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      @click="goTo('/orders')"
                    >
                      <div
                        class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate"
                      >
                        Order #{{ o.id }}
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">
                        {{ o.status }}
                      </div>
                    </button>
                  </div>

                  <div v-if="groupedResults.users.length" class="space-y-1">
                    <div
                      class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2"
                    >
                      Users
                    </div>
                    <button
                      v-for="u in groupedResults.users"
                      :key="`u-${u.id}`"
                      type="button"
                      class="w-full text-left px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      @click="goTo('/users')"
                    >
                      <div
                        class="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate"
                      >
                        {{ u.name }}
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400">
                        {{ u.email }}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="px-3 py-2 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800"
              >
                <div
                  class="text-xs text-slate-500 dark:text-slate-400 select-none"
                >
                  Tip: Use the Management menus to view full results.
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Right: Notifications + Avatar -->
      <div class="flex items-center gap-3">
        <div class="relative">
          <button
            type="button"
            class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            @click.stop="toggleNotifications"
            aria-label="Open notifications"
          >
            <BellIcon class="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>

          <span
            v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm"
          >
            {{ unreadCount > 99 ? "99+" : unreadCount }}
          </span>

          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="notificationsOpen"
              ref="notificationsRef"
              class="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden z-50"
            >
              <div
                class="px-4 py-3 border-b border-slate-200 dark:border-slate-800"
              >
                <div class="flex items-center justify-between gap-3">
                  <div
                    class="text-sm font-bold text-slate-800 dark:text-slate-100"
                  >
                    Notifications
                  </div>
                  <button
                    type="button"
                    class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                    @click="markAllAsRead"
                  >
                    Mark all read
                  </button>
                </div>
              </div>

              <div
                v-if="loadingNotifications"
                class="p-4 text-sm text-slate-500 dark:text-slate-400"
              >
                Loading...
              </div>

              <div
                v-else-if="notifications.length === 0"
                class="p-4 text-sm text-slate-500 dark:text-slate-400"
              >
                You're all caught up.
              </div>

              <div v-else class="max-h-80 overflow-y-auto">
                <button
                  v-for="n in notifications.slice(0, 20)"
                  :key="n.id"
                  type="button"
                  class="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800"
                >
                  <div
                    class="text-sm font-semibold text-slate-800 dark:text-slate-100"
                  >
                    {{ n.message }}
                  </div>
                  <div
                    v-if="n.createdAt"
                    class="text-xs text-slate-500 dark:text-slate-400 mt-1"
                  >
                    {{ new Date(n.createdAt).toLocaleString() }}
                  </div>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <div class="relative">
          <button
            type="button"
            class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm font-bold"
            @click.stop="toggleAvatarDropdown"
            aria-label="Open user menu"
          >
            <span class="text-sm">{{ initials }}</span>
          </button>

          <transition
            enter-active-class="transition ease-out duration-150"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-100"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="avatarOpen"
              ref="avatarRef"
              class="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
            >
              <RouterLink
                to="/"
                class="block px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                @click="avatarOpen = false"
              >
                Profile
              </RouterLink>

              <button
                type="button"
                class="block w-full text-left px-4 py-3 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                @click="logout"
              >
                Logout
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/stores/auth.store";
import { useNotificationStore } from "@/stores/useNotificationStore";

import { ChevronRightIcon, SearchIcon, XIcon, BellIcon } from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const notificationStore = useNotificationStore();
const {
  notifications,
  unreadCount,
  loading: loadingNotifications,
  markAllAsRead,
} = (() => {
  const s = storeToRefs(notificationStore);
  return {
    notifications: s.notifications,
    unreadCount: s.unreadCount,
    loadingNotifications: s.loading,
    markAllAsRead: notificationStore.markAllAsRead,
  };
})();

const notificationsOpen = ref(false);
const avatarOpen = ref(false);
const openDropdown = ref(false);

const dropdownRef = ref<HTMLElement | null>(null);
const notificationsRef = ref<HTMLElement | null>(null);
const avatarRef = ref<HTMLElement | null>(null);

const query = ref("");
const loading = ref(false);

const groupedResults = ref({
  products: [] as Array<any>,
  orders: [] as Array<any>,
  users: [] as Array<any>,
});

const breadcrumbs = computed(() => {
  const labelsByName: Record<string, string> = {
    Dashboard: "Dashboard",
    POS: "Cashier POS",
    Products: "Management / Products",
    Categories: "Management / Categories",
    Orders: "Management / Orders",
    Reports: "Reports",
    Users: "Settings / Users Management",
  };

  const name = route.name ? String(route.name) : "";
  const primary = name ? labelsByName[name] : "";
  if (primary) {
    const parts = primary
      .split("/")
      .map((s) => s.trim())
      .filter(Boolean);

    return parts.map((label, idx) => ({
      key: `${name}-${idx}`,
      label,
    }));
  }

  const path = route.path.replace(/^\//, "");
  if (!path) return [];

  const parts = path.split("/").filter(Boolean);

  const labelsByKey: Record<string, string> = {
    dashboard: "Dashboard",
    pos: "Cashier POS",
    products: "Products",
    categories: "Categories",
    orders: "Orders",
    reports: "Reports",
    users: "Users",
  };

  return parts.map((p) => ({
    key: p,
    label: labelsByKey[p] ?? p,
  }));
});

const initials = computed(() => {
  const name = auth.user?.name || "User";
  const parts = String(name).trim().split(/\s+/g);
  const first = parts[0]?.[0] ?? "U";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + second).toUpperCase();
});

let searchTimer: any = null;

const closeDropdown = () => {
  openDropdown.value = false;
};

const toggleNotifications = async () => {
  notificationsOpen.value = !notificationsOpen.value;
  if (notificationsOpen.value && notifications.value.length === 0) {
    await notificationStore.fetchNotifications();
  }
};

const toggleAvatarDropdown = () => {
  avatarOpen.value = !avatarOpen.value;
};

const logout = () => {
  auth.logout();
  router.push("/login");
};

const goTo = (path: string) => {
  closeDropdown();
  notificationsOpen.value = false;
  avatarOpen.value = false;
  router.push(path);
};

watch(
  () => query.value,
  async (val) => {
    openDropdown.value = true;
    const token = val.trim().toLowerCase();

    if (searchTimer) clearTimeout(searchTimer);

    if (!token) {
      groupedResults.value = { products: [], orders: [], users: [] };
      return;
    }

    loading.value = true;

    searchTimer = setTimeout(async () => {
      try {
        const api = await import("@/services/api");
        const resProd = await api.default.get("/products");
        const resOrders = await api.default.get("/orders");
        const resUsers = await api.default.get("/users");

        const products = resProd.data?.data ?? [];
        const orders = resOrders.data?.data ?? [];
        const users = resUsers.data?.data ?? [];

        groupedResults.value = {
          products: products
            .filter((p: any) =>
              String(p.name ?? "")
                .toLowerCase()
                .includes(token),
            )
            .slice(0, 4),
          orders: orders
            .filter((o: any) =>
              String(o.id ?? o.order_id ?? "")
                .toLowerCase()
                .includes(token),
            )
            .slice(0, 4),
          users: users
            .filter(
              (u: any) =>
                String(u.name ?? "")
                  .toLowerCase()
                  .includes(token) ||
                String(u.email ?? "")
                  .toLowerCase()
                  .includes(token),
            )
            .slice(0, 4),
        };
      } catch {
        groupedResults.value = { products: [], orders: [], users: [] };
      } finally {
        loading.value = false;
      }
    }, 250);
  },
  { immediate: false },
);

const onClickOutside = (e: MouseEvent) => {
  const target = e.target as Node;

  const dropdownEl = dropdownRef.value;
  const notifEl = notificationsRef.value;
  const avatarEl = avatarRef.value;

  if (dropdownEl && openDropdown.value && !dropdownEl.contains(target))
    openDropdown.value = false;
  if (notifEl && notificationsOpen.value && !notifEl.contains(target))
    notificationsOpen.value = false;
  if (avatarEl && avatarOpen.value && !avatarEl.contains(target))
    avatarOpen.value = false;
};

onMounted(async () => {
  document.addEventListener("click", onClickOutside);
  try {
    await notificationStore.fetchNotifications();
  } catch {
    // ignore
  }
});

onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});
</script>
