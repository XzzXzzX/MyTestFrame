import { PBBuild } from "../proto/PBBuild";
import EventManager from "./EventManager";
import { EventType } from "../data/EventType";

/**
 * xuan
 * 2019-6-14 17:50:52
 * socket管理类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class SocketManager {
    private static _instance: SocketManager = null;

    /**
     * websocket
     */
    private _ws: WebSocket = null;

    /**
     * 当前socket连接地址
     */
    private _curSocketUrl: string = '';

    /**
     * socket回调map
     */
    private _socketCBMap = {};

    /**
     * 添加的监听回调map
     */
    private _msgListenerCBMap = {};

    /**
     * 连接成功回调
     */
    private _openCB: any = null;

    /**
     * 接受到消息回调
     */
    private _msgCB: any = null;

    /**
     * 错误回调
     */
    private _errCB: any = null;

    /**
     * 关闭回调
     */
    private _closeCB: any = null;

    public static getInstance(): SocketManager
    {
        if (null == this._instance)
        {
            this._instance = new SocketManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void
    {
        this.addEvent();
    }

    private addEvent(): void
    {
        EventManager.getInstance().addListener(EventType.SOCKET_SEND, this.onSendMsg, this);
    }

    //#region socket回调及事件相关
    /**
     * websocket连接成功
     */
    private onSocketOpen = (msg: MessageEvent)=>
    {
        cc.log("socket open:" , msg);
        if (this._openCB)
        {
            this._openCB(msg);
        }
    }
    
    /**
     * 接收到服务器返回消息
     */
    private onSocketMsg = (msg: MessageEvent)=>
    {
        // cc.log("socket msg:" , msg);
        let data: any = msg.data;
        // cc.log("msg data: ", data);

        // 服务器返回的protobuf数据被整合为一个blob数据了，
        // 解析blob数据
        var reader = new FileReader();
        reader.readAsArrayBuffer(data);
        reader.onload = function (e){
            if (e)
            {
                cc.log(e);
            }
            var buf = new Uint8Array(reader.result);
            
            let msgBody: any = PBBuild.decodePB("proto/TestPB", "MsgPB");
            let msgInfo: any = msgBody.decode(buf);
            let body: any = PBBuild.decodePB("proto/TestPB", "WSMessage");
            let bodyInfo: any = body.decode(msgInfo.body);
            cc.log("接收socket消息： ============> ", msgInfo.code, bodyInfo);

            // 执行监听函数回调
            let cb: any = SocketManager.getInstance().getCBByCode(msgInfo.code);
            if (cb)
            {
                cb({code:msgInfo.code, body:bodyInfo});
            }

            if (SocketManager.getInstance()._msgCB)
            {
                SocketManager.getInstance()._msgCB({code:msgInfo.code, body:bodyInfo});
            }
        }
    }

    private onSocketErr = (msg: MessageEvent)=>
    {
        cc.log("socket err:" , msg);
        if (this._errCB)
        {
            this._errCB(msg);
        }
        this._ws = null;
    }

    /**
     * 连接关闭
     */
    private onSocketClose = (msg: CloseEvent)=>
    {
        cc.log("socket close:" , msg);
        if (this._closeCB)
        {
            this._closeCB(msg);
        }
        this._ws = null;
    }

    /**
     * 收到事件：发消息
     * @param event 
     */
    private onSendMsg(event: cc.Event.EventCustom): void
    {
        let data: any = event.getUserData(); // {code:number, body: {}}
        if (null == data)
        {
            return;
        }
        this.sendMsg(data.code, data.body);
    }

    //#endregion

    /**
     * 
     * @param url websocket连接地址
     */
    public createSocket(url: string, openCB?:any, msgCB?:any, errCB?:any, closeCB?:any): void
    {
        if (url == this._curSocketUrl)
        {
            return;
        }
        if (null != this._ws)
        {
            this._ws.close();
        }
        this._ws = new WebSocket(url);
        this._ws.onopen = this.onSocketOpen;
        this._ws.onmessage = this.onSocketMsg;
        this._ws.onerror = this.onSocketErr;
        this._ws.onclose = this.onSocketClose;
        this._openCB = openCB;
        this._msgCB = msgCB;
        this._errCB = errCB;
        this._closeCB = closeCB;
    }

    public closeSocket(): void
    {
        if (null != this._ws)
        {
            this._ws.close();
        }
    }

    public getSocket(): WebSocket
    {
        return this._ws;
    }

    public getCBByCode(code: number): any
    {
        return this._msgListenerCBMap[code];
    }
    
    /**
     * 发送消息
     * @param code 消息码
     * @param body 消息体
     * @param cb 消息回调
     */
    public sendMsg(code: number, body?: any): void
    {
        let msg: any = PBBuild.encodePB("proto/TestPB", "MsgPB");
        msg.code = code;
        msg.body = body.encode().toBuffer();

        cc.log("发送socket消息： ============> ", code, body);
        this._ws.send(msg.encode().toBuffer());
    }

    /**
     * 添加消息监听
     * @param code 协议号
     * @param cb 消息回调
     */
    public addMsgListener(code: number, cb: any): void
    {
        this._msgListenerCBMap[code] = cb;
    }

    public removeMsgListener(code: number): void
    {
        delete this._msgListenerCBMap[code];
    }
}