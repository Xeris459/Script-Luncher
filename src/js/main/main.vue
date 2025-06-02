<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { subscribeBackgroundColor } from "../lib/utils";
import "../index.scss";
import list from "./list.vue";
import setting from "./setting.vue";
// import { useScriptList } from "../store/scriptList";
import { useSetting } from "../store/store";
import cardDonate from "./CardDonate.vue";
import { useFile } from "../composable/loadFile";

// const getScriptList = useScriptList();
const getSetting = useSetting();
const Search = ref("");
const backgroundColor = ref("#18181b");
const File = useFile();

onMounted(async () => {
  if (window.cep) {
    subscribeBackgroundColor((c: string) => {
      backgroundColor.value = c;
    });
  }

  File.load();
});

// function for refresh
let RefreshScript = () => {
  File.load();
};

// getScriptList.addInstalledList({
//   path: "https://pinia.vuejs.org/core-concepts/getters.html#passing-arguments-to-getters",
//   image: "",
//   title: "",
//   fav: false,
//   hide: false,
//   realName: "test.jsx",
// });
</script>

<template>
  <div class="app select-none overflow-hidden" :style="{ backgroundColor: backgroundColor }">
    <section class="w-screen h-screen">
      <cardDonate v-if="getSetting.getAboutStatus" />
      <div class="p-2 flex-auto justify-between">
        <div>
          <div class="flex justify-between">
            <h2 class="font-semibold text-2xl text-indigo-500 mb-2 text-center">
              Script<span class="font-thin text-white">Library</span><sup class="text-xs font-bold">BETA</sup>
            </h2>
            <div class="flex">
              <setting class="mt-2 ml-2 rotate-0" />
            </div>
          </div>

          <div></div>
          <list @RefreshScript="RefreshScript" :search="Search"
            class="mt-1 h-screen overflow-y-auto flex flex-col w-full" />
        </div>
      </div>
    </section>
  </div>
</template>
