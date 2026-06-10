<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 space-y-6">
      
      <div class="text-center space-y-1 select-none">
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center justify-center gap-2">
          <LayoutDashboardIcon class="w-7 h-7 text-indigo-600" />
          <span>POS<span class="text-indigo-600 font-semibold">Quality</span></span>
        </h1>
        <p class="text-sm text-slate-500 font-medium">
          Sign in to your account to continue
        </p>
      </div>

      <div
        v-if="error"
        class="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-200 rounded-xl text-sm flex items-start gap-2.5 animate-in fade-in duration-150"
      >
        <AlertCircleIcon class="w-4 h-4 shrink-0 mt-0.5" />
        <span class="font-medium">{{ error }}</span>
      </div>

      <form @submit.prevent="submit" class="space-y-4">
        
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Email Address
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <MailIcon class="w-4 h-4" />
            </span>
            <input
              v-model="form.email"
              type="email"
              required
              :disabled="loading"
              autocomplete="username"
              placeholder="admin@pos.com"
              class="w-full pl-10 pr-3 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm text-sm placeholder-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-950"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Password
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
              <LockIcon class="w-4 h-4" />
            </span>
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              :disabled="loading"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm text-sm placeholder-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-950"
            />
            <button
              type="button"
              :disabled="loading"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
              tabindex="-1"
              title="Toggle password visibility"
            >
              <EyeIcon v-if="!showPassword" class="w-4 h-4" />
              <EyeOffIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full mt-2 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/50 text-white font-medium text-sm px-4 py-3 rounded-xl shadow-sm transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          <Loader2Icon v-if="loading" class="w-4 h-4 animate-spin" />
          <span>{{ loading ? "Signing in..." : "Sign In" }}</span>
        </button>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

import {
  LayoutDashboardIcon,
  AlertCircleIcon,
  MailIcon,
  LockIcon,
  Loader2Icon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-vue-next";

// -----------------------------------------------------------------------------
// Core Pinia Store Ecosystem Adapters
// -----------------------------------------------------------------------------
const auth = useAuthStore();
const router = useRouter();

// -----------------------------------------------------------------------------
// UI Local Component State Engine
// -----------------------------------------------------------------------------
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);
const form = reactive({ email: "", password: "" });

// -----------------------------------------------------------------------------
// Mutations & Functional Operations Handlers
// -----------------------------------------------------------------------------
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const submit = async () => {
  const sanitizedEmail = form.email.trim();
  const rawPassword = form.password;

  if (!sanitizedEmail || !rawPassword) {
    error.value = "Email and password are required";
    return;
  }
  
  loading.value = true;
  error.value = "";
  
  try {
    await auth.login(sanitizedEmail, rawPassword);
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Invalid credentials. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>