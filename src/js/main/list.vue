<template>
  <div>
    <div class="flex flex-row justify-between mb-2">
      <div class="flex flex-row">
        <StarOutline
          v-if="!getScriptList.getFavorite"
          @mouseover="onHoverStar = '#ec4899'"
          @mouseleave="onHoverStar = '#FFFFFF'"
          @click="getScriptList.setFavorite(true)"
          :size="32"
          :fillColor="onHoverStar"
        />
        <Star
          v-else
          @mouseover="onHoverStar = '#ec4899'"
          @mouseleave="onHoverStar = '#FFFFFF'"
          @click="getScriptList.setFavorite(false)"
          :size="32"
          :fillColor="onHoverStar"
        />
        <Refresh
          class="cursor-pointer"
          @mouseover="onHoverRefresh = '#ec4899'"
          @mouseleave="onHoverRefresh = '#FFFFFF'"
          @click="$emit('RefreshScript')"
          :size="32"
          :fillColor="onHoverRefresh"
        />
      </div>
      <div class="relative flex flex-row" ref="target">
        <FilterMultiple
          class="cursor-pointer"
          @mouseover="onHoverFilter = '#ec4899'"
          @mouseleave="onHoverFilter = '#FFFFFF'"
          @click="showFillter = !showFillter"
          :size="32"
          :fillColor="onHoverFilter"
        />
        <div
          v-if="showFillter"
          class="absolute top-8 w-64 right-0 z-10 !bg-slate-50 rounded-lg transition-all duration-150"
        >
          <div class="flex flex-col justify-start p-4">
            <span class="text-gray-400">Setting Filter</span>
            <hr />
            <ul class="flex flex-col items-start justify-start mt-4">
              <li>
                <label class="form-check cursor-pointer">
                  <input
                    v-model="jsx"
                    @click="store.setFilterList('jsx')"
                    class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-pink-500 checked:border-pink-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
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
                    class="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-pink-500 checked:border-pink-500 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
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
      class="flex flex-col h-full scrollbar-thin scrollbar-thumb-pink-700 scrollbar-track-gray-300 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full border bottom-1"
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

interface ListInterface {
  image?: string;
  title?: string;
  realName: string;
  path: string;
  fav: boolean;
}

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
