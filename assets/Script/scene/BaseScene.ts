import { SceneType, ModuleTypes } from "../core/data/CommonEnumTypes";
import AssetManager from "../core/manager/AssetManager";

/**
 * xuan
 * 2019-8-12 10:46:14
 * 场景基类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseScene extends cc.Component {
    protected sceneType: SceneType = null;
    protected moduleType: ModuleTypes = null;

    protected onLoad()
    {

    }
    
    protected start()
    {
        // 创建模块管理类
        // TestModule.getInstance();

        // 资源加载
        AssetManager.getInstance().preLoadAsset(this.moduleType, (cur, total)=>{
            //加载进度
            // printzx("zx_ load process: " + cur + "/" + total);
        }, ()=>{
            // 打开测试界面
            // UIManager.getInstance().showView(ViewType.TestView, {bStatic:true});
        });
    }
}