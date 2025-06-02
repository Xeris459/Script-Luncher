import { cep_node, cep, __adobe_cep__ } from "./lib/cep-types";

declare module "*.png";
declare module "*.gif";
declare module "*.jpg";
declare module "*.svg";

declare global {
  interface Window {
    cep_node: cep_node;
    cep: cep;
    __adobe_cep__: __adobe_cep__;
  }

  type folder = {
    path: string;
    deepScan: boolean;
    maxDeepScan: number;
  }

  type settings = {
    action: boolean;
    about: boolean;
    image: boolean;
    favorite: boolean;
    filterList: string[];
    viewMode: "list" | "grid";
    folders: folder[];
    exludeFolderNames: string[];
    preventDuplicate: boolean;
    sort: 'a-z' | 'z-a'
  }

  type installedListInterface = {
    image: string
    title: string
    path: string
    fav: boolean
    realName: string
    hide: boolean
  }
}
