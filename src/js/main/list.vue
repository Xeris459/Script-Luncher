<style lang="scss">
.dark {
  --tw-border-opacity: 1;
  --popper-theme-background-color: rgb(24 24 27 / var(--tw-border-opacity));
  --popper-theme-background-color-hover: rgb(24 24 27 / var(--tw-border-opacity));
  --popper-theme-text-color: white;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: rgb(63 63 70 / var(--tw-border-opacity));
  --popper-theme-border-width: 1px;
  --popper-theme-border-radius: 5px;
  --popper-theme-padding: 5px 20px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

.vue-simple-context-menu {
  --tw-border-opacity: 1;
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color),
    0 4px 6px -4px var(--tw-shadow-color);
  background-color: rgb(24 24 27 / var(--tw-border-opacity)) !important;
  border-color: rgb(63 63 70 / var(--tw-border-opacity)) !important;
  border-width: 1px !important;
  border-radius: 0.5rem !important;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
  color: white;

  &__item {
    color: white;

    &:hover {
      background-color: rgb(67 56 202 / var(--tw-border-opacity));
      color: white;
    }
  }
}
</style>

<template>
  <div>
    <div class="flex flex-row justify-between mb-2">
      <div class="flex flex-row">
        <Popper content="Favorite" class="dark" hover placement="bottom" arrow arrowPadding="0">
          <StarOutline class="cursor-pointer" v-if="!getScriptList.getFavorite" @mouseover="onHoverStar = '#6366f1'"
            @mouseleave="onHoverStar = '#FFFFFF'" @click="getScriptList.setFavorite(true)" :size="24"
            :fillColor="onHoverStar" />
          <Star class="cursor-pointer" v-else @mouseover="onHoverStar = '#6366f1'" @mouseleave="onHoverStar = '#FFFFFF'"
            @click="getScriptList.setFavorite(false)" :size="24" :fillColor="onHoverStar" />
        </Popper>
        <Popper content="Refresh" class="dark" hover placement="bottom" arrow arrowPadding="0">
          <Refresh class="cursor-pointer" @mouseover="onHoverRefresh = '#6366f1'"
            @mouseleave="onHoverRefresh = '#FFFFFF'" @click="$emit('RefreshScript')" :size="24"
            :fillColor="onHoverRefresh" />
        </Popper>
      </div>
      <input v-model="search" type="text"
        class="text-xs text-white p-2 border border-1 border-indigo-800 hover:border-indigo-500 transition-all ease-in-out duration-500 rounded-md text-center tracking-tight focus:bg-zinc-800 focus:text-white focus:border-indigo-600 w-full bg-indigo-700 mx-2 h-6"
        placeholder="Search" />
      <div class="relative flex flex-row" ref="target">
        <div @click="showFolder = !showFolder" class="cursor-pointer">
          <Popper content="Add Folder" class="dark" hover placement="bottom" arrow arrowPadding="0">
            <FolderPlusOutline @mouseover="onHoverFolder = '#6366f1'" @mouseleave="onHoverFolder = '#FFFFFF'" :size="24"
              :fillColor="onHoverFolder" />
          </Popper>
        </div>
        <Popper content="Filter" class="dark" hover placement="bottom" arrow arrowPadding="0">
          <FilterMultiple class="cursor-pointer" @mouseover="onHoverFilter = '#6366f1'"
            @mouseleave="onHoverFilter = '#FFFFFF'" @click="showFillter = !showFillter" :size="24"
            :fillColor="onHoverFilter" />
        </Popper>
        <div v-if="showFillter"
          class="absolute right-8 top-0 bg-zinc-900 border border-1 border-zinc-700 w-48 z-10 rounded-lg transition-all duration-150">
          <div class="flex flex-col justify-start p-4 text-white">
            <span class="text-gray-400 text-left tracking-widest">SETTING FILTER</span>
            <ul class="flex flex-col items-start justify-start mt-2">
              <li>
                <label class="form-check cursor-pointer">
                  <input v-model="jsx" @click="store.setFilterList('jsx')"
                    class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer hover:bg-indigo-400 hover:border-indigo-400"
                    type="checkbox" />
                  JSX
                </label>
              </li>
              <li>
                <label class="form-check cursor-pointer">
                  <input v-model="jsxbin" @click="store.setFilterList('jsxbin')"
                    class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-indigo-500 checked:border-indigo-500 focus:outline-bottom transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer hover:bg-indigo-400 hover:border-indigo-400"
                    type="checkbox" />
                  JSXBIN
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="showFolder"
          class="absolute right-0 top-0 bg-zinc-900 border border-1 border-zinc-700 w-56 z-10 rounded-lg transition-all duration-150">
          <div class="flex flex-col justify-start p-4 text-white">
            <span class="text-gray-400 text-left tracking-widest">Folder List</span>
            <ul class="flex flex-col items-start justify-start w-full mt-2">
              <template v-for="item in store.$state.folders" :key="item.path">
                <li class="flex items-center justify-between text-left w-full text-xs border-b py-3">
                  <p>{{ item.path }}</p>
                  <button @click="removeFolder(item.path)"
                    class="text-red-500 hover:text-red-700 ml-2 text-xs">Remove</button>
                </li>
              </template>

              <li class="w-full">
                <button @click="showAddFolder = true; showFolder = false"
                  class="text-indigo-500 hover:text-indigo-700 ml-2 text-xs mt-6 w-full">Add Folder</button>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="showAddFolder"
          class="absolute right-8 top-0 bg-zinc-900 border border-1 border-zinc-700 w-96 z-10 rounded-lg transition-all p-4 duration-150">
          <div class="flex flex-col justify-start text-white">
            <span class="text-gray-400 text-left tracking-widest">Add Folder</span>
            <ul class="flex flex-col items-start justify-start mt-2 gap-4">
              <li class="w-full">
                <input v-model="folderPath" type="text"
                  class="text-xs text-white p-2 border border-1 border-indigo-800 hover:border-indigo-500 transition-all ease-in-out duration-500 rounded-md text-center tracking-tight focus:bg-zinc-800 focus:text-white focus:border-indigo-600 w-full bg-indigo-700 mx-2 h-6"
                  placeholder="Add Folder Path" />
              </li>
              <button @click="saveFolder()"
                class="text-indigo-500 hover:text-indigo-700 ml-2 text-xs w-full">Add</button>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col h-screen scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-zinc-800 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full border bottom-1 border-zinc-700 rounded-md">
      <listMode @contextmenu.prevent.stop="handleRightClick($event, list)" v-on:dblclick="runFile(list.path)"
        v-for="list in AfterFilter" :list="list" />
    </div>

    <vueSimpleContextMenu element-id="myFirstMenu" :options="optionsArray1" ref="vueSimpleContextMenu1"
      @option-clicked="optionClicked1">
    </vueSimpleContextMenu>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref, computed, watch, onMounted } from "vue";
import { evalFile } from "../lib/utils";
import Popper from "vue3-popper";

import listMode from "./listMode.vue";
import StarOutline from "vue-material-design-icons/StarOutline.vue";
import Star from "vue-material-design-icons/Star.vue";
import FilterMultiple from "vue-material-design-icons/FilterMultiple.vue";
import Refresh from "vue-material-design-icons/Refresh.vue";
import FolderPlusOutline from "vue-material-design-icons/FolderPlusOutline.vue";
import vueSimpleContextMenu from "./vue-simple-context-menu.vue";

import { useSetting } from "../store/store";
import { useScriptList } from "../store/scriptList";
import { useFile } from "../composable/loadFile";

const store = useSetting();
const getScriptList = useScriptList();
const File = useFile();

const onHoverStar = ref("#FFFFFF");
const onHoverFilter = ref("#FFFFFF");
const onHoverRefresh = ref("#FFFFFF");
const onHoverFolder = ref("#FFFFFF");
const optionsArray1 = ref([
  // {
  //   name: "Edit Title",
  //   slug: "title",
  // },
  {
    name: "Favorite",
    slug: "favorite",
  },
  {
    name: "Hide",
    slug: "hide",
  },
]);
const showFillter = ref(false);
const showFolder = ref(false);
const showAddFolder = ref(false);
const target = ref(null);
const search = ref("");
const vueSimpleContextMenu1 = ref();
const jsx = ref(store.getfilterList.includes("jsx"));
const jsxbin = ref(store.getfilterList.includes("jsxbin"));
const folderPath = ref("");

let runFile = (file: string) => {
  evalFile(file);
};

const ScriptList = computed(() => {
  return getScriptList.getFavorite
    ? getScriptList.getFavoriteList.filter(
      (v) =>
        v.title.toLocaleLowerCase().includes(search.value) ||
        v.realName.toLocaleLowerCase().includes(search.value)
    )
    : getScriptList.getInstalledList.filter(
      (v) =>
        v.title.toLocaleLowerCase().includes(search.value) ||
        v.realName.toLocaleLowerCase().includes(search.value)
    );
});

const AfterFilter = computed(() => {
  return ScriptList.value.filter((v) => {
    const split: string[] = v.realName.split(".");
    const ext = split[split.length - 1];

    if (store.getfilterList.includes(ext)) return true;

    return false;
  });
});

const handleRightClick = (event: any, item: any) => {
  vueSimpleContextMenu1.value.showMenu(event, item);
};

const optionClicked1 = (event: any) => {
  if (event.option.name == "Hide") {
    getScriptList.setScriptHide(event.item.realName);
  } else if (event.option.name == "Favorite") {
    getScriptList.setScriptFav(event.item.realName);
  }

  File.save();
};

watch(
  store,
  (state) => {
    jsx.value = state.filterList.includes("jsx") ? true : false;
    jsxbin.value = state.filterList.includes("jsxbin") ? true : false;
  },
  { deep: true }
);

onClickOutside(target, () => {
  showFillter.value = false;
  showFolder.value = false;
  showAddFolder.value = false;
});

const saveFolder = () => {
  store.addFolder({ path: folderPath.value.replaceAll('\\', '/'), deepScan: true, maxDeepScan: 1 }); showAddFolder.value = false; folderPath.value = ''; File.save();
}

const removeFolder = (path: string) => {
  store.removeFolder(path);
  File.save();
};
</script>
