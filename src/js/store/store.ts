import { defineStore } from "pinia";

interface Setting {
  action: boolean,
  image: boolean,
  favorite: boolean,
  filterList: string[],
  viewMode: string,
  about: boolean
}

export const useSetting = defineStore("setting", {
  state: (): Setting => ({
    action: false,
    image: false,
    favorite: true,
    filterList: ["jsx", "jsxbin"],
    viewMode: "list",
    about: false
  }),
  getters: {
    getActionStatus: (state) => state.action,
    getImageStatus: (state) => state.image,
    getFavoriteStatus: (state): boolean => state.favorite,
    getViewMode: (state): string => state.viewMode,
    getfilterList: (state): string[] => state.filterList,
    getAboutStatus: (state) => state.about,
  },
  actions: {
    setActionStatus() {
      this.action != this.action;
    },
    setFilterList(payload: string) {
      if (this.getfilterList.includes(payload))
        this.filterList = this.filterList.filter((v) => payload != v)
      else this.filterList.push(payload)

      localStorage.setItem("filter", JSON.stringify(this.getfilterList));
    },
    setImageStatus() {
      this.image = !this.image;
    },
    setAboutStatus() {
      this.about = !this.about;
    },
    setFavoriteStatus() {
      this.favorite = !this.favorite;
    },
    setViewMode(payload: string) {
      this.viewMode = payload
    }
  },
});
