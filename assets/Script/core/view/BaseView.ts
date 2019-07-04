import UIManager from "../manager/UIManager";

/**
 * xuan
 * 2019-6-20 15:05:39
 * 界面基类，实现通用统一的一套接口
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseView extends cc.Component {

    /**
     * 关闭按钮
     */
    @property(cc.Node)
    btnClose: cc.Node = null;


    /**
     * 界面类型名称
     */
    protected viewType: string = null;

    /**
     * 界面开启时，自定义传入的数据（一般是界面初始化所需的数据）
     */
    protected customData: any = null;

    /**
     * 是否是静态界面，静态界面不会被closeview关闭
     */
    protected bStaticView: boolean = false;

    protected start()
    {
        this.viewType = this.node.viewType;
        if (this.node.baseData)
        {
            this.customData = this.node.baseData.customData;
            if (null != this.node.baseData.bStatic) this.bStaticView = this.node.baseData.bStatic;
        }
    }

    /**
     * 添加事件
     */
    protected addEvent(): void
    {
        if (null != this.btnClose) this.btnClose.on("click", this.closeView, this);
    }

    /**
     * 初始化界面
     */
    protected initView(): void
    {

    }

    /**
     * 关闭界面
     */
    protected closeView(): void
    {
        UIManager.getInstance().closeView(this.node);
    }
}