import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("pos_token") || null);
  const user = ref(JSON.parse(localStorage.getItem("pos_user") || "null"));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 0);
  const isManager = computed(() => user.value?.role === 1);
  const isCashier = computed(() => user.value?.role === 2);
  const canManage = computed(() => user.value?.role <= 1);

  const roleName = computed(() => {
    const map = { 0: "Admin", 1: "Manager", 2: "Cashier" };
    return map[user.value?.role] || "Unknown";
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    token.value = data.data.token;
    user.value = data.data.user;
    localStorage.setItem("pos_token", token.value);
    localStorage.setItem("pos_user", JSON.stringify(user.value));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("pos_token");
    localStorage.removeItem("pos_user");
  };

  return { token, user, isAuthenticated, isAdmin, isManager, isCashier, canManage, roleName, login, logout };
});
