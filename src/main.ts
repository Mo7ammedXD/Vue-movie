import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { VueQueryPlugin  } from "@tanstack/vue-query";
import '@/assets/main.css'
import { createApp, watch } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";
import vuetify from "./plugins/vuetify";

const app = createApp(App);



const i18n = createI18n({
    legacy: false, 
    locale: 'ar', 
    fallbackLocale: 'ar', 
    messages: {
      en,
      ar,
    },
  });
  



app.use(i18n);
registerPlugins(app);
app.use(createPinia().use(piniaPluginPersistedstate))
app.use
app.use(VueQueryPlugin);
app.mount("#app");
