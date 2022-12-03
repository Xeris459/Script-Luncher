import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./main.vue";

const pinia = createPinia()

createApp(App).use(pinia).mount("#root");
