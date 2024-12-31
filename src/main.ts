import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { VueQueryPlugin  } from "@tanstack/vue-query";
import '@/assets/main.css'
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import i18n from "./helper/i18n";
import vuetify from "./plugins/vuetify";

const app = createApp(App);
  

registerPlugins(app);
app.use(createPinia().use(piniaPluginPersistedstate))
app.use(vuetify)
app.use(i18n);
app.use(VueQueryPlugin);
app.mount("#app");
