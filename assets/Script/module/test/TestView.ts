import SocketManager from "../../core/manager/SocketManager";
import { PBBuild } from "../../core/proto/PBBuild";
import { c2s } from "../../core/net/ProtoType";
import EventManager from "../../core/manager/EventManager";
import { EventType } from "../../core/data/EventType";
import UIManager from "../../core/manager/UIManager";
import { ViewType } from "../../core/data/ViewType";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestView extends cc.Component {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Node)
    btnConnect: cc.Node = null;

    @property(cc.Node)
    btnSend: cc.Node = null;

    @property(cc.Node)
    btnTest: cc.Node = null;

    @property(cc.Node)
    btnTest1: cc.Node = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.addEvent();
    }

    // update (dt) {}

    onDestroy()
    {
        this.removeEvent();
    }

    private addEvent(): void
    {
        this.btnClose.on("click", this.onCloseClick, this);
        this.btnConnect.on("click", this.onConnectClick, this);
        this.btnSend.on("click", this.onSendClick, this);
        this.btnTest.on("click", this.onTestClick, this);
        this.btnTest1.on("click", this.onTest1Click, this);

        EventManager.getInstance().addListener(EventType.TEST_1, this.onTest1CB, this);
    }

    private removeEvent(): void
    {
        EventManager.getInstance().removeListener(EventType.TEST_1, this.onTest1CB, this);
    }

    private onCloseClick(): void
    {
        cc.game.end();
    }

    private onConnectClick(): void
    {
        this.label.string = "Socket 连接..."

        SocketManager.getInstance().createSocket("ws://127.0.0.1:8888", 
            (msg:any)=>{
                this.label.string = "Socket 连接成功"
            },
            (msg:any)=>{

            },
            (msg:any)=>{
                this.label.string = "Socket 连接错误：" + msg;
            },
            (msg:any)=>{
                this.label.string = "Socket 连接关闭"
            },);
    }

    private onSendClick(): void
    {
        let ts: any = PBBuild.encodePB("proto/TestPB", "WSMessage");
        ts.setId(123);
        ts.setContent('aa');
        ts.setSender('client');
        ts.setTime('0000');
        SocketManager.getInstance().sendMsg(c2s.Test_PB, ts);
    }
    
    private onTestClick(): void
    {
        SocketManager.getInstance().closeSocket();
    }
    
    private onTest1Click(): void
    {
        // UIManager.getInstance().showView(ViewType.TestPopView, {openAni: true});
        UIManager.getInstance().showView(ViewType.SettingView);

        // EventManager.getInstance().dispatchEvent(EventType.SHOW_VIEW, {viewType: ViewType.SettingView});
    }

    private onTest1CB(): void
    {
        cc.log("on Test1 callback");
    }


}
