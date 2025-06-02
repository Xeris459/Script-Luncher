import { onMounted, reactive, ref } from "vue";
import { useScriptList } from "../store/scriptList";
import { useSetting } from "../store/store";
import { storeLogs } from "../store/StoreLog";
import { fs, path } from "../lib/node";
import { csi } from "../lib/utils";

interface FavScript {
    path: string
    image: string
    title: string
    fav: boolean
    hide: boolean
    realName: string
}

const isRequest = ref(false)
const isFirstLoad = ref(true)
const extRoot = ref("")
const customScriptLocationFile = ref("")
const extScript = ref("")
const deepScanCount = ref(1)
const FavStore = ref<FavScript[]>([])

export function useFile() {
    const setting = useSetting()
    const scriptList = useScriptList()

    const SavedScript = scriptList.$state.installedList.filter((v) => {
        return v.fav == true || v.hide == true || v.title != "" || v.image != ""
    })

    if (window.cep) {
        extRoot.value = csi.getSystemPath("myDocuments") + "/Xeris459_production/ScriptLauncher";
        customScriptLocationFile.value = `${extRoot.value}/ScriptLauncher.json`;
        extScript.value = csi.getSystemPath("hostApplication");
    }

    const Store = reactive({
        setting: {
            action: setting.$state.action,
            about: setting.$state.about,
            image: setting.$state.image,
            favorite: setting.$state.favorite,
            filterList: setting.$state.filterList,
            viewMode: setting.$state.viewMode,
            folder: setting.$state.folders,
            exludeFolderName: setting.$state.exludeFolderNames,
            preventDuplicate: setting.$state.preventDuplicate,
        },
        Script: SavedScript
    })

    async function save() {
        Store.setting.action = await setting.$state.action
        Store.setting.about = await setting.$state.about
        Store.setting.image = await setting.$state.image
        Store.setting.favorite = await setting.$state.favorite
        Store.setting.filterList = await setting.$state.filterList
        Store.setting.viewMode = await setting.$state.viewMode
        Store.setting.folder = await setting.$state.folders
        Store.setting.exludeFolderName = await setting.$state.exludeFolderNames
        Store.setting.preventDuplicate = await setting.$state.preventDuplicate

        if (!isFirstLoad.value) {
            Store.Script = await scriptList.$state.installedList.filter((v) => {
                return v.fav == true || v.hide == true || v.title != "" || v.image != ""
            })

            if (FavStore.value.length != Store.Script.length) FavStore.value = Store.Script
        } else {
            Store.Script = FavStore.value
            isFirstLoad.value = false
        }

        fs.writeFile(
            customScriptLocationFile.value,
            JSON.stringify(Store),
            (error) => {
                if (error) return alert("An error has occurred " + error);
            }
        );

    }

    async function load() {
        await CheckFolder()

        if (!isRequest.value) {
            if (fs.existsSync(customScriptLocationFile.value)) {
                fs.readFile(customScriptLocationFile.value, async (err, data) => {
                    if (err) return alert("File read failed:" + err);
                    const fav = await JSON.parse(data.toString());

                    scriptList.setInstalledList([]);

                    if (fav) {
                        Store.setting = await fav.setting
                        Store.Script = await fav.Script
                        FavStore.value = await fav.Script
                    }

                    await loadFromFolder(Store.setting.folder)
                    await loadSetting()

                    isRequest.value = true
                });

            } else {
                fs.writeFile(customScriptLocationFile.value, JSON.stringify(Store), (error) => {
                    if (error) return alert("An error has occurred " + error);

                    load()
                });
            }
        } else {
            await scriptList.setInstalledList([]);
            await loadFromFolder(Store.setting.folder)
        }
    }

    function loadSetting() {
        setting.$state.action = Store.setting.action;
        setting.$state.about = Store.setting.action;
        setting.$state.image = Store.setting.image;
        setting.$state.favorite = Store.setting.favorite;
        setting.$state.filterList = Store.setting.filterList;
        setting.$state.viewMode = Store.setting.viewMode;
        setting.$state.folders = Store.setting.folder;
        setting.$state.exludeFolderNames = Store.setting.exludeFolderName;
        setting.$state.preventDuplicate = Store.setting.preventDuplicate;
    }

    function setHideAndFav() {
        scriptList.getInstalledList.forEach((val) => {
            for (let i = 0; i < Store.Script.length; i++) {
                if (val.realName == Store.Script[i].realName) {
                    // set favorite berdasarkan data
                    scriptList.setScriptFavTrue(Store.Script[i].realName);

                    // set hiden script berdasarkan data
                    if (Store.Script[i].hide) scriptList.setScriptHide(Store.Script[i].realName)
                }
            }
        });
    }

    async function CheckFolder() {
        if (!fs.existsSync(extRoot.value)) await fs.mkdirSync(extRoot.value, { recursive: true });
    }

    function deepScan(PathArray: string, deep: boolean = false, deepCountMax: number = 1, root: boolean = false, exclude: string[] = []) {
        try {
            if (root) deepScanCount.value = 1;

            fs.readdir(PathArray, async (err, files) => {
                if (err) return alert("File read failed: " + err);

                let imagePath: string[] = [];
                await files.forEach((file, index) => {
                    let ext = path.extname(file);

                    fs.lstat(PathArray + "/" + file, (err, stats) => {
                        if (exclude.includes(file)) return;

                        if (stats.isDirectory()) {
                            if (deep && deepScanCount.value <= deepCountMax) {
                                deepScanCount.value = deepScanCount.value - 1;
                                deepScan(PathArray + "/" + file, deep, 1, false, exclude)
                            }
                        } else {
                            if (stats.isFile()) {
                                if (ext === `.jsx` || ext === `.jsxbin`) {
                                    const Find: FavScript | undefined = FavStore.value.find((x: FavScript) => x.realName == file)

                                    // prevent duplicate
                                    if (Store.setting.preventDuplicate) {
                                        const isExist = scriptList.getInstalledList.find((x) => x.realName == file);
                                        if (isExist) return;
                                    }

                                    if (Find) {
                                        const FindScript: FavScript = Find
                                        scriptList.addInstalledList({
                                            path: PathArray + "/" + file,
                                            image: FindScript.image,
                                            title: FindScript.title,
                                            fav: FindScript.fav,
                                            hide: FindScript.hide,
                                            realName: file,
                                        });
                                    } else {
                                        scriptList.addInstalledList({
                                            path: PathArray + "/" + file,
                                            image: "",
                                            title: "",
                                            fav: false,
                                            hide: false,
                                            realName: file,
                                        });
                                    }
                                }

                                // if (ext === `.jpg` || ext === `.jpeg` || ext === `.png`) imagePath.push(file);

                                // imagePath.forEach((val) => {
                                //     fs.readFile(PathArray + "/" + val, (err, data) => {
                                //         if (err) return alert("File read failed: " + err);

                                //         const convert = "data:image/png;base64," + data.toString("base64"); // convert image file to base64 URI format

                                //         scriptList.addImageFromLocal(val, convert);
                                //     });
                                // });
                            }
                        }
                    });

                })
            })
        } catch (error) {
            storeLogs().addLog({
                type: "error",
                message: `Error during deep scan: ${error}`,
                time: new Date().toLocaleTimeString(),
            });
            console.error("Error during deep scan:", error);
        }
    }

    async function loadFromFolder(PathArray: any[]) {

        await PathArray.forEach(async (value) => {
            const scriptPath = value.path.includes(":/") || value.path.includes(":\\") ? value.path : extScript.value.slice(0, extScript.value.length - 11) + value.path

            deepScan(scriptPath, value.deepScan, value.maxDeepScan, true, value.exludeFolderName)
            setHideAndFav()
        })


    }

    return { save, load }
}