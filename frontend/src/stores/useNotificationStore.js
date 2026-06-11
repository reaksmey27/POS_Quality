import { defineStore } from "pinia";
import { computed, ref } from "vue";
import api from "../services/api";

export const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const unreadCount = computed(() => notifications.value.length);

  const fetchNotifications = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get("/notifications");
      const payload = res.data?.data;

      const list = Array.isArray(payload)
        ? payload
        : payload?.notifications && Array.isArray(payload.notifications)
          ? payload.notifications
          : [];

      notifications.value = list.map((n, idx) => ({
        id: n.id ?? n._id ?? idx,
        message: n.message ?? n.title ?? "Notification",
        type: n.type ?? "info",
        createdAt: n.createdAt ?? n.created_at,
      }));
    } catch (e) {
      // No demo/static fallback. Keep notifications empty and expose error to the UI.
      notifications.value = [];
      error.value = e?.response?.data?.message || null;
    } finally {
      loading.value = false;
    }
  };

  const markAllAsRead = () => {
    notifications.value = [];
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAllAsRead,
  };
});
