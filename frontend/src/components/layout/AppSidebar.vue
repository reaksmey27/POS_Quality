<template>
  <aside class="w-full md:w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col md:fixed md:inset-y-0 md:left-0 z-40 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 transition-colors duration-200">
    
    <div class="h-16 px-6 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0">
      <div class="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
        <LayoutDashboardIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <span>POS<span class="text-indigo-600 dark:text-indigo-400 font-medium">Quality</span></span>
      </div>
    </div>

    <nav class="flex-1 p-4 space-y-4 overflow-y-auto">
      <div v-for="section in navigationMenu" :key="section.title" class="space-y-1">
        <div 
          v-if="section.title && section.items.length" 
          class="px-4 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase"
        >
          {{ section.title }}
        </div>

        <RouterLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          v-slot="{ isActive }"
        >
          <div
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer"
            :class="isActive 
              ? 'bg-indigo-600 text-white shadow-sm' 
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white'"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span>{{ item.label }}</span>
          </div>
        </RouterLink>
      </div>
    </nav>

    <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-4 shrink-0">
      <div class="flex items-center justify-between gap-3 px-1">
        <div class="truncate">
          <p class="text-sm font-bold text-slate-900 dark:text-white truncate">
            {{ auth.user?.name || "User Profile" }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize mt-0.5">
            {{ auth.roleName || "Staff" }}
          </p>
        </div>

        <button
          @click="themeStore.toggleTheme"
          type="button"
          class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
          :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <SunIcon v-if="themeStore.isDark" class="w-4 h-4 text-amber-500" />
          <MoonIcon v-else class="w-4 h-4 text-slate-500" />
        </button>
      </div>

      <button
        @click="emit('logout')"
        type="button"
        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
      >
        <LogOutIcon class="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useThemeStore } from "@/stores/theme.store";

import {
  LayoutDashboardIcon,
  BarChart3Icon,
  ShoppingCartIcon,
  PackageIcon,
  FolderOpenIcon,
  ClipboardListIcon,
  LogOutIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
} from "lucide-vue-next";

const emit = defineEmits(["logout"]);
const auth = useAuthStore();
const themeStore = useThemeStore();

const navigationMenu = computed(() => {
  const sections = [
    {
      title: "",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: BarChart3Icon },
        { to: "/pos", label: "Cashier POS", icon: ShoppingCartIcon },
      ]
    }
  ];

  if (auth.canManage) {
    const managementItems = [
      { to: "/products", label: "Products", icon: PackageIcon },
      { to: "/categories", label: "Categories", icon: FolderOpenIcon },
      { to: "/orders", label: "Orders", icon: ClipboardListIcon }
    ];
    
    sections.push({
      title: "Management",
      items: managementItems
    });
  }

  if (auth.isAdmin) {
    sections.push({
      title: "Settings",
      items: [
        { to: "/users", label: "Users Management", icon: UsersIcon }
      ]
    });
  }

  return sections;
});
</script>