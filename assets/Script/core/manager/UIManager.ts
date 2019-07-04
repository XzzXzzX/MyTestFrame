import AppLog, { printzx } from "../util/AppLog";

/**
 * xuan
 * 2019-6-13 11:40:34
 * ui管理类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIManager {
    private static _instance: UIManager = null;

    uiList = [];

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

    }

    private getViewByName(viewName: string): cc.Node
    {
        for (let index = 0; index < this.uiList.length; index++) {
            const uiView: cc.Node = this.uiList[index];
            if (viewName == uiView.viewType)
            {
                uiView.active = true;
                return uiView;
            }
        }
        return null
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
        let view: cc.Node = this.getViewByName(viewType);
        // 相同界面不可以打开多个
        if (view && viewType == view.viewType)
        {
            view.active = true;
            return view;
        }

        view = cc.instantiate(cc.loader.getRes(viewType));
        if (null == view)
        {
            cc.error("UIManager.showView() view is null: ", viewType);
            return null;
        }
        let rootNode: cc.Node = this.getRootNode();
        view.viewType = viewType;
        view.baseData = baseData;
        this.uiList.push(view);
        view.parent = rootNode;

        if (baseData && baseData.openAni)
        {
            this.showOpenAni(view);
        }

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

        let data: any = view.baseData;
        // 静态界面，不可关闭
        if (data && data.bStatic) return;

        if (null == bRemove) bRemove = true;
        let closeView = function () {
            if (bRemove)
            {
                view.removeFromParent();
                delete this.uiList[view.viewType];
            }
            else
            {
                view.active = false;
            }
        }
        // 默认为true
        if (null == closeAni) closeAni = true;
        if (closeAni) this.showCloseAni(view, closeView);
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
        let view: cc.Node = this.getViewByName(viewType);
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
        return this.uiList[this.uiList.length - 1];
    }
    //#endregion
}
