<template>
  <article class="text-white w-full p-2">
    <div class="flex flex-row border-b-2 border-gray-700 hover:border-pink-500">
      <div
        class="grid grid-cols-12 w-full justify-items-start items-center hover:bg-gray-500 cursor-default group"
      >
        <div
          class="col-span-1 w-full h-10 flex flex-row justify-center items-center"
          v-if="store.getFavoriteStatus"
        >
          <StarOutline
            v-if="!props.list.fav"
            @mouseover="onHoverStar = '#ec4899'"
            @mouseleave="onHoverStar = '#FFFFFF'"
            @click="SetFavorite()"
            :size="24"
            :fillColor="onHoverStar"
          />
          <Star
            v-else
            @mouseover="onHoverStar = '#ec4899'"
            @mouseleave="onHoverStar = '#FFFFFF'"
            @click="SetFavorite()"
            :size="24"
            :fillColor="onHoverStar"
          />
        </div>
        <div class="col-span-4 w-full h-10" v-if="store.getImageStatus">
          <img
            v-if="props.list.image != ''"
            class="w-full h-10 object-cover"
            :src="props.list.image"
          />
        </div>
        <div
          class="w-full text-start pl-2"
          :class="[
            store.getImageStatus ? 'col-span-6' : 'col-span-10 pt-2 pb-2',
          ]"
        >
          {{ props.list.title || props.list.realName }}
        </div>
        <div
          class="group-hover:block w-full col-span-1"
          v-if="store.getActionStatus"
        >
          <div class="flex justify-center items-center">
            <LeadPencil
              @mouseover="onHoverPencile[0] = '#ec4899'"
              @mouseleave="onHoverPencile[0] = '#FFFFFF'"
              :fillColor="onHoverPencile[0]"
              :size="24"
            />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import LeadPencil from "vue-material-design-icons/LeadPencil.vue";
import StarOutline from "vue-material-design-icons/StarOutline.vue";
import Star from "vue-material-design-icons/Star.vue";
import { useSetting } from "../store/store";
import { useScriptList } from "../store/scriptList";
import { fs, os, path, buffer } from "../lib/node";
import { csi } from "../lib/utils";

const store = useSetting();
const ScriptList = useScriptList();

interface List {
  list: ListInterface;
}

interface ListInterface {
  image?: string;
  title?: string;
  realName: string;
  path: string;
  fav: boolean;
}

const props = defineProps<List>();
const onHoverStar = ref("#FFFFFF");
const onHoverPencile = ref(["#FFFFFF"]);
const extRoot = ref("");
const extScript = ref("");
const customScriptLocationFile = ref("");

onMounted(() => {
  if (window.cep) {
    extRoot.value = csi.getSystemPath("extension");
    extScript.value = csi.getSystemPath("hostApplication");
    customScriptLocationFile.value = `${extRoot.value}/assets/customScript.json`;
  }
});

let SetFavorite = () => {
  ScriptList.setScriptFav(props.list.realName);
  fs.writeFile(
    customScriptLocationFile.value,
    JSON.stringify(ScriptList.getFavoriteList),
    (error) => {
      if (error) {
        console.log("An error has occurred ", error);
        return;
      }
    }
  );
};
</script>
