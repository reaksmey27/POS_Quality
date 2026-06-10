<template>
  <tr class="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors h-14">
    <td class="py-3 px-4 font-mono text-xs text-slate-400 dark:text-slate-500 selection:bg-indigo-500/20">
      #{{ user.id }}
    </td>
    
    <td class="py-3 px-4 font-semibold text-slate-900 dark:text-white tracking-tight text-sm">
      <input
        v-if="isEditing"
        type="text"
        v-model.trim="localEdit.name"
        :disabled="isUpdating"
        class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Name required"
      />
      <span v-else>{{ user.name || '—' }}</span>
    </td>
    
    <td class="py-3 px-4 text-slate-600 dark:text-slate-400 text-sm">
      <input
        v-if="isEditing"
        type="email"
        v-model.trim="localEdit.email"
        :disabled="isUpdating"
        class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="email@company.com"
      />
      <span v-else class="font-medium">{{ user.email }}</span>
    </td>
    
    <td class="py-3 px-4">
      <div v-if="isEditing" class="relative flex items-center max-w-[140px]">
        <span 
          class="absolute left-3 w-2 h-2 rounded-full pointer-events-none z-10 transition-colors duration-150"
          :class="roleBadgeColor(localEdit.role)"
        ></span>
        <select
          v-model.number="localEdit.role"
          :disabled="isUpdating"
          class="w-full rounded-lg border border-slate-300 dark:border-slate-700 pl-7 pr-8 py-1.5 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option :value="0" class="dark:bg-slate-950">Admin</option>
          <option :value="1" class="dark:bg-slate-950">Manager</option>
          <option :value="2" class="dark:bg-slate-950">Cashier</option>
        </select>
        <span class="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-600">
          <ChevronDownIcon class="w-3.5 h-3.5" />
        </span>
      </div>
      
      <div v-else class="flex items-center gap-1.5 select-none">
        <span class="w-2 h-2 rounded-full shrink-0" :class="roleBadgeColor(user.role)"></span>
        <span 
          class="text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-md"
          :class="roleLabelColor(user.role)"
        >
          {{ getRoleString(user.role) }}
        </span>
      </div>
    </td>
    
    <td class="py-3 px-4 text-right space-x-2 whitespace-nowrap select-none">
      <template v-if="isEditing">
        <button
          @click="saveRow"
          type="button"
          :disabled="isUpdating || !localEdit.name || !localEdit.email"
          class="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 dark:disabled:bg-emerald-600/40 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <Loader2Icon v-if="isUpdating" class="w-3 h-3 animate-spin" />
          <CheckIcon v-else class="w-3 h-3" />
          <span>Save</span>
        </button>
        <button
          @click="$emit('cancel-edit', user.id)"
          type="button"
          :disabled="isUpdating"
          class="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <XIcon class="w-3 h-3" />
          <span>Cancel</span>
        </button>
      </template>

      <template v-else>
        <button
          @click="initiateEdit"
          type="button"
          :disabled="isDeleting"
          class="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white dark:text-slate-200 text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit3Icon class="w-3 h-3" />
          <span>Edit</span>
        </button>
        <button
          @click="$emit('delete-user', user.id)"
          type="button"
          :disabled="isDeleting"
          class="inline-flex items-center gap-1 px-3 py-1.5 border border-red-200 dark:border-red-900/40 hover:bg-red-600 dark:hover:bg-rose-600 text-red-600 dark:text-rose-400 hover:text-white dark:hover:text-white text-xs font-semibold rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Loader2Icon v-if="isDeleting" class="w-3 h-3 animate-spin" />
          <Trash2Icon v-else class="w-3 h-3" />
          <span>Delete</span>
        </button>
      </template>
    </td>
  </tr>
</template>

<script setup>
import { reactive, watch } from "vue";
import { ChevronDownIcon, Loader2Icon, CheckIcon, XIcon, Edit3Icon, Trash2Icon } from "lucide-vue-next";

// Define Static Map Collections For State Configuration Mappings
const ROLE_STRINGS = { 0: "Admin", 1: "Manager", 2: "Cashier" };
const BADGE_COLORS = { 0: "bg-rose-500", 1: "bg-indigo-500", 2: "bg-emerald-500" };

const LABEL_COLORS = {
  0: "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400",
  1: "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400",
  2: "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
};

const props = defineProps({
  user: { type: Object, required: true },
  isEditing: { type: Boolean, default: false },
  isUpdating: { type: Boolean, default: false },
  isDeleting: { type: Boolean, default: false }
});

const emit = defineEmits(['start-edit', 'cancel-edit', 'update-user', 'delete-user']);

// Reactive UI Temporary Form State Storage Buffer
const localEdit = reactive({ name: "", email: "", role: 2 });

const syncLocalState = () => {
  localEdit.name = props.user?.name || "";
  localEdit.email = props.user?.email || "";
  localEdit.role = props.user?.role ?? 2;
};

const initiateEdit = () => {
  syncLocalState();
  emit('start-edit', props.user.id);
};

// Sync properties when switching into editing modes
watch(
  () => props.isEditing,
  (editingState) => {
    if (editingState) {
      syncLocalState();
    }
  },
  { immediate: true }
);

const saveRow = () => {
  if (!localEdit.name.trim() || !localEdit.email.trim()) return;
  emit('update-user', { id: props.user.id, ...localEdit });
};

// -----------------------------------------------------------------------------
// Declarative Metric Style Extractors
// -----------------------------------------------------------------------------
const getRoleString = (role) => ROLE_STRINGS[role] || "Unknown";
const roleBadgeColor = (role) => BADGE_COLORS[role] || "bg-slate-400";
const roleLabelColor = (role) => LABEL_COLORS[role] || "bg-slate-500/10 text-slate-500";
</script>