import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/LoginView.vue"),
    meta: { guest: true },
  },
  {
    path: "/",
    component: () => import("@/layouts/AppLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/DashboardView.vue"),
      },
      {
        path: "pos",
        name: "POS",
        component: () => import("@/views/PosView.vue"),
      },
      {
        path: "products",
        name: "Products",
        component: () => import("@/views/ProductManagement.vue"),
        meta: { minRole: 1 },
      },
      {
        path: "categories",
        name: "Categories",
        component: () => import("@/views/CategoryManagement.vue"),

        meta: { minRole: 1 },
      },
      {
        path: "orders",
        name: "Orders",
        component: () => import("@/views/OrderManagement.vue"),
        meta: { minRole: 1 },
      },
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/UsersView.vue"),
        meta: { minRole: 0 },
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next("/login");
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return next("/dashboard");
  }
  if (to.meta.minRole !== undefined && auth.user?.role > to.meta.minRole) {
    return next("/pos");
  }
  next();
});

export default router;
