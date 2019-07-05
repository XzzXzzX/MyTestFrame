import { ModuleTypes } from "./CommonEnumTypes";
import { ViewType } from "./ViewType";

/**
 * xuan
 * 2019-6-13 11:20:32
 * 资源配置文件，包括资源路径，模块资源等
 */


/**
 * 模块资源
 */
export var GameAsset = {
    [ModuleTypes.GlobalAsset]: [
        ViewType.MaskUI,
        ViewType.SettingView,
    ],

    [ModuleTypes.TestModule]: [
        ViewType.TestView,
        ViewType.TestPopView,
    ],

}