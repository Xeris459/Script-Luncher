<template>
  <div
    class="p-10 z-20 bg-black/20 absolute w-screen h-screen flex justify-center items-center"
  >
    <div
      ref="target"
      class="bg-zinc-200 w-4/5 p-3 rounded-lg flex flex-col items-start"
    >
      <h1 class="font-bold mb-2 text-center">About</h1>
      <span>Script Library v0.1.0</span>
      <p class="text-start mt-2">
        This extension is still under development which will be updated to make
        it easier to manage in the future
      </p>
      <p class="text-start mt-2 flex flex-col">
        <span class="font-bold">Donate Me: </span>
        <span>
          <a href="#" class="hover:text-[#ec4899]" @click="donate()"
            >Trakteer</a
          >
        </span>
      </p>
      <small class="mt-5">made by Axerisu</small>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
import { useSetting } from "../store/store";
import { openLinkInBrowser } from "../lib/utils";

const target = ref(null);
const getSetting = useSetting();

onClickOutside(target, () => {
  getSetting.setAboutStatus();
});

let donate = () => {
  openLinkInBrowser("https://trakteer.id/axerisu");
};
</script>
