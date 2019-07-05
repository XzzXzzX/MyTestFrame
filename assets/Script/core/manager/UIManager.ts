import AppLog, { printzx } from "../util/AppLog";
import { ViewType } from "../data/ViewType";
import EventManager from "./EventManager";
import { EventType } from "../data/EventType";

/**
 * xuan
 * 2019-6-13 11:40:34
 * ui管理类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager {
    private static _instance: UIManager = null;

    /**
     * 以缓存的UI列表
     */
    _uiList = [];

    /**
     * 遮罩UI
     */
    private _maskUI: cc.Node = null;

    public static getInstance(): UIManager
    {
        if (null == this._instance)
        {
            this._instance = new UIManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void
    {
        this._maskUI = cc.instantiate(cc.loader.getRes(ViewType.MaskUI));

        this.addEvent();
    }

    private addEvent(): void
    {
        EventManager.getInstance().addListener(EventType.SHOW_VIEW, this.onShowView, this);
        EventManager.getInstance().addListener(EventType.CLOSE_VIEW, this.onCloseView, this);
    }

    /**
     * 通过类型获取界面view
     * @param viewType 界面类型
     */
    private getViewByType(viewType: string): cc.Node
    {
        for (let index = 0; index < this._uiList.length; index++) {
            const uiView: cc.Node = this._uiList[index];
            if (viewType == uiView["viewType"])
            {
                // uiView.active = true;
                return uiView;
            }
        }
        return null
    }

    /**
     * 通过类型删除界面view
     * @param viewType 界面类型
     */
    private removeViewByType(viewType: string): void
    {
        for (let index = 0; index < this._uiList.length; index++) {
            const uiView: cc.Node = this._uiList[index];
            if (viewType == uiView["viewType"])
            {
                // uiView.active = true;
                this._uiList.splice(index, 1);
            }
        }
    }

    private showOpenAni(view: cc.Node, cb?: any): void
    {
        if (null == view)
        {
            return;
        }
        view.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(0.05, 1.1),
                cc.fadeIn(0.15),
                cc.sequence(
                    cc.delayTime(0.05),
                    cc.scaleTo(0.15, 1).easing(cc.easeOut(3.0)))),
            cc.callFunc(()=>{
                if (cb) cb();
            },this)));
    }

    private showCloseAni(view: cc.Node, cb?: any): void
    {
        if (null == view)
        {
            return;
        }
        view.runAction(cc.sequence(
            cc.spawn(
                cc.scaleBy(0.15, 0.95).easing(cc.easeOut(3.0)),
                cc.fadeOut(0.15)),
            cc.callFunc(()=>{
                if (cb) cb();
            },this)));
    }

    /**
     * 打开界面     
     * @param event 
     */
    private onShowView(event: cc.Event.EventCustom): void
    {
        cc.log("onShowView: ", event);
        let eventData: any = event.getUserData(); // {viewType:"", data:{bStatic?: boolean, openAni?:boolean, customData?: any}}
        if (null == eventData) return;
        this.showView(eventData.viewType, eventData.data);
    }

    /**
     * 关闭界面
     * @param event 
     */
    private onCloseView(event: cc.Event.EventCustom): void
    {
        cc.log("onCloseView: ", event);
        let eventData: any = event.getUserData(); // {view:cc.Node}
        if (null == eventData) return;
        this.closeView(eventData.view);
    }

    //#region  公共方法
    /**
     * 获取跟节点
     */
    public getRootNode(): cc.Node
    {
        printzx("=====getRootNode====");
        if(cc.isValid(cc.director.getScene()))
        {
            return cc.director.getScene().getChildByName('Canvas');
        }
        return new cc.Node();
    }

    /**
     * 打开界面
     * @param viewType 界面名称 ViewType
     * @param {bStatic?: boolean //是否是常驻界面, openAni?:boolean//是否展示打开动画, customData?: any //自定义数据} data 
     */
    public showView(viewType: string, baseData?:{bStatic?: boolean, openAni?:boolean, customData?: any}): cc.Node
    {
        if (!baseData) baseData = {};
        // 没有值，设置默认值
        let bStatic: boolean = baseData.bStatic ? true: false;     // 默认为false，非静态界面
        let openAni: boolean = baseData.openAni ? true: false;     // 默认为true，有动画效果
        baseData.bStatic = bStatic;
        baseData.openAni = openAni;

        let view: cc.Node = this.getViewByType(viewType);
        // 相同界面不可以打开多个
        if (view && view.active)
        {
            return;
        }
        else if (view && !view.active)
        {
            this._maskUI.active = true;
            view.active = true;
            if (openAni) this.showOpenAni(view);
            return view;
        }

        view = cc.instantiate(cc.loader.getRes(viewType));
        if (null == view)
        {
            cc.error("UIManager.showView() view is null: ", viewType);
            return null;
        }
        let rootNode: cc.Node = this.getRootNode();
        if (this._maskUI.parent) this._maskUI.removeFromParent();
        this._maskUI.parent = rootNode;
        view["viewType"] = viewType;
        view["baseData"] = baseData;
        this._uiList.push(view);
        view.parent = rootNode;

        if (openAni) this.showOpenAni(view);

        return view;
    }

    /**
     * 关闭界面
     * @param view 界面节点
     * @param bRemove 是否移除
     */
    public closeView(view: cc.Node, bRemove?: boolean, closeAni?:boolean): void
    {
        if (null == view) return; 

        let data: any = view["baseData"];
        // 静态界面，不可关闭
        if (data && data.bStatic) return;

        if (null == bRemove) bRemove = true;
        let closeView = function () {
            if (bRemove)
            {
                view.removeFromParent();
                UIManager.getInstance()._maskUI.removeFromParent();
                UIManager.getInstance().removeViewByType(view["viewType"]);
                // delete UIManager.getInstance()._uiList[view["viewType"]];
            }
            else
            {
                view.active = false;
                UIManager.getInstance()._maskUI.active = false;
            }
        }
        // 默认为true
        if (null == closeAni) closeAni = true;
        if (data.openAni || closeAni) this.showCloseAni(view, closeView);
        else closeView();
    }

    /**
     * 关闭界面
     * @param viewType 界面名称
     * @param bRemove 是否移除
     */
    public closeViewByType(viewType: string, bRemove?: boolean, closeAni?:boolean): void
    {
        if (null == bRemove)
        {
            bRemove = true;
        }
        let view: cc.Node = this.getViewByType(viewType);
        if (null == view)
        {
            return;
        }
        this.closeView(view, bRemove, closeAni);
    }

    /**
     * 获取最上层的ui view
     */
    public getTopView(): cc.Node
    {
        return this._uiList[this._uiList.length - 1];
    }
    //#endregion
}
