import AssetManager from "../core/manager/AssetManager";
import { ModuleTypes } from "../core/data/CommonEnumTypes";
import UIManager from "../core/manager/UIManager";
import { ViewType } from "../core/data/ViewType";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

/**
 * xuan
 * 2019-8-12 10:42:05
 * 消消乐scene
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class XiaoxiaoleScene extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start()
    {
        // 加载pb文件
        // PBBuild.init();

        // 创建模块管理类
        // TestModule.getInstance();

        // 资源加载
        AssetManager.getInstance().preLoadAsset(ModuleTypes.Xiaoxiaole, (cur, total)=>{
            //加载进度
            // printzx("zx_ load process: " + cur + "/" + total);
        }, ()=>{
            // 打开测试界面
            UIManager.getInstance().showView(ViewType.XiaoxiaoleView, {bStatic:true});
        });
    }

    // update (dt) {}
}
