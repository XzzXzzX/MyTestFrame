import { ModuleTypes } from "../data/CommonEnumTypes";
import { GameAsset } from "../data/AssetConfig";
import { logError, logN } from "../util/AppLog";

/**
 * xuan
 * 2019-5-13 16:17:29
 * 资源管理
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class AssetManager {
    private static _instance: AssetManager = null;

    /** 已加载列表 */
    _assetsLoadedMaps = [];

    public static getInstance(): AssetManager {
        if (null == this._instance) {
            this._instance = new AssetManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void {
        // 加载全局资源
        this.loadAsset(ModuleTypes.GlobalAsset);
    }

    /**
     * 预先资源加载
     * @param moduleName 模块名
     * @param loadProcessCB 加载进度回调
     * @param loadFinishCb 加载完成回调
     * @param bReload 重新加载
     */
    public loadAsset(moduleName: string, loadProcessCB?: any, loadFinishCb?: any, bReload?: boolean): void {
        let assetArr: any = GameAsset[moduleName] || [];
        let loadArr: any[] = this._assetsLoadedMaps[moduleName] || [];
        // 已加载过了。
        if (loadArr && loadArr.length >= 0 && !bReload) {
            return;
        }

        loadArr = this._getUniqueList(loadArr, assetArr);
        this._assetsLoadedMaps[moduleName] = assetArr;

        cc.loader.loadResArray(loadArr, cc.Prefab,
            (curCount: number, totalCount: number): void => {
                if (loadProcessCB) {
                    loadProcessCB(curCount, totalCount);
                }
            },
            (error: any, assets: any): void => {
                if (error) {
                    logError("zx_ load [%s] res error: ", moduleName, error);
                    return;
                }
                logN('assets: ', assets);

                if (loadFinishCb) {
                    loadFinishCb();
                }
            });
    }

    _getUniqueList(sourList: any[], destList: any[]): any[] {
        let ret = [];
        for (let index = 0; index < destList.length; index++) {
            const element = destList[index];
            if (sourList.indexOf(element) == -1) {
                ret.push(element);
            }
        }
        return ret;
    }
}
