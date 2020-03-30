import AppLog, { printzx, logError, logWarn, logN } from "../util/AppLog";
import { ViewType } from "../data/ViewType";
import EventManager from "./EventManager";
import { EventType } from "../data/EventType";
import BaseView from "../view/BaseView";

/**
 * xuan
 * 2019-6-13 11:40:34
 * ui管理类
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager {
    private static _instance: UIManager = null;

    _viewLayer: cc.Node = null;

    /** 以缓存的UI列表 */
    _uiList = [];

    /** 遮罩UI */
    private _maskUI: cc.Node = null;

    _curViewType: string = null;

    _lastViewType: string = null;

    /** 记录打开的view 列表，做返回界面使用 */
    _recordsViewList: any[] = [];

    public static getInstance(): UIManager {
        if (null == this._instance) {
            this._instance = new UIManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void {
        // this._viewLayer = new cc.Node();

        this._maskUI = cc.instantiate(cc.loader.getRes(ViewType.MaskUI));

        this._maskUI.on('click', this.onMaskClick, this);

        this.addEvent();
    }

    private addEvent(): void {
        EventManager.getInstance().addListener(EventType.SHOW_VIEW, this.onShowView, this);
        EventManager.getInstance().addListener(EventType.CLOSE_VIEW, this.onCloseView, this);
    }

    /**
     * 通过类型获取界面view
     * @param viewType 界面类型
     */
    private getViewByType(viewType: string): cc.Node {
        for (let index = 0; index < this._uiList.length; index++) {
            const uiView: cc.Node = this._uiList[index];
            if (viewType == uiView["viewType"]) {
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
    private removeViewByType(viewType: string): void {
        for (let index = 0; index < this._uiList.length; index++) {
            const uiView: cc.Node = this._uiList[index];
            if (viewType == uiView["viewType"]) {
                // uiView.active = true;
                this._uiList.splice(index, 1);
            }
        }
    }

    private showOpenAni(view: cc.Node, cb?: any): void {
        if (null == view) {
            return;
        }
        view.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(0.05, 1.1),
                cc.fadeIn(0.15),
                cc.sequence(
                    cc.delayTime(0.05),
                    cc.scaleTo(0.15, 1).easing(cc.easeOut(3.0)))),
            cc.callFunc(() => {
                if (cb) cb();
            }, this)));
    }

    private showCloseAni(view: cc.Node, cb?: any): void {
        if (null == view) {
            return;
        }
        view.runAction(cc.sequence(
            cc.spawn(
                cc.scaleBy(0.15, 0.95).easing(cc.easeOut(3.0)),
                cc.fadeOut(0.15)),
            cc.callFunc(() => {
                if (cb) cb();
            }, this)));
    }

    /**
     * 打开界面     
     * @param event 
     */
    private onShowView(event: any): void {
        logN("onShowView: ", event);
        let eventData: any = event;
        if (cc.ENGINE_VERSION == "1.8.2") {
            eventData = event.getUserData();
        }
        if (null == eventData) return;
        this.showView(eventData["viewType"], eventData["baseData"]);
    }

    /**
     * 关闭界面
     * @param event {viewType, bRemove, closeAni}
     */
    private onCloseView(event: any): void {
        logN("onCloseView: ", event);
        let eventData: any = event;
        if (cc.ENGINE_VERSION == "1.8.2") {
            eventData = event.getUserData();
        }
        if (null == eventData) return;
        this.closeViewByType(eventData["viewType"], eventData['bRemove'], eventData['closeAni']);
    }

    onMaskClick(): void {
        this.closeViewByType(this._curViewType);
    }

    //#region  公共方法
    /**
     * 获取跟节点
     */
    public getRootNode(): cc.Node {
        // logN("=====getRootNode====");
        if (!!!this._viewLayer) {
            let canNode: cc.Node = cc.director.getScene().getChildByName('Canvas');
            if (canNode) {
                this._viewLayer = new cc.Node();
                this._viewLayer.name = 'viewLayer';
                this._viewLayer.parent = canNode;
                this._viewLayer.setContentSize(canNode.getContentSize());
            }
        }
        return this._viewLayer;
    }

    /**
     * 打开界面
     * @param viewType 界面名称 ViewType
     * @param baseData { bStatic?: boolean, bShowMask?:boolean, openAni?: boolean, openCB?: any, clickMask?:, customData?: any } data 
     */
    public showView(viewType: string, baseData?: any): cc.Node {
        if (!baseData) baseData = {};
        // 没有值，设置默认值
        let bStatic: boolean = baseData.bStatic ? true : false;     // 默认为false，非静态界面
        let openAni: boolean = baseData.openAni ? true : false;     // 默认为true，有动画效果
        baseData.bStatic = bStatic;
        baseData.openAni = openAni;
        let bShowMask: boolean = true; // 默认显示mask遮罩
        if (baseData && baseData.bShowMask == false) {
            bShowMask = false;
        }

        let startTime: number = new Date().getTime();

        let rootNode: cc.Node = this.getRootNode();
        let view: cc.Node = this.getViewByType(viewType);
        // 相同界面不可以打开多个
        if (view && !view.active) {
            // // 刷新下界面
            // let baseView: BaseView = view.getComponent(BaseView);
            // if (baseView) {
            //     baseView.initView(baseData);
            // }
            // if (openAni) this.showOpenAni(view);
            // view.parent = rootNode;
            // view.active = true;
            // if (bShowMask) {
            //     this._maskUI.parent = rootNode;
            //     this._maskUI.active = true;
            // }
            // let endTime: number = new Date().getTime();
            // logN("打开界面 ====> ", viewType, endTime - startTime);
            // return;
        } else {
            view = cc.instantiate(cc.loader.getRes(viewType));
            this._uiList.push(view);
        }

        if (null == view) {
            logError("UIManager.showView() view is null: ", viewType);
            return null;
        }

        view["viewType"] = viewType;
        view["baseData"] = baseData;
        let baseView: BaseView = view.getComponent(BaseView);
        if (baseView) {
            baseView.initView(viewType, baseData);
        }
        let zIndex: number = 0;
        if (bStatic) {
            zIndex = -1;
            // view.parent = rootNode;
        } else {
            zIndex = 2;
        }
        if (!!!view.parent) {
            rootNode.addChild(view, zIndex);
        }
        view.active = true;

        if (this._maskUI.parent) this._maskUI.removeFromParent();
        if (bShowMask && !bStatic) {
            rootNode.addChild(this._maskUI, 1);
            // this._maskUI.parent = rootNode;
            this._maskUI.active = true;
        }

        this._curViewType = viewType;
        let endTime: number = new Date().getTime();
        logN("打开界面 ====> ", viewType, endTime - startTime);
        this._recordsViewList.push({ viewType: this._curViewType, baseData: baseData });

        if (openAni) this.showOpenAni(view);

        return view;
    }

    /**
     * 关闭界面
     * @param view 界面节点
     * @param bRemove 是否移除
     */
    public closeView(view: cc.Node, bRemove?: boolean, closeAni?: boolean): void {
        if (null == view) return;

        let data: any = view["baseData"];
        // 静态界面，不可关闭
        if (data && data.bStatic) {
            logWarn("静态常驻界面，不会被关掉 ====> ", view["viewType"]);
            return;
        }

        if (null == bRemove) bRemove = true;
        // 默认为true
        if (null == closeAni) closeAni = true;
        if (data.openAni || closeAni) this.showCloseAni(view, this._realClose.bind(this, view, bRemove));
        else this._realClose.bind(this, view, bRemove);

        this.removeLastRecord();
        let recordCfg: any = this.getLastRecord();
        if (recordCfg) {
            this._curViewType = recordCfg['viewType'];
        }

        if (!this._lastViewType) {
            this._lastViewType = view["viewType"];
        }
        if (this._recordsViewList.length >= 2) {
            let cfg: any = this._recordsViewList[this._recordsViewList.length - 2];
            if (cfg) this._lastViewType = cfg['viewType'];
        }

        // 重新打开上次的界面 TODO
    }

    _realClose(view: cc.Node, bRemove: boolean): void {
        if (!!!view) {
            return;
        }
        logN("关闭界面 ====> ", view["viewType"], bRemove);
        this._maskUI.removeFromParent();
        if (bRemove) {
            view.removeFromParent();
            this.removeViewByType(view["viewType"]);
        }
        else {
            view.active = false;
            this._maskUI.active = false;
            this._resetViewState(view);
        }
    }

    _resetViewState(view: cc.Node): void {
        if (!!!view) {
            return;
        }
        // 还原动画效果初始值
        view.opacity = 255;
    }

    /**
     * 关闭界面
     * @param viewType 界面名称
     * @param bRemove 是否移除
     */
    public closeViewByType(viewType: string, bRemove?: boolean, closeAni?: boolean): void {
        if (null == bRemove) {
            bRemove = true;
        }
        let view: cc.Node = this.getViewByType(viewType);
        if (null == view) {
            return;
        }
        this.closeView(view, bRemove, closeAni);
    }

    /**
     * 获取最上层的ui view
     */
    public getTopView(): cc.Node {
        return this._uiList[this._uiList.length - 1];
    }
    //#endregion

    /** 删除记录 */
    removeLastRecord(): void {
        // 删除记录
        this._recordsViewList.pop();
    }

    /** 获取最近记录 */
    getLastRecord(): any {
        let recordCfg: any = this._recordsViewList[this._recordsViewList.length - 1];
        return recordCfg;
    }
}
