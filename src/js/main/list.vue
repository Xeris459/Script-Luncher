<template>
  <div>
    <div class="flex flex-row justify-between mb-2">
      <div class="flex flex-row">
        <StarOutline
          v-if="!getScriptList.getFavorite"
          @mouseover="onHoverStar = '#6366f1'"
          @mouseleave="onHoverStar = '#FFFFFF'"
          @click="getScriptList.setFavorite(true)"
          :size="24"
          :fillColor="onHoverStar"
        />
        <Star
          v-else
          @mouseover="onHoverStar = '#6366f1'"
          @mouseleave="onHoverStar = '#FFFFFF'"
          @click="getScriptList.setFavorite(false)"
          :size="24"
          :fillColor="onHoverStar"
        />
        <Refresh
          class="cursor-pointer"
          @mouseover="onHoverRefresh = '#6366f1'"
          @mouseleave="onHoverRefresh = '#FFFFFF'"
          @click="$emit('RefreshScript')"
          :size="24"
          :fillColor="onHoverRefresh"
        />
      </div>
      <input
              type="text"
              class="text-xs text-white p-2 border border-1 border-indigo-800 hover:border-indigo-500 transition-all ease-in-out duration-500 rounded-md text-center tracking-tight focus:bg-zinc-800 focus:text-white focus:border-indigo-600 w-full bg-indigo-700 mx-2 h-6" placeholder="Search"
            />
      <div class="relative flex flex-row" ref="target">
        <FilterMultiple
          class="cursor-pointer"
          @mouseover="onHoverFilter = '#6366f1'"
          @mouseleave="onHoverFilter = '#FFFFFF'"
          @click="showFillter = !showFillter"
          :size="24"
          :fillColor="onHoverFilter"
        />
        <div
          v-if="showFillter"
          class="absolute right-8 top-0 bg-zinc-900 border border-1 border-zinc-700 w-48 z-10 rounded-lg transition-all duration-150"
        >
          <div class="flex flex-col justify-start p-4 text-white">
            <span class="text-gray-400 text-left tracking-widest">SETTING FILTER</span>
            <ul class="flex flex-col items-start justify-start mt-2">
              <li>
                <label class="form-check cursor-pointer">
                  <input
                    v-model="jsx"
                    @click="store.setFilterList('jsx')"
                    class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer hover:bg-indigo-400 hover:border-indigo-400"
                    type="checkbox"
                  />
                  JSX
                </label>
              </li>
              <li>
                <label class="form-check cursor-pointer">
                  <input
                    v-model="jsxbin"
                    @click="store.setFilterList('jsxbin')"
                    class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-indigo-500 checked:border-indigo-500 focus:outline-bottom transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer hover:bg-indigo-400 hover:border-indigo-400"
                    type="checkbox"
                  />
                  JSXBIN
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col h-screen scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-zinc-800 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full border bottom-1 border-zinc-700 rounded-md"
    >
      <listMode
        v-on:dblclick="runFile(list.path)"
        v-for="list in AfterFilter"
        :list="list"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref, computed, watch, onMounted } from "vue";
import StarOutline from "vue-material-design-icons/StarOutline.vue";
import Star from "vue-material-design-icons/Star.vue";
import FilterMultiple from "vue-material-design-icons/FilterMultiple.vue";
import Refresh from "vue-material-design-icons/Refresh.vue";
import listMode from "./listMode.vue";

import { useSetting } from "../store/store";
import { useScriptList } from "../store/scriptList";

import { evalFile } from "../lib/utils";

const store = useSetting();
const getScriptList = useScriptList();

const props = defineProps({
  search: {
    type: String,
    default: "",
  },
});

const onHoverStar = ref("#FFFFFF");
const onHoverFilter = ref("#FFFFFF");
const onHoverRefresh = ref("#FFFFFF");
const showFillter = ref(false);
const target = ref(null);
const jsx = ref(store.getfilterList.includes("jsx"));
const jsxbin = ref(store.getfilterList.includes("jsxbin"));

let runFile = (file: string) => {
  evalFile(file);
};

const ScriptList = computed(() => {
  return getScriptList.getFavorite
    ? getScriptList.getFavoriteList.filter(
        (v) =>
          v.title.toLocaleLowerCase().includes(props.search) ||
          v.realName.toLocaleLowerCase().includes(props.search)
      )
    : getScriptList.getInstalledList.filter(
        (v) =>
          v.title.toLocaleLowerCase().includes(props.search) ||
          v.realName.toLocaleLowerCase().includes(props.search)
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

watch(
  store.getfilterList,
  (state) => {
    jsx.value = state.includes("jsx") ? true : false;
    jsxbin.value = state.includes("jsxbin") ? true : false;
  },
  { deep: true }
);

onMounted(() => {
  const filterList = ["jsx", "jsxbin"];

  if (localStorage.getItem("filter") === null)
    localStorage.setItem("filter", JSON.stringify(filterList));
  else {
    const local = JSON.parse(localStorage.getItem("filter") || "[]");
    filterList.forEach((val: string) => {
      if (local.includes(val)) store.setFilterList(val);
    });
  }
});

onClickOutside(target, () => {
  showFillter.value = false;
});
</script>
