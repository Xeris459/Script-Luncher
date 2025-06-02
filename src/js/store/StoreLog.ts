import { defineStore } from "pinia";
import { ref } from "vue";

export const storeLogs = defineStore("storeLogs", () => {
    const logs = ref<any[]>([]);

    return {
        logs,

        addLog(log: any) {
            logs.value.push(log);
        },

        clearLogs() {
            logs.value = [];
        },

        getLogs() {
            return logs.value;
        }
    }
});