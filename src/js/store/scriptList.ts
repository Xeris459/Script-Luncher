import { defineStore } from "pinia";

export const useScriptList = defineStore("scriptlist", {
  state: (): Store => {
    return {
        installedList: [],
        favorite: false
    }
  },
  getters: {
    getInstalledList: (state) => state.installedList.sort(function (a, b) {
      return a.realName.localeCompare(b.realName.toString());
  }),
    getFavoriteList: (state) => state.installedList.filter((v) => v.fav == true),
    getFavorite: (state) => state.favorite

  },
  actions: {
    setFavorite(payload: boolean) {
      this.favorite = payload;
    },
    setScriptFav(id: string) {
      this.installedList.forEach((val, index) => {
        if(val.realName == id) this.installedList[index].fav = !this.installedList[index].fav
      })
    },
    setInstalledList(payload: any) {
        this.installedList = payload
    },
    addInstalledList(payload: any) {
        this.installedList.push(payload)
    },
    addImageFromLocal(name: string, path: string){
      this.installedList.forEach((val, index) => {
        const valSplit = val.realName.split('.')
        const nameSplit = name.split('.')

        if(valSplit[0] == nameSplit[0]) this.installedList[index].image = path
      })
    }
  },
});

interface Store {
    installedList: installedListInterface[],
    favorite: boolean
}

interface installedListInterface {
    image: String
    title: String
    path: String
    fav: boolean
    realName: String
}