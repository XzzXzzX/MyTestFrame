import { PBBuild } from "../proto/PBBuild";
import EventManager from "./EventManager";
import { EventType } from "../data/EventType";
import WSocket from "../net/WSocket";
import { ProtoCodeType } from "../net/ProtoType";

/**
 * xuan
 * 2019-6-14 17:50:52
 * socket管理类
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class SocketManager {
    private static _instance: SocketManager = null;

    /** websocket */
    private _ws: WSocket = null;
    /** 当前socket连接地址 */
    private _curSocketUrl: string = '';
    /** socket回调map */
    private _socketCBMap = {};
    /** 添加的监听回调map */
    private _msgListenerCBMap = {};
    /** 连接成功回调 */
    private _openCB: any = null;
    /** 接受到消息回调 */
    private _msgCB: any = null;
    /** 错误回调 */
    private _errCB: any = null;
    /** 关闭回调 */
    private _closeCB: any = null;

    MAX_RECONNECT_TIMES: number = 3;
    _reconnectTimes: number = 0;

    /** 重联 */
    _isReconnect: boolean = false;

    public static getInstance(): SocketManager {
        if (null == this._instance) {
            this._instance = new SocketManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void {
        this.addEvent();
    }

    private addEvent(): void {
        EventManager.getInstance().addListener(EventType.SOCKET_SEND, this.onSendMsg, this);
    }

    /**
     * 
     * @param url websocket连接地址
     */
    public createSocket(url: string, openCB?: any, msgCB?: any, errCB?: any, closeCB?: any): void {
        // if (url == this._curSocketUrl) {
        //     return;
        // }
        if (null != this._ws) {
            this._ws.closeWS();
        }
        this._curSocketUrl = url;

        this._ws = new WSocket(url);
        this._ws.setWSCallback(
            this.onSocketOpen.bind(this),
            this.onSocketMsg.bind(this),
            this.onSocketErr.bind(this),
            this.onSocketClose.bind(this),
        );
        console.log("创建socket连接： ", this._curSocketUrl);
        // this._ws.onopen = this.onSocketOpen.bind(this);
        // this._ws.onmessage = this.onSocketMsg.bind(this);
        // this._ws.onerror = this.onSocketErr.bind(this);
        // this._ws.onclose = this.onSocketClose.bind(this);
        this._openCB = openCB;
        this._msgCB = msgCB;
        this._errCB = errCB;
        this._closeCB = closeCB;

        this._reconnectTimes++;
    }

    public reconnect(): void {
        if (this._reconnectTimes < this.MAX_RECONNECT_TIMES) {
            console.log("尝试socket重联： ", this._curSocketUrl);
            this.createSocket(this._curSocketUrl, this._openCB, this._msgCB, this._errCB, this._closeCB);
            this._isReconnect = true;
            // this._reconnectTimes++;
        } else {
            console.log('放弃重联，弹窗');
            this._isReconnect = false;
        }
    }

    public closeSocket(): void {
        console.log("关闭 socket ： ");
        if (null != this._ws) {
            this._ws.closeWS();
            this._ws = null;
        }
        this._ws = null;
    }


    /**
     * 发送消息
     * @param code 消息码
     * @param body 消息体
     */
    public sendMsg(code: number, body?: any): void {
        if (!this._ws) {
            console.error('socket 未连接');
            return;
        }
        let pbFile: string = ProtoCodeType[code];
        let msg: any = PBBuild.encodePB(pbFile, "MsgPB");
        msg.code = code;
        msg.body = body.encode().toBuffer();

        cc.log("发送socket消息： ============> ", code, body);
        // this._ws.sendMsg(msg.encode().toBuffer());
        this._ws.sendMsg(code, body);
    }

    /**
     * 添加消息监听
     * @param code 协议号
     * @param cb 消息回调
     */
    public addMsgListener(code: number, cb: any): void {
        this._msgListenerCBMap[code] = cb;
    }

    public removeMsgListener(code: number): void {
        delete this._msgListenerCBMap[code];
    }

    public getSocket(): WSocket {
        return this._ws;
    }

    public getCBByCode(code: number): any {
        return this._msgListenerCBMap[code];
    }


    //#region socket回调及事件相关
    /**
     * websocket连接成功
     */
    private onSocketOpen(msg: MessageEvent): void {
        cc.log("socket connect succuss:", msg);
        if (this._openCB) {
            this._openCB(msg);
        }
        this._reconnectTimes = 0;
    }

    /**
     * 接收到服务器返回消息
     */
    private onSocketMsg(msg: MessageEvent): void {
        // cc.log("socket msg:" , msg);
        let data: any = msg.data;
        // cc.log("msg data: ", data);

        // 服务器返回的protobuf数据被整合为一个blob数据了，
        // 解析blob数据
        var reader: FileReader = new FileReader();
        reader.readAsArrayBuffer(data);
        reader.onload = function (e) {
            if (e) {
                cc.log(e);
            }
            var buf = new Uint8Array(<any>reader.result);

            let msgBody: any = PBBuild.decodePB("proto/TestPB", "MsgPB");
            let msgInfo: any = msgBody.decode(buf);
            let body: any = PBBuild.decodePB("proto/TestPB", "WSMessage");
            let bodyInfo: any = body.decode(msgInfo.body);
            cc.log("接收socket消息： ============> ", msgInfo.code, bodyInfo);

            // 执行监听函数回调
            let cb: any = SocketManager.getInstance().getCBByCode(msgInfo.code);
            if (cb) {
                cb({ code: msgInfo.code, body: bodyInfo });
            }

            if (SocketManager.getInstance()._msgCB) {
                SocketManager.getInstance()._msgCB({ code: msgInfo.code, body: bodyInfo });
            }
        }
    }

    private onSocketErr(msg: MessageEvent): void {
        cc.log("socket err:", msg);
        if (this._errCB) {
            this._errCB(msg);
        }
        this._ws = null;
        // 3秒后重联
        setTimeout(this.reconnect.bind(this), 3000);
    }

    /**
     * 连接关闭
     */
    private onSocketClose(msg: MessageEvent): void {
        cc.log("socket close:", msg);
        if (this._closeCB) {
            this._closeCB(msg);
        }
        this._ws = null;
    }

    /**
     * 收到事件：发消息
     * @param data {code:number, body: {}}
     */
    private onSendMsg(data: any): void {
        if (null == data) {
            return;
        }
        this.sendMsg(data.code, data.body);
    }

    //#endregion

}