<template>
  <div class="relative" ref="target">
    <MenuIcon
      class="cursor-pointer"
      @mouseover="onHover = '#6366f1'"
      @mouseleave="onHover = '#FFFFFF'"
      :fillColor="onHover"
      @click="buttonClickSetting"
      />
    <div
      v-if="showSetting"
      class="absolute w-48 right-8 top-0 z-10 backdrop-blur-sm backdrop-brightness-90 backdrop-saturate-0 rounded-lg transition-all duration-150 shadow-lg border border-1 border-zinc-700"
    >
      <div class="flex flex-col justify-start p-4 text-white">
        <span class="text-left text-gray-400 tracking-widest">SETTING</span>
        <ul class="flex flex-col items-start justify-start mt-2">
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
                class="form-check-input appearance-none h-4 w-4 border border-1 border-gray-300 rounded-sm bg-white checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer hover:bg-indigo-400 hover:border-indigo-400"
                type="checkbox"
              />
              Show Image
            </label>
          </li>
          <li>
            <label class="form-check cursor-pointer">
              <input
                v-model="store.favorite"
                class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer hover:bg-indigo-400 hover:border-indigo-400"
                type="checkbox"
              />
              Show Favorite
            </label>
          </li>
        </ul>
        <div
          class="flex justify-between text-slate-500 text-xs font-medium mt-2"
        >
          <!-- <a href="http://" class="hover:text-pink-500">Donate</a> -->
          <a href="#" @click="showAbout()" class="border border-1 border-zinc-600 hover:border-indigo-500 px-5 py-2 rounded-md bg-zinc-800 text-white hover:bg-indigo-700 transition-all duration-500 ease-in-out mt-1">About</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { onMounted, ref, watch } from "vue";
import MenuIcon from "vue-material-design-icons/CogOutline.vue";
import { useSetting } from "../store/store";

const store = useSetting();

const onHover = ref("#FFFFFF");
const showSetting = ref(false);
const target = ref(null);

let showAbout = () => {
  showSetting.value = !showSetting.value;
  store.setAboutStatus();
};

let buttonClickSetting = () => {
  showSetting.value = !showSetting.value;
};

onClickOutside(target, () => {
  showSetting.value = false;
});

watch(store, (newval) => {
  const localFavorite = localStorage.getItem("favorite") || "true";
  const favorite = localFavorite === "true";
  console.log(favorite);
  console.log(newval.$state.favorite);
  if (newval.$state.favorite != favorite)
    localStorage.setItem("favorite", store.getFavoriteStatus.toString());

  const localImage = localStorage.getItem("favorite") || "true";
  const image = localImage === "true";
  if (newval.$state.image != image)
    localStorage.setItem("image", store.getImageStatus.toString());
});

onMounted(() => {
  if (localStorage.getItem("favorite") == null)
    localStorage.setItem("favorite", store.getFavoriteStatus.toString());
  else {
    const local = localStorage.getItem("favorite") || "true";
    const favorite = local === "true";

    if (favorite != store.getFavoriteStatus) store.setFavoriteStatus();
  }

  if (localStorage.getItem("image") == null) {
    localStorage.setItem("image", store.getImageStatus.toString());
  } else {
    const local = localStorage.getItem("image") || "true";
    const image = local === "true";

    if (image != store.getImageStatus) store.setImageStatus();
  }
});
</script>
