<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-200 transition-colors">
    
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5 select-none">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <UsersIcon class="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Users Management
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create, update, delete users and manage staff system access credentials.
        </p>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center gap-2 select-none">
        <UserPlusIcon class="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <h2 class="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase">Add New System User</h2>
      </div>

      <form class="p-6 space-y-5" @submit.prevent="handleCreate">
        <div v-if="error" class="p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 rounded-xl text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
          <span class="font-medium">{{ error }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider select-none">Full Name</label>
            <input
              v-model.trim="form.name"
              required
              type="text"
              placeholder="John Doe"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider select-none">Email Address</label>
            <input
              v-model.trim="form.email"
              required
              type="email"
              placeholder="john@company.com"
              class="w-full rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider select-none">Assigned Role</label>
            <div class="relative">
              <select
                v-model.number="form.role"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 pl-3 pr-10 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer shadow-sm font-semibold"
              >
                <option :value="0" class="dark:bg-slate-950">Admin</option>
                <option :value="1" class="dark:bg-slate-950">Manager</option>
                <option :value="2" class="dark:bg-slate-950">Cashier</option>
              </select>
              <span class="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-600">
                <ChevronDownIcon class="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          <div class="space-y-1.5 md:col-span-2">
            <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider select-none">Password Access</label>
            <div class="relative flex items-center">
              <input
                v-model.trim="form.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="`Leave blank to use default password: ${defaultPassword}`"
                class="w-full rounded-lg border border-slate-300 dark:border-slate-700 pl-3 pr-11 py-2 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-sm"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer select-none"
              >
                <EyeOffIcon v-if="showPassword" class="w-4 h-4" />
                <EyeIcon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="md:pt-7">
            <button
              type="submit"
              :disabled="loading.create"
              class="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-600/40 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed select-none"
            >
              <Loader2Icon v-if="loading.create" class="w-4 h-4 animate-spin" />
              <UserPlusIcon v-else class="w-4 h-4" />
              <span>{{ loading.create ? "Creating Account..." : "Create User" }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between gap-4 select-none">
        <div class="flex items-center gap-2">
          <ShieldAlertIcon class="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <h2 class="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide uppercase">Existing Users Directory</h2>
        </div>
        <button
          @click="fetchUsers"
          type="button"
          :disabled="loading.fetch"
          class="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <RefreshCwIcon class="w-3.5 h-3.5" :class="{ 'animate-spin': loading.fetch }" />
          <span>Refresh List</span>
        </button>
      </div>

      <div class="p-6" v-if="users.length">
        <div class="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] select-none">
                <th class="py-3 px-4 w-16">ID</th>
                <th class="py-3 px-4">Name String</th>
                <th class="py-3 px-4">Email Account</th>
                <th class="py-3 px-4 w-48">System Access Role</th>
                <th class="py-3 px-4 text-right w-52">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
              <UserRow 
                v-for="u in users" 
                :key="u.id"
                :user="u"
                :is-editing="activeEditId === u.id"
                :is-updating="!!loading.update[u.id]"
                :is-deleting="!!loading.delete[u.id]"
                @start-edit="activeEditId = u.id"
                @cancel-edit="activeEditId = null"
                @update-user="handleUpdate"
                @delete-user="handleDelete"
              />
            </tbody>
          </table>
        </div>
      </div>

      <div class="p-16 text-center select-none" v-else>
        <UsersIcon class="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
        <p class="text-sm font-bold text-slate-500 dark:text-slate-400">No organizational profiles discovered.</p>
      </div>

      <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center gap-2 select-none">
        <InfoIcon class="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Passwords are safely isolated and encrypted. Click "Edit" to modify name fields, communications accounts, or permission credentials.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import api from "@/services/api";

import {
  UsersIcon,
  UserPlusIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  Loader2Icon,
  ShieldAlertIcon,
  RefreshCwIcon,
  InfoIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-vue-next";

import UserRow from "@/components/users/UserRow.vue";

// -----------------------------------------------------------------------------
// Declarative Framework Core Reactive States Pool
// -----------------------------------------------------------------------------
const users = ref([]);
const error = ref("");
const showPassword = ref(false);
const activeEditId = ref(null);
const defaultPassword = "123456";

const form = reactive({ name: "", email: "", password: "", role: 2 });

const loading = reactive({
  fetch: false,
  create: false,
  update: {},
  delete: {},
});

// -----------------------------------------------------------------------------
// Downstream API Middleware Ingress Handling Processing Loops
// -----------------------------------------------------------------------------
const fetchUsers = async () => {
  error.value = "";
  loading.fetch = true;
  try {
    const { data } = await api.get("/users");
    users.value = data?.data || [];
    activeEditId.value = null;
  } catch (e) {
    error.value = e.response?.data?.message || e.message || "Failed to parse system operators directory list.";
  } finally {
    loading.fetch = false;
  }
};

const handleCreate = async () => {
  error.value = "";
  
  const targetName = form.name?.trim();
  const targetEmail = form.email?.trim();
  
  if (!targetName || !targetEmail) {
    error.value = "User profile descriptors require valid string inputs.";
    return;
  }

  loading.create = true;
  try {
    const payload = {
      name: targetName,
      email: targetEmail,
      password: form.password ? form.password : defaultPassword,
      role: Number(form.role),
    };
    await api.post("/users", payload);

    // Document Reset Form Operations Chain
    form.name = "";
    form.email = "";
    form.password = "";
    form.role = 2;
    showPassword.value = false;

    await fetchUsers();
  } catch (e) {
    error.value = e.response?.data?.message || e.message || "Account profile generation failed.";
  } finally {
    loading.create = false;
  }
};

const handleUpdate = async (editedFields) => {
  if (!editedFields || !editedFields.id) return;
  
  error.value = "";
  loading.update[editedFields.id] = true;
  try {
    const payload = {
      name: editedFields.name?.trim() || "",
      email: editedFields.email?.trim() || "",
      role: Number(editedFields.role),
    };
    
    await api.put(`/users/${editedFields.id}`, payload);
    activeEditId.value = null;
    await fetchUsers();
  } catch (e) {
    error.value = e.response?.data?.message || e.message || "Failed to persist identity records modification updates.";
  } finally {
    loading.update[editedFields.id] = false;
  }
};

const handleDelete = async (id) => {
  if (!id) return;
  error.value = "";
  
  const ok = window.confirm("Are you certain you wish to completely drop this operator? This action cannot be revoked.");
  if (!ok) return;

  loading.delete[id] = true;
  try {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  } catch (e) {
    error.value = e.response?.data?.message || e.message || "Database dropped transactional execution sequence.";
  } finally {
    loading.delete[id] = false;
  }
};

// -----------------------------------------------------------------------------
// Target Document Mounting Hook Intakes
// -----------------------------------------------------------------------------
onMounted(() => {
  fetchUsers();
});
</script>