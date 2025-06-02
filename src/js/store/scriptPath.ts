import { defineStore } from "pinia";
import { ref } from "vue";

export const useScriptPath = defineStore("scriptPath", () => {
    const scriptPath = ref<folder[]>([]);

    return {

    }
});