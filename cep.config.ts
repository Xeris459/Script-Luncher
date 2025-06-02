import { CEP_Config } from "vite-cep-plugin";
import { version } from "./package.json";

const config: CEP_Config = {
  version,
  id: "com.axerisu.ScriptLibrary",
  displayName: "ScriptLibraryLauncher",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [
    {
      name: "AEFT",
      version: "[0.0,99.9]",
    },
  ],

  type: "Panel",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 500,
  height: 550,

  panels: [
    {
      mainPath: "./main/index.html",
      name: "main",
      panelDisplayName: "Script Library Launcher",
      autoVisible: true,
      width: 600,
      height: 650,
    },
  ],
  build: {
    jsxBin: "copy",
    sourceMap: true,
  },
  zxp: {
    country: "ID",
    province: "KT",
    org: "YukihanaStudio",
    password: "yukihanaStudio",
    tsa: "http://timestamp.digicert.com/",
    sourceMap: false,
    jsxBin: "replace",
    allowSkipTSA: true,
  },
  installModules: ["pinia", "vue3-popper"],
  copyAssets: [],
};
export default config;
