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

    ],

    [ModuleTypes.TestModule]: [
        ViewType.TestView,
        ViewType.TestPopView,
    ],

    [ModuleTypes.PhysicWorld]: [
        ViewType.Egg,
        ViewType.Box20,
        ViewType.Box40,
        ViewType.Box80,
        ViewType.Box80S,
        ViewType.Circle20,
        ViewType.Circle40,
        ViewType.Circle80,
        ViewType.Platform160,
        ViewType.Platform320,
        ViewType.star,
        ViewType.PhysicsView,
    ],

}