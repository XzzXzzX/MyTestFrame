import { PBBuild } from "../proto/PBBuild";

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
    private ws: WebSocket = null;

    /**
     * 当前socket连接地址
     */
    private curSocketUrl: string = '';

    /**
     * socket回调map
     */
    private socketCBMap = {};

    /**
     * 添加的监听回调map
     */
    private msgListenerCBMap = {};

    /**
     * 连接成功回调
     */
    private openCB: any = null;

    /**
     * 接受到消息回调
     */
    private msgCB: any = null;

    /**
     * 错误回调
     */
    private errCB: any = null;

    /**
     * 关闭回调
     */
    private closeCB: any = null;

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

    }

    //#region socket回调
    /**
     * websocket连接成功
     */
    private onSocketOpen = (msg: MessageEvent)=>
    {
        cc.log("socket open:" , msg);
        if (this.openCB)
        {
            this.openCB(msg);
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
        }
    }

    private onSocketErr = (msg: MessageEvent)=>
    {
        cc.log("socket err:" , msg);
        if (this.errCB)
        {
            this.errCB(msg);
        }
        this.ws = null;
    }

    /**
     * 连接关闭
     */
    private onSocketClose = (msg: CloseEvent)=>
    {
        cc.log("socket close:" , msg);
        if (this.closeCB)
        {
            this.closeCB(msg);
        }
        this.ws = null;
    }
    //#endregion

    /**
     * 
     * @param url websocket连接地址
     */
    public createSocket(url: string, openCB?:any, msgCB?:any, errCB?:any, closeCB?:any): void
    {
        if (url == this.curSocketUrl)
        {
            return;
        }
        if (null != this.ws)
        {
            this.ws.close();
        }
        this.ws = new WebSocket(url);
        this.ws.onopen = this.onSocketOpen;
        this.ws.onmessage = this.onSocketMsg;
        this.ws.onerror = this.onSocketErr;
        this.ws.onclose = this.onSocketClose;
        this.openCB = openCB;
        this.msgCB = msgCB;
        this.errCB = errCB;
        this.closeCB = closeCB;
    }

    public closeSocket(): void
    {
        if (null != this.ws)
        {
            this.ws.close();
        }
    }

    public getSocket(): WebSocket
    {
        return this.ws;
    }

    public getCBByCode(code: number): any
    {
        return this.msgListenerCBMap[code];
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
        this.ws.send(msg.encode().toBuffer());
    }

    /**
     * 添加消息监听
     * @param code 协议号
     * @param cb 消息回调
     */
    public addMsgListener(code: number, cb: any): void
    {
        this.msgListenerCBMap[code] = cb;
    }

    public removeMsgListener(code: number): void
    {
        delete this.msgListenerCBMap[code];
    }
}