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

    [ModuleTypes.Xiaoxiaole]: [
        ViewType.XiaoxiaoleView,
        ViewType.Bear,
        ViewType.Bird,
        ViewType.BombWhite,
        ViewType.Cat,
        ViewType.Chicken,
        ViewType.Crush,
        ViewType.Fox,
        ViewType.Frog,
        ViewType.Horse,
    ]
}