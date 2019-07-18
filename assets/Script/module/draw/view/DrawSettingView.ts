
/**
 * xuan
 * 2019-7-15 14:54:06
 * 画板设置界面
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class DrawSettingView extends cc.Component {

    @property(cc.Slider)
    lineWidthSlider: cc.Slider = null;

    @property(cc.Node)
    btnBlack: cc.Node = null;

    @property(cc.Node)
    btnRed: cc.Node = null;

    @property(cc.Node)
    btnPanel: cc.Node = null;
    @property(cc.Node)
    btnBgColor: cc.Node = null;
    @property(cc.Node)
    btnLineColor: cc.Node = null;

    @property(cc.Toggle)
    togMove: cc.Toggle = null;
    @property(cc.Toggle)
    togErase: cc.Toggle = null;

    @property(cc.Node)
    btnEraseAll: cc.Node = null;
    @property(cc.Slider)
    eraseSlider: cc.Slider = null;

    start()
    {
        this.addEvent();
    }

    private addEvent(): void
    {
        this.btnBlack.on("click", this.onBlackClick, this);
        this.btnRed.on("click", this.onRedClick, this);
        this.btnPanel.on("click", this.onPanelClick, this);
        this.btnBgColor.on("click", this.onBgColorClick, this);
        this.btnLineColor.on("click", this.onLineColorClick, this);
        this.btnMask.on("click", this.onMaskClick, this);
        this.btnEraseAll.on("click", this.onEraseAllClick, this);
        
        this.eraseSlider.node.on("slide", this.onEraseSlider, this);
        this.lineWidthSlider.node.on("slide", this.onSlider, this);
        this.togMove.node.on("toggle", this.onToggleMove, this);
        this.togErase.node.on("toggle", this.onToggleErase, this);
        
    }

    
    private onBlackClick(): void
    {
        this._curLineColor = cc.Color.BLACK;
    }

    private onRedClick(): void
    {
        this._curLineColor = cc.Color.RED;
    }

    private onEraseAllClick(): void
    {
        this.graph.clear();
    }

    private onSlider(event:cc.Event.EventCustom): void
    {
        let process: number = Number(this.lineWidthSlider.progress.toFixed(2));
        this._curLineWidth = DrawView.MIN_LINE_WIDTH + process * DrawView.MAX_LINE_WIDTH;
    }

    private onEraseSlider(): void
    {
        let process: number = Number(this.eraseSlider.progress.toFixed(2));
        this._curEraseWidth = 5 + process * 20;
    }

    private onToggleMove(): void
    {
        let isCheck: boolean = this.togMove.isChecked;
        this._isCanMoveBg = isCheck;
        if (!this._isCanMoveBg)
        {
            this._offsetPos = cc.Vec2.ZERO.add(this.drawPanel.position);
            this.btnMask.active = true;
        }
        else
        {
            this.btnMask.active = false;
        }
    }
    
    private onToggleErase(): void
    {
        let isCheck: boolean = this.togErase.isChecked;
        this._isEraseCheck = isCheck;

        this.btnEraseAll.active = this._isEraseCheck;
        this.eraseSlider.node.active = this._isEraseCheck;
    }

    /**
     * 设置界面
     */
    private onPanelClick(): void
    {
        if (this._isSettingPanelShow)
        {
            this.btnMask.active = false;
            this.aniSettingPanel.play("panelHide");
        }
        else
        {
            this.btnMask.active = true;
            this.aniSettingPanel.play("panelShow");
        }
        this._isSettingPanelShow = !this._isSettingPanelShow;
    }

    /**
     * 背景颜色选择
     */
    private onBgColorClick(): void
    {
        if (this._curColorPanelType == ColorPanelType.BG_COLOR || !this._curColorPanelType)
        {
            if (this._isColorPanelShow)
            {
                this.aniColorPanel.play("colorPanelHide");
                this._curColorPanelType = null;
            }
            else
            {
                this.aniColorPanel.play("colorPanelShow");
            }
            this._isColorPanelShow = !this._isColorPanelShow;
        }

        this._curColorPanelType = ColorPanelType.BG_COLOR;
    }

    /**
     * 线条颜色选择
     */
    private onLineColorClick(): void
    {
        if (this._curColorPanelType == ColorPanelType.LINE_COLOR || !this._curColorPanelType)
        {
            if (this._isColorPanelShow)
            {
                this.aniColorPanel.play("colorPanelHide");
                this._curColorPanelType = null;
            }
            else
            {
                this.aniColorPanel.play("colorPanelShow");
            }
            this._isColorPanelShow = !this._isColorPanelShow;
        }

        this._curColorPanelType = ColorPanelType.LINE_COLOR;
    }

    /**
     * 点击颜色子项ui
     * @param event 
     */
    private onColorItemClick(event: cc.Event.EventCustom): void
    {
        let target: cc.Node = event.target;
        let cfg:any = target['cfg'];
        switch (this._curColorPanelType)
        {
            case ColorPanelType.BG_COLOR:
                this.imgCanvas.color = cfg.color;
            break;

            case ColorPanelType.LINE_COLOR:
                this._curLineColor = cfg.color;
            break;
        }
    }

}