<template>
  <div class="relative" ref="target">
    <MenuIcon
      class="cursor-pointer"
      @mouseover="onHover = '#ec4899'"
      @mouseleave="onHover = '#FFFFFF'"
      :fillColor="onHover"
      @click="buttonClickSetting"
    />
    <div
      v-if="showSetting"
      class="absolute top-8 w-64 right-0 z-10 !bg-slate-50 rounded-lg transition-all duration-150"
    >
      <div class="flex flex-col justify-start p-4">
        <span class="text-gray-400">Setting</span>
        <hr />
        <ul class="flex flex-col items-start justify-start mt-4">
          <!-- <li>
            <label class="form-check cursor-pointer">
              <input
                v-model="store.action"
                class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-pink-500 checked:border-pink-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="checkbox"
              />
              Show Actions
            </label>
          </li> -->
          <li>
            <label class="form-check cursor-pointer">
              <input
                v-model="store.image"
                class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-pink-500 checked:border-pink-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="checkbox"
              />
              Show Image
            </label>
          </li>
          <li>
            <label class="form-check cursor-pointer">
              <input
                v-model="store.favorite"
                class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-pink-500 checked:border-pink-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="checkbox"
              />
              Show Favorite
            </label>
          </li>
        </ul>
        <div
          class="flex justify-between text-slate-500 text-xs font-medium mt-5"
        >
          <a href="http://" class="hover:text-pink-500">Donate</a>
          <a href="http://" class="hover:text-pink-500">About</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref } from "vue";
import MenuIcon from "vue-material-design-icons/CogOutline.vue";
import { useSetting } from "../store/store";

const store = useSetting();

const onHover = ref("#FFFFFF");
const showSetting = ref(false);
const target = ref(null);

let buttonClickSetting = () => {
  showSetting.value = !showSetting.value;
};

onClickOutside(target, () => {
  showSetting.value = false;
});
</script>
