
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

/**
 * xuan
 * 2019-7-11 17:25:07
 * 绘画界面ui
 */

const {ccclass, property} = cc._decorator;

enum ColorTypes
{
   BLACK = 0,
   BLUE,
   CYAN,
   GRAY,
   GREEN,
   MAGENTA,
   ORANGE,
   RED,
   TRANSPARENT,
   WHITE,
   YELLOW,
}

enum ColorPanelType
{
    BG_COLOR = 1,
    LINE_COLOR,
}

/**
 * 绘制类型
 */
enum DrawType
{
    LINE = 1,
    CIRCEL,
    RECT,
}

@ccclass
export default class DrawView extends cc.Component {

    /**
     * 最大线宽
     */
    private static MAX_LINE_WIDTH = 10;

    /**
     * 最小线宽
     */
    private static MIN_LINE_WIDTH = 1;

    /**
     * 颜色配置
     */
    private _colorCfg: {}[] = [
        { index: ColorTypes.BLACK, name: "黑色", color: cc.Color.BLACK },
        { index: ColorTypes.BLUE, name: "蓝色", color: cc.Color.BLUE },
        { index: ColorTypes.CYAN, name: "青色", color: cc.Color.CYAN },
        { index: ColorTypes.GRAY, name: "灰色", color: cc.Color.GRAY },
        { index: ColorTypes.GREEN, name: "绿色", color: cc.Color.GREEN },
        { index: ColorTypes.MAGENTA, name: "品红", color: cc.Color.MAGENTA },
        { index: ColorTypes.ORANGE, name: "橙色", color: cc.Color.ORANGE },
        { index: ColorTypes.RED, name: "红色", color: cc.Color.RED },
        // { index: ColorTypes.TRANSPARENT, name: "透明", color: cc.Color.TRANSPARENT },
        { index: ColorTypes.WHITE, name: "白色", color: cc.Color.WHITE },
        { index: ColorTypes.YELLOW, name: "黄色", color: cc.Color.YELLOW },
    ];

    @property(cc.Node)
    imgCanvas: cc.Node = null;

    @property(cc.Node)
    nodeDrawPanel: cc.Node = null;

    @property(cc.Node)
    drawPanel: cc.Node = null;

    @property(cc.Node)
    nodeTouch: cc.Node = null;

    @property(cc.Graphics)
    graph: cc.Graphics = null;

    @property(cc.Node)
    btnMask: cc.Node = null;

    @property(cc.Slider)
    lineWidthSlider: cc.Slider = null;

    @property(cc.Node)
    btnPanel: cc.Node = null;
    @property(cc.Node)
    btnBgColor: cc.Node = null;
    @property(cc.Node)
    btnLineColor: cc.Node = null;
    @property(cc.Node)
    btnLast: cc.Node = null;
    @property(cc.Node)
    btnNext: cc.Node = null;

    @property(cc.Toggle)
    togMove: cc.Toggle = null;
    @property(cc.Toggle)
    togErase: cc.Toggle = null;
    @property(cc.Toggle)
    togList: cc.Toggle[] = [];

    @property(cc.Node)
    btnEraseAll: cc.Node = null;
    @property(cc.Slider)
    eraseSlider: cc.Slider = null;

    @property(cc.Node)
    contentColor: cc.Node = null;

    @property(cc.Node)
    nodeColorModel: cc.Node = null;

    @property(cc.Animation)
    aniColorPanel: cc.Animation = null;

    @property(cc.Animation)
    aniSettingPanel: cc.Animation = null;
    
    /**
     * 线条颜色
     */
    private _curLineColor: cc.Color = cc.Color.BLACK;

    /**
     * 线条宽度
     */
    private _curLineWidth: number = 2;

    /**
     * 开始触摸点
     */
    private _touchStartPos: cc.Vec2 = null;

    /**
     * 下一个点
     */
    private _touchNextPos: cc.Vec2 = null;

    /**
     * 设置面板是否显示
     */
    private _isSettingPanelShow: boolean = false;

    /**
     * 颜色面板是否显示
     */
    private _isColorPanelShow: boolean = false;

    /**
     * 当前选色板类型
     */
    private _curColorPanelType: ColorPanelType = null;

    /**
     * 画版尺寸，默认为1080*1920
     */
    private _drawSize: cc.Size = cc.size(1080, 1920);

    /**
     * 是否可以移动背景
     */
    private _isCanMoveBg: boolean = false;

    /**
     * 是否是橡皮擦状态
     */
    private _isEraseCheck: boolean = false;

    /**
     * 偏移位置
     */
    private _offsetPos: cc.Vec2 = cc.Vec2.ZERO;

    /**
     * 橡皮擦宽带
     */
    private _curEraseWidth: number = 5;

    /**
     * 当前绘图类型，默认是画线
     */
    private _curDrawType: DrawType = DrawType.LINE;

    /**
     * 绘制节点 缓存池
     */
    private _graphNodePool: cc.NodePool = new cc.NodePool();

    /**
     * 绘制节点列表
     */
    private _graphNodeList: cc.Node[] = [];

    /**
     * 当前绘图节点index
     */
    private _curGraphIndex: number = 0;

    /**
     * 触摸开始
     */
    private _isTouchStart: boolean = false;

    start()
    {
        this.imgCanvas.setContentSize(this._drawSize);
        this.drawPanel.setContentSize(this._drawSize);
        this.nodeTouch.setContentSize(this._drawSize);

        // 先缓存200个graphic节点对象
        this._graphNodeList.push(this.drawPanel);
        for (let index = 0; index < 200; index++) {
            let graphNode: cc.Node = cc.instantiate(this.drawPanel);
            this._graphNodePool.put(graphNode);
        }
        // 创建50个
        for (let index = 1; index < 50; index++) {
            this.createGraphicNode();
        }

        this.btnEraseAll.active = this._isEraseCheck;
        this.eraseSlider.node.active = this._isEraseCheck;

        this.onSlider(null);
        this.initColorPanel();
        this.addEvent();
    }

    private addEvent(): void
    {
        this.btnPanel.on("click", this.onPanelClick, this);
        this.btnBgColor.on("click", this.onBgColorClick, this);
        this.btnLineColor.on("click", this.onLineColorClick, this);
        this.btnMask.on("click", this.onMaskClick, this);
        this.btnEraseAll.on("click", this.onEraseAllClick, this);

        this.btnLast.on("click", this.onLastClick, this);
        this.btnNext.on("click", this.onNextClick, this);

        
        this.eraseSlider.node.on("slide", this.onEraseSlider, this);
        this.lineWidthSlider.node.on("slide", this.onSlider, this);
        this.togMove.node.on("toggle", this.onToggleMove, this);
        this.togErase.node.on("toggle", this.onToggleErase, this);

        for (let index = 0; index < this.togList.length; index++) {
            const tog: cc.Toggle = this.togList[index];
            tog["drawType"] = index + 1;
            tog.node.on("toggle", this.onToggleLineType, this);
        }
        
        this.nodeTouch.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.nodeTouch.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.nodeTouch.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.nodeTouch.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    /**
     * 初始化颜色选择面板
     */
    private initColorPanel(): void
    {
        for (let index = 0; index < this._colorCfg.length; index++) {
            const cfg = this._colorCfg[index];
            let itemNode: cc.Node = cc.instantiate(this.nodeColorModel);
            itemNode.active = true;
            let lab: cc.Label = itemNode.getChildByName("Label").getComponent(cc.Label);
            lab.string = cfg["name"];
            itemNode["cfg"] = cfg;
            itemNode.on("click", this.onColorItemClick, this);
            itemNode.color = cfg["color"];
            this.contentColor.addChild(itemNode);
        }
    }

    private createGraphicNode() : void
    {
        let graphNode: cc.Node = null;
        if (this._graphNodePool.size() > 0)
        {
            graphNode = this._graphNodePool.get();
        }
        else
        {
            graphNode = cc.instantiate(this.drawPanel);
        }
        graphNode.parent = this.drawPanel.parent;
        this._graphNodeList.push(graphNode);

        this.nodeTouch.zIndex = 99999;
    }

    /**
     * 获取绘图组件
     */
    private getCurGraphic(): cc.Graphics
    {
        if (this._curGraphIndex >= this._graphNodeList.length || this._curGraphIndex >= this._graphNodePool.size())
        {
            this.createGraphicNode();
        }

        let node: cc.Node = this._graphNodeList[this._curGraphIndex];
        let graph: cc.Graphics = node.getComponent(cc.Graphics);
        return graph;
    }

    /**
     * 清楚绘制内容
     * @param nodeIndex 绘制节点index
     */
    private clearGraphicDraw(nodeIndex: number): void
    {
        if (nodeIndex >= this._graphNodeList.length || nodeIndex >= this._graphNodePool.size())
        {
            return;
        }
        
        let node: cc.Node = this._graphNodeList[nodeIndex];
        let graph: cc.Graphics = node.getComponent(cc.Graphics);
        graph.clear();
        this._curGraphIndex -= 1;

        // 将清空了绘制的节点，剔除，然后再push到列表最后
        let lastNodes: cc.Node[] = this._graphNodeList.splice(nodeIndex, 1);
        this._graphNodeList.push(lastNodes[0]);
    }

//#region 事件响应

    private onTouchStart(event:cc.Event.EventTouch): void
    {
        cc.log("zx_ touch start");
        let touch: cc.Touch = event.touch;
        this._touchStartPos = touch.getLocation();
        this._isTouchStart = true;
    }

    private onTouchMove(event:cc.Event.EventTouch): void
    {
        let touch: cc.Touch = event.touch;
        this._touchNextPos = touch.getLocation();
        cc.log("zx_ touch move: ", this._touchNextPos);
        // 判断触摸点是不是在画布上
        let isContain = this.nodeTouch.getBoundingBoxToWorld().contains(this._touchNextPos);
        if (!<any>isContain)
        {
            return;
        }
        if (!this._isCanMoveBg)
        {
            if (this._isTouchStart)
            {
                let start: cc.Vec2 = new cc.Vec2(this._touchStartPos.x, this._touchStartPos.y);
                start = start.sub(this._offsetPos);

                this.graph = this.getCurGraphic();
                this.graph.lineWidth = this._curLineWidth;
                this.graph.strokeColor = this._curLineColor;
                this.graph.moveTo(start.x, start.y);
            }

            switch (this._curDrawType)
            {
                case DrawType.LINE:
                    this.drawLine(this._touchStartPos, this._touchNextPos);
                    break;

                case DrawType.CIRCEL:
                    let r: number = Math.sqrt(Math.pow(this._touchStartPos.x-this._touchNextPos.x, 2) + Math.pow(this._touchStartPos.y-this._touchNextPos.y, 2));
                    if (!this._isTouchStart)
                    {
                        this._curGraphIndex += 1;
                        this.graph = this.getCurGraphic();
                    }
                    this.drawCircle(this._touchStartPos, r);
                    break;

                case DrawType.RECT:
                    let w: number = this._touchNextPos.x - this._touchStartPos.x;
                    let h: number = this._touchNextPos.y - this._touchStartPos.y;
                    cc.log("zx- POS， w, h: ", this._touchNextPos,this._touchStartPos, w, h);
                    if (!this._isTouchStart)
                    {
                        this._curGraphIndex += 1;
                        this.graph = this.getCurGraphic();
                    }
                    this.drawRect(this._touchStartPos, w, h);
                    break;
            }
        }
        else
        {
            // 移动画布
            let start: cc.Vec2 = new cc.Vec2(this._touchStartPos.x, this._touchStartPos.y);
            let next: cc.Vec2 = new cc.Vec2(this._touchNextPos.x, this._touchNextPos.y);
            for (let index = 0; index < this.nodeDrawPanel.children.length; index++) {
                const node: cc.Node = this.nodeDrawPanel.children[index];
                node.position = node.position.add(next.sub(start));
                cc.log("node zIndex: ", node.name, node.zIndex);
            }
            this._touchStartPos = this._touchNextPos;

        }

        this._isTouchStart = false;
    }
    private onTouchEnd(event:cc.Event.EventTouch): void
    {
        this._isTouchStart = false;
        cc.log("zx_ touch end");
        this._touchStartPos = null;
        this._touchNextPos = null;
        this._curGraphIndex += 1;
    }

    private onTouchCancel(event:cc.Event.EventTouch): void
    {
        this._isTouchStart = false;
        cc.log("zx_ touch cancel");
        this._touchStartPos = null;
        this._touchNextPos = null;
    }

    private onLastClick(): void
    {
        let node: cc.Node = this._graphNodeList[this._curGraphIndex - 1];
        if (null == node) return;
        this.clearGraphicDraw(this._curGraphIndex - 1);
    }

    private onNextClick(): void
    {

    }

    private onEraseAllClick(): void
    {
        this.graph.clear();
        for (let index = 0; index < this._graphNodeList.length; index++) {
            const node: cc.Node = this._graphNodeList[index];
            let graph: cc.Graphics = node.getComponent(cc.Graphics);
            graph.clear();
        }
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

    /**
     * 点击mask关闭panel
     */
    private onMaskClick(): void
    {
        if (this._isColorPanelShow)
        {
            this.aniColorPanel.play("colorPanelHide");
            this._curColorPanelType = null;
            this._isColorPanelShow = !this._isColorPanelShow;
            return;
        }

        if (this._isSettingPanelShow)
        {
            this.aniSettingPanel.play("panelHide");
            this.btnMask.active = false;
            this._isSettingPanelShow = !this._isSettingPanelShow;
            return;
        }
    }

    private onToggleLineType(event: cc.Event.EventCustom): void
    {
        let target: cc.Node = event.target;
        let tog: cc.Toggle = target.getComponent(cc.Toggle);
        let curType: DrawType = tog["drawType"];
        this._curDrawType = curType || this._curDrawType;
    }
//#endregion

    /**
     * 绘制直线
     * @param startPos 起点
     * @param endPos 终点
     */
    private drawLine(startPos: cc.Vec2, endPos: cc.Vec2): void
    {
        if (!startPos || !endPos) return;

        // 修正画布移动的偏移量
        let end: cc.Vec2 = new cc.Vec2(endPos.x, endPos.y);
        end = end.sub(this._offsetPos);

        this.graph.lineTo(end.x, end.y); // 终点
        this.graph.stroke();     
    }

    /**
     * 绘制圆形     
     * @param centerPos 中点位置    
     * @param r 半径
     */
    private drawCircle(centerPos: cc.Vec2, r: number): void
    {
        // 擦掉上一帧的绘制
        if (!this._isTouchStart)
        {
            this.onLastClick();
        }
        this.graph.lineWidth = this._curLineWidth;
        this.graph.strokeColor = this._curLineColor;
        this.graph.circle(centerPos.x, centerPos.y, r);
        this.graph.stroke();

    }

    /**
     * 绘制矩形
     * @param startPos 起点位置
     * @param width 宽
     * @param height 高
     */
    private drawRect(startPos: cc.Vec2, width: number, height: number): void
    {
        // 擦掉上一帧的绘制
        if (!this._isTouchStart)
        {
            this.onLastClick();
        }
        this.graph.lineWidth = this._curLineWidth;
        this.graph.strokeColor = this._curLineColor;
        this.graph.rect(startPos.x, startPos.y, width, height);
        this.graph.stroke();
    }

    private screenShot(node: cc.Node): void
    {
        let vt: cc.Texture2D = new cc.Texture2D();
        if (CC_JSB)
        {

        }
    }
}