import { EventType } from "../../core/data/EventType";
import EventManager from "../../core/manager/EventManager";
import SocketManager from "../../core/manager/SocketManager";
import { s2c } from "../../core/net/ProtoType";

/**
 * xuan
 * 2019-6-20 16:51:39
 * 测试模块实例
 * 处理服务器消息监听及数据
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestModule {

    private static _instance: TestModule = null;

    public static getInstance(): TestModule
    {
        if (null == this._instance)
        {
            this._instance = new TestModule();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void
    {
        // 加载全局资源
        this.addEvent();
    }

    private addEvent(): void
    {

        SocketManager.getInstance().addMsgListener(s2c.Test_PB, this.onTestPBHandle);
    }

    private onTestPBHandle(event: any): void
    {
        // let eventData: any = event.getUserData();
        cc.log("zx_ eventdata: ", event);

        EventManager.getInstance().dispatchEvent(EventType.TEST_1, event);
    }
}