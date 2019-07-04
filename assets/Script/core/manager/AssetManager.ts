import { ModuleTypes } from "../data/CommonEnumTypes";
import { GameAsset } from "../data/AssetConfig";

/**
 * xuan
 * 2019-5-13 16:17:29
 * 资源管理
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class AssetManager {
    private static _instance: AssetManager = null;

    public static getInstance(): AssetManager
    {
        if (null == this._instance)
        {
            this._instance = new AssetManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void
    {
        // 加载全局资源
        this.preLoadAsset(ModuleTypes.GlobalAsset);
    }

    /**
     * 预先资源加载
     * @param loadProcessCB 加载进度回调
     * @param loadFinishCb 加载完成回调
     */
    public preLoadAsset(moduleName:string, loadProcessCB?:any, loadFinishCb?:any): void
    {
        let assetArr: any = GameAsset[moduleName] || [];
        cc.loader.loadResArray(assetArr, cc.Prefab, 
            (curCount:number, totalCount: number):void=>{
                if (loadProcessCB)
                {
                    loadProcessCB(curCount, totalCount);
                }
            }, 
            (error:any,assets:any):void=>
            {
                if (error)
                {
                    cc.error("zx_ load [%s] res error: ", moduleName, error);
                    return; 
                }

                if (loadFinishCb)
                {
                    loadFinishCb();
                }
        });
    }
}
