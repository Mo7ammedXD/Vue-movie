import { registerPlugins } from "@/plugins";
import App from "./App.vue";
import { VueQueryPlugin  } from "@tanstack/vue-query";
import '@/assets/main.css'
import { createApp } from "vue";

const app = createApp(App);

registerPlugins(app);

app.use(VueQueryPlugin);
app.mount("#app");
