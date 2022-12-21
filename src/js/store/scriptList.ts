import { defineStore } from "pinia";

export const useScriptList = defineStore("scriptlist", {
  state: (): Store => {
    return {
      installedList: [],
      favorite: false,
      hiden: true
    }
  },
  getters: {
    getInstalledList: (state) => {
      let unHideList;
      if (state.hiden)
        unHideList = state.installedList.filter(v => v.hide == false)
      else
        unHideList = state.installedList

      return unHideList.sort((a, b) => a.realName.localeCompare(b.realName.toString()))
    },
    getFavoriteList: (state) => {
      let unHideList;
      if (state.hiden)
        unHideList = state.installedList.filter(v => v.hide == false)
      else
        unHideList = state.installedList

      return unHideList.filter((v) => v.fav == true)
    },
    getFavorite: (state) => state.favorite,
    getHiddenStatus: (state) => state.hiden,
    getByRealName: (state) => {
      const ActiveList = state.installedList.filter(v => v.fav == state.favorite)

      return ActiveList
    },
  },
  actions: {
    setFavorite(payload: boolean) {
      this.favorite = payload;
    },
    setScriptFav(id: any) {
      this.installedList.forEach((val, index) => {
        if (val.realName == id) this.installedList[index].fav = !this.installedList[index].fav
      })
    },
    setScriptFavTrue(id: any) {
      this.installedList.forEach((val, index) => {
        if (val.realName == id) this.installedList[index].fav = true
      })
    },
    setScriptHide(id: any) {
      this.installedList.forEach((val, index) => {
        if (val.realName == id) this.installedList[index].hide = true
      })
    },
    setInstalledList(payload: any) {
      this.installedList = payload
    },
    addInstalledList(payload: any) {
      this.installedList.push(payload)
    },
    addImageFromLocal(name: string, path: string) {
      this.installedList.forEach((val, index) => {
        const valSplit = val.realName.split('.')
        const nameSplit = name.split('.')

        if (valSplit[0] == nameSplit[0]) this.installedList[index].image = path
      })
    }
  },
});

interface Store {
  installedList: installedListInterface[],
  favorite: boolean
  hiden: boolean
}

interface installedListInterface {
  image: string
  title: string
  path: string
  fav: boolean
  realName: string
  hide: boolean
}