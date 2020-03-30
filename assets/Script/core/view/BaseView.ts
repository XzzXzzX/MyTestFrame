import EventManager from "../manager/EventManager";
import { EventType } from "../data/EventType";
import { printzx } from "../util/AppLog";

/**
 * xuan
 * 2019-6-20 15:05:39
 * 界面基类，实现通用统一的一套接口
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseView extends cc.Component {

    /** 关闭按钮 */
    @property(cc.Node)
    btnClose: cc.Node = null;

    /** 界面类型名称 */
    protected _viewType: string = null;

    _baseData: any = null;

    /** 界面开启时，自定义传入的数据（一般是界面初始化所需的数据） */
    protected _customData: any = null;

    /** 是否是静态界面，静态界面不会被closeview关闭 */
    protected _bStaticView: boolean = false;

    start() {
        // this._viewType = this.node['viewType'];
        // this._baseData = this.node['baseData'];
        if (this._baseData) {
            this._customData = this._baseData.customData;
            if (null != this._baseData.bStatic) this._bStaticView = this._baseData.bStatic;
        }
        this.addEvent();
    }

    onDestroy() {
        this.removeEvent();
    }

    /**
     * 初始化界面
     */
    public initView(viewType, baseData?: any): void {
        printzx('baseView initView: ', baseData);
        this._viewType = viewType;
        this._baseData = baseData;
    }

    /**
     * 添加事件
     */
    protected addEvent(): void {
        if (null != this.btnClose) this.btnClose.on("click", this.onCloseClick, this);
    }

    protected removeEvent(): void {

    }

    /**
     * 关闭界面
     */
    protected onCloseClick(): void {
        // UIManager.getInstance().closeView(this.node);
        EventManager.getInstance().dispatchEvent(EventType.CLOSE_VIEW, { viewType: this._viewType });
    }
}