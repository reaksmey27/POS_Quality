import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";

import { useThemeStore } from "@/stores/theme.store";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");

// Initialize theme after mounting so document exists
const themeStore = useThemeStore();
themeStore.init();
