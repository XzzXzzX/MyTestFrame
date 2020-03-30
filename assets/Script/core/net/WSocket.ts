import { PBBuild } from "../proto/PBBuild";

export default class WSocket {
    private _ws: WebSocket = null;

    private _url: string = '';

    /**
     *
     */
    constructor(url: string) {
        this._url = url;
        this._ws = new WebSocket(url);
    }

    setWSCallback(onOpen: any, onMsg: any, onErr: any, onClose: any): boolean {
        if (!this._ws) {
            return false;
        }
        this._ws.onopen = onOpen;
        this._ws.onmessage = onMsg;
        this._ws.onerror = onErr;
        this._ws.onclose = onClose;
    }

    closeWS(): void {
        this._ws.close();
    }

    /**
     * 发送消息
     * @param code 消息码
     * @param body 消息体
     */
    public sendMsg(code: number, body?: any): void {
        // 总的根协议
        let msg: any = PBBuild.encodePB("proto/TestPB", "MsgPB");
        msg.code = code;
        if (body) {
            msg.body = body.encode().toBuffer();
        }

        cc.log("发送socket消息： ============> ", code, body);
        this._ws.send(msg.encode().toBuffer());
    }
}