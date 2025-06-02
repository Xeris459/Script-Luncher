import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useSetting } from "./store";

export const useScriptList = defineStore("scriptlist", () => {
  const installedList = ref<installedListInterface[]>([]);
  const favorite = ref<boolean>(false);
  const hiden = ref<boolean>(true);
  const setting = useSetting();

  const getInstalledList = computed(() => {
    let unHideList;
    if (hiden.value)
      unHideList = installedList.value.filter(v => v.hide == false)
    else
      unHideList = installedList.value;

    if (setting.$state.preventDuplicate) {
      const uniqueList = unHideList.reduce((acc: installedListInterface[], current) => {
        const x = acc.find(item => item.realName === current.realName);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      unHideList = uniqueList;
    }

    if (setting.$state.sort == 'z-a') {
      unHideList = unHideList.sort((a, b) => b.realName.toLocaleLowerCase().localeCompare(a.realName.toLocaleLowerCase().toString()));
    } else {
      unHideList = unHideList.sort((a, b) => a.realName.toLocaleLowerCase().localeCompare(b.realName.toLocaleLowerCase().toString()));
    }

    return unHideList;
  });

  const getFavoriteList = computed(() => {
    let unHideList;
    if (hiden.value)
      unHideList = getInstalledList.value.filter(v => v.hide == false)
    else
      unHideList = getInstalledList.value;

    return unHideList.filter((v) => v.fav == true);
  });

  const getFavorite = computed(() => favorite.value);
  const getHiddenStatus = computed(() => hiden.value);

  const getByRealName = computed(() => {
    const ActiveList = getInstalledList.value.filter(v => v.fav == favorite.value);
    return ActiveList;
  });

  function setFavorite(payload: boolean) {
    favorite.value = payload;
  }

  function setScriptFav(id: any) {
    installedList.value.forEach((val, index) => {
      if (val.realName == id) installedList.value[index].fav = !installedList.value[index].fav;
    });
  }

  function setScriptFavTrue(id: any) {
    installedList.value.forEach((val, index) => {
      if (val.realName == id) installedList.value[index].fav = true;
    });
  }

  function setScriptHide(id: any) {
    installedList.value.forEach((val, index) => {
      if (val.realName == id) installedList.value[index].hide = true;
    });
  }

  function setInstalledList(payload: any) {
    installedList.value = payload;
  }

  function addInstalledList(payload: any) {
    installedList.value.push(payload);
  }

  function addImageFromLocal(name: string, path: string) {
    installedList.value.forEach((val, index) => {
      const valSplit = val.realName.split('.');
      const nameSplit = name.split('.');

      if (valSplit[0] == nameSplit[0]) installedList.value[index].image = path;
    }
    );
  }

  return {
    installedList,
    favorite,
    hiden,

    getInstalledList,
    getFavoriteList,
    getFavorite,
    getHiddenStatus,
    getByRealName,

    setFavorite,
    setScriptFav,
    setScriptFavTrue,
    setScriptHide,
    setInstalledList,
    addInstalledList,
    addImageFromLocal
  }
});