/**
 * xuan
 * 2019-5-15 10:50:41
 * 时间管理类
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class EventManager {
    private static _instance: EventManager = null;
    private dispacher: cc.EventTarget = null;

    public static getInstance(): EventManager
    {
        if (null == this._instance)
        {
            this._instance = new EventManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void
    {
        this.dispacher = new cc.EventTarget();
    }

    /**
     * 添加事件监听
     * @param eventType 事件类型
     * @param callback 回调
     * @param target 目标
     */
    public addListener(eventType: any, callback: any, target: any): void
    {
        this.dispacher.on(eventType, callback, target);
    }

    /**
     * 移除事件监听
     * @param eventType 事件类型
     * @param callback 回调
     * @param target 目标
     */
    public removeListener(eventType: any, callback: any, target: any): void
    {
        this.dispacher.off(eventType, callback, target);
    }

    /**
     * 派发事件
     * @param eventType 事件类型
     * @param data 传参
     */
    public dispatchEvent(eventType: any, data?: any): void
    {
        this.dispacher.emit(eventType, data);
    }
}
