import AssetManager from "../core/manager/AssetManager";
import UIManager from "../core/manager/UIManager";
import { ModuleTypes } from "../core/data/CommonEnumTypes";
import { PBBuild } from "../core/proto/PBBuild";
import { ViewType } from "../core/data/ViewType";
import TestModule from "../module/test/TestModule";
import { printzx } from "../core/util/AppLog";

/**
 * xuan
 * 2019-7-3 19:45:52
 * 测试场景
 * 测试整个框架相关内容
 * protobuf
 * 模块管理Module
 * 资源管理
 * 界面显示
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestScene extends cc.Component {
    start() {
        // 加载pb文件
        PBBuild.init();

        // 创建模块管理类
        TestModule.getInstance();

        // 资源加载
        AssetManager.getInstance().preLoadAsset(ModuleTypes.TestModule, (cur, total) => {
            //加载进度
            printzx("zx_ load process: " + cur + "/" + total);
        }, () => {
            // 打开测试界面
            UIManager.getInstance().showView(ViewType.TestView, { bStatic: true });
        });
    }
}