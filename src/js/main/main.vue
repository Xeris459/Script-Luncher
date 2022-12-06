<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fs, path } from "../lib/node";
import { csi, subscribeBackgroundColor } from "../lib/utils";
import "../index.scss";
import list from "./list.vue";
import setting from "./setting.vue";
import { useScriptList } from "../store/scriptList";
import { useSetting } from "../store/store";
import cardDonate from "./CardDonate.vue";

const getScriptList = useScriptList();
const getSetting = useSetting();
const Search = ref("");
const backgroundColor = ref("#18181b");
const locationScript = ref("");
const locationScriptPanel = ref("");
const extRoot = ref("");
const extScript = ref("");
const ScriptLocationFile = ref("");
const customScriptLocationFile = ref("");

onMounted(async () => {
  if (window.cep) {
    subscribeBackgroundColor((c: string) => {
      backgroundColor.value = c;
    });

    extRoot.value =
      csi.getSystemPath("myDocuments") + "/Xeris459_production/ScriptLauncher";
    extScript.value = csi.getSystemPath("hostApplication");

    locationScript.value =
      extScript.value.slice(0, extScript.value.length - 11) + "Scripts";
    locationScriptPanel.value =
      extScript.value.slice(0, extScript.value.length - 11) +
      "Scripts/ScriptUI Panels";

    ScriptLocationFile.value = `${extRoot.value}/ScriptLauncher.json`;
    customScriptLocationFile.value = `${extRoot.value}/customScriptLauncher.json`;

    if (!fs.existsSync(extRoot.value)) {
      await fs.mkdirSync(extRoot.value, { recursive: true });
    }

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

let loadFromLocal = async () => {
  // define folder for scan
  const ScriptScan = ["Scripts", "Scripts/ScriptUI Panels"];

  // loop define folder
  ScriptScan.forEach(async (value) => {
    // get real path
    const scriptPath =
      extScript.value.slice(0, extScript.value.length - 11) + value;

    // read file in scriptPath
    await fs.readdir(scriptPath, async (err, files) => {
      if (err) return alert("File read failed: " + err); // throw error when error

      let imagePath: string[] = []; // define image path
      await files.forEach((file, index) => {
        // loop all list of file
        let ext = path.extname(file); // get extension of file

        if (ext === `.jsx` || ext === `.jsxbin`) {
          // save data of file to pinia
          getScriptList.addInstalledList({
            path: locationScript.value + "/" + file,
            image: "",
            title: "",
            fav: false,
            realName: file,
          });
        }

        if (ext === `.jpg` || ext === `.jpeg` || ext === `.png`)
          imagePath.push(file); // cek if file is image
      });

      // loop list of image
      imagePath.forEach((val) => {
        fs.readFile(locationScript.value + "/" + val, (err, data) => {
          const convert = "data:image/png;base64," + data.toString("base64"); // convert image file to base64 URI format

          getScriptList.addImageFromLocal(val, convert);
        });
      });
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
};

// function for refresh
let RefreshScript = () => {
  getScriptList.setInstalledList([]);
  loadFromLocal();
};

watch(
  getScriptList.getInstalledList, // watch pinia store script list
  async () => {
    await fs.writeFile(
      ScriptLocationFile.value,
      JSON.stringify(getScriptList.getInstalledList),
      (error) => {
        if (error) return alert(error);
      }
    );
  },
  { deep: true }
);
</script>

<template>
  <div
    class="app select-none overflow-hidden"
    :style="{ backgroundColor: backgroundColor }"
  >
    <section class="w-screen h-screen">
      <cardDonate v-if="getSetting.getAboutStatus" />
      <div class="p-2 flex-auto justify-between">
        <div>
          <div class="flex justify-between">
          <h2 class="font-semibold text-2xl text-indigo-500 mb-2 text-center">Script<span class="font-thin text-white">Library</span><sup class="text-xs font-bold">BETA</sup></h2>
          <div class="flex">
            <setting class="mt-2 ml-2 rotate-0"/>
          </div>
          </div>
          
          <div>
          </div>
          <list
          @RefreshScript="RefreshScript"
          :search="Search"
          class="mt-1 h-screen overflow-y-auto flex flex-col w-full"
          />
        </div>
      </div>
    </section>
  </div>
</template>
