import { defineStore } from "pinia";

export const useSetting = defineStore("setting", {
  state: (): settings => ({
    action: false,
    image: false,
    favorite: true,
    filterList: ["jsx", "jsxbin"],
    viewMode: "list",
    about: false,
    folders: [{ path: "Scripts", deepScan: true, maxDeepScan: 1 }],
    exludeFolderNames: ["(instructional)", "(support)", "Shutdown", "Startup", "mac"],
    preventDuplicate: true,
    sort: "a-z",
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
    setViewMode(payload: "list" | "grid") {
      this.viewMode = payload
    },
    removeFolder(payload: string) {
      this.folders = this.folders.filter((v) => v.path != payload);
    },
    addFolder(payload: folder) {
      this.folders.push(payload);
    },
  },
});
