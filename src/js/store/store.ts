import { defineStore } from "pinia";

export const useSetting = defineStore("setting", {
  state: () => ({
    action: false,
    image: true,
    favorite: true,
    filterList: ["jsx", "jsxbin"],
    viewMode: "list",
    about: false
  }),
  getters: {
    getActionStatus: (state) => state.action,
    getImageStatus: (state) => state.image,
    getFavoriteStatus: (state) => state.favorite,
    getViewMode: (state) => state.viewMode,
    getfilterList: (state) : string[] => state.filterList,
    getAboutStatus: (state) => state.about,
  },
  actions: {
    setActionStatus() {
      this.action != this.action;
    },
    setFilterList(payload: string) {
      if(this.filterList.includes(payload))
        this.filterList = this.filterList.filter((v) => payload != v)
      else this.filterList.push(payload)
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
