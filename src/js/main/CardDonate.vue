<template>
  <div
    class="p-10 z-20 bg-black/20 absolute w-screen h-screen flex justify-center items-center"
  >
    <div
      ref="target"
      class="backdrop-blur-sm backdrop-brightness-70 backdrop-saturate-0 border border-1 border-zinc-700 text-white w-4/5 p-3 rounded-lg flex flex-col items-start shadow-2xl"
    >
      <h1 class="font-bold mb-2 text-center">About</h1>
      <span>Script Library v0.1.2</span>
      <p class="text-start mt-2">
        This extension is still under development which will be updated to make
        it easier to manage in the future.
      </p>
      <p class="text-start mt-2 flex flex-col">
        <span class="font-semibold mb-4 mt-4">Donate Me: </span>
        <span>
          <a href="#" class="border border-1 border-zinc-600 hover:border-indigo-500 px-5 py-2 rounded-md bg-zinc-800 text-white hover:bg-indigo-700 transition-all duration-500 ease-in-out" @click="donate()"
            >Trakteer</a
          >
        </span>
      </p>
      <small class="mt-8">Made by <a class="text-indigo-500 hover:text-indigo-300 transition-all duration-500 ease-in-out" href="https://www.facebook.com/Soft.AMVikry">Axerisu</a></small>
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
