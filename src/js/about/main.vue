<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fs, os, path, buffer } from "../lib/node";
import {
  csi,
  evalES,
  evalFile,
  openLinkInBrowser,
  subscribeBackgroundColor,
} from "../lib/utils";
import "../index.scss";
import list from "./list.vue";
import setting from "./setting.vue";
import { useScriptList } from "../store/scriptList";
import CardDonateVue from "./component/CardDonate.vue";

const getScriptList = useScriptList();
const Search = ref("");
const backgroundColor = ref("#282c34");
const locationScript = ref("");
const locationScriptPanel = ref("");
const extRoot = ref("");
const extScript = ref("");
const ScriptLocationFile = ref("");
const customScriptLocationFile = ref("");

onMounted(() => {
  if (window.cep) {
    subscribeBackgroundColor((c: string) => {
      backgroundColor.value = c;
    });

    extRoot.value = csi.getSystemPath("extension");
    extScript.value = csi.getSystemPath("hostApplication");
    locationScript.value =
      extScript.value.slice(0, extScript.value.length - 11) + "Scripts";
    locationScriptPanel.value =
      extScript.value.slice(0, extScript.value.length - 11) +
      "Scripts/ScriptUI Panels";
    ScriptLocationFile.value = `${extRoot.value}/assets/script.json`;
    customScriptLocationFile.value = `${extRoot.value}/assets/customScript.json`;

    if (fs.existsSync(ScriptLocationFile.value)) {
      fs.readFile(ScriptLocationFile.value, (err, data) => {
        if (err) {
          alert("File read failed:" + err);
          return;
        }
        const dataScript = JSON.parse(data.toString());
        if (dataScript.length <= 0) loadFromLocal();
        else getScriptList.setInstalledList(dataScript);
      });
    } else {
      loadFromLocal();
    }
  }
});

let loadFromLocal = () => {
  fs.readdir(locationScript.value, (err, files) => {
    let imagePath: string[] = [];
    files.forEach((file, index) => {
      let ext = path.extname(file);

      if (ext === `.jsx` || ext === `.jsxbin`) {
        getScriptList.addInstalledList({
          path: locationScript.value + "/" + file,
          image: "",
          title: "",
          fav: false,
          realName: file,
        });
      }

      if (ext === `.jpg` || ext === `.jpeg` || ext === `.png`) {
        imagePath.push(file);
      }
    });

    imagePath.forEach((val) => {
      fs.readFile(locationScript.value + "/" + val, (err, data) => {
        getScriptList.addImageFromLocal(
          val,
          "data:image/png;base64," + data.toString("base64")
        );
      });
    });
  });

  fs.readdir(locationScriptPanel.value, (err, files) => {
    files.forEach((file, index) => {
      let ext = path.extname(file);

      if (ext === `.jsxbin`) {
        getScriptList.addInstalledList({
          path: locationScriptPanel.value + "/" + file,
          image: "",
          title: "",
          fav: false,
          realName: file,
        });
      }
    });
  });

  if (fs.existsSync(customScriptLocationFile.value)) {
    fs.readFile(customScriptLocationFile.value, (err, data) => {
      if (err) {
        alert("File read failed:" + err);
        return;
      }

      const fav = JSON.parse(data.toString());

      getScriptList.getInstalledList.forEach((val) => {
        for (let i = 0; i < fav.length; i++) {
          val.realName == fav[i].realName
            ? getScriptList.setScriptFav(fav[i].realName)
            : "";
        }
      });
    });
  } else {
    fs.writeFile(
      customScriptLocationFile.value,
      JSON.stringify([]),
      (error) => {
        if (error) {
          console.log("An error has occurred ", error);
          return;
        }
      }
    );
  }

  fs.writeFile(
    ScriptLocationFile.value,
    JSON.stringify(getScriptList.getInstalledList),
    (error) => {
      if (error) {
        alert(error);
        console.log("An error has occurred ", error);
        return;
      }
    }
  );
};

let RefreshScript = () => {
  getScriptList.setInstalledList([]);
  loadFromLocal();
};
</script>

<template>
  <div
    class="app select-none overflow-hidden"
    :style="{ backgroundColor: backgroundColor }"
  >
    <section class="w-screen h-screen">
      <!-- <CardDonateVue :key="1" /> -->
      <div class="flex flex-start flex-col w-full h-full p-4 m-auto">
        <div class="flex justify-between items-center">
          <h2 class="font-bold text-2xl text-white mb-4">Script Library</h2>
          <setting />
        </div>
        <div class="flex gap-2 justify-center">
          <input
            type="text"
            class="w-full text-xs text-black p-2 outline-1 outline-pink-500 rounded-none"
            v-model="Search"
            placeholder="search script"
          />
        </div>
        <list
          @RefreshScript="RefreshScript"
          :search="Search"
          class="mt-4 h-full overflow-y-auto flex flex-col"
        />
      </div>
    </section>
  </div>
</template>
