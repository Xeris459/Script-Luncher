import { createApp } from "vue";
import { createPinia } from 'pinia'
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';

import App from "./main.vue";

const pinia = createPinia()

createApp(App).use(pinia).mount("#root")
