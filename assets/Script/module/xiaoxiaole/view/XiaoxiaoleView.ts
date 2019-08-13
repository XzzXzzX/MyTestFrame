import { MAX_WIDTH, MAX_HEIGHT, CELL_WIDTH, GRID_WIDTH, GRID_HEIGHT, CELL_TYPE } from "../data/XiaoxiaoleConfig";
import XiaoxiaoleControl from "../XiaoxiaoleControl";
import EffectView from "./EffectView";
import CellView from "./CellView";
import { ViewType } from "../../../core/data/ViewType";
import CellData from "../data/CellData";
import AudioUtils from "../AudioUtil";

/**
 * xuan
 * 2019-8-12 10:42:51
 * 消消乐主界面
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class XiaoxiaoleView extends cc.Component {
    
    @property(cc.Node)
    nodeCells: cc.Node = null;

    @property(EffectView)
    effectView: EffectView = null;

    /** 格子预制件资源 */
    private cellPrefabs = {
        [CELL_TYPE.Bear]: ViewType.Bear,
        [CELL_TYPE.Cat]: ViewType.Cat,
        [CELL_TYPE.Chicken]: ViewType.Chicken,
        [CELL_TYPE.Frog]: ViewType.Frog,
        [CELL_TYPE.Fox]: ViewType.Fox,
        [CELL_TYPE.Horse]: ViewType.Horse,
        [CELL_TYPE.BIRD]: ViewType.Bird,
    }

    /**
     * 格子节点列表
     */
    private _cellViews: Array<cc.Node[]> = [];

    /** 是否可以交换格子 */
    private _isCanMove: boolean = false;

    /** 正在播放动画 */
    _isInPlayAni: boolean;

    start() {
        this.addEvent();
        this.initWithCellModels();
    }

    private addEvent(): void
    {
        this.nodeCells.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this), this);
        this.nodeCells.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this), this);
    }

    /**
     * 初始化界面
     */
    private initWithCellModels(): void
    {
        let cellsModels = XiaoxiaoleControl.getInstance().getInitDatas();
        this._cellViews = [];
        for(var i = 1; i < cellsModels.length; i++){
            this._cellViews[i] = [];
            for(var j = 1; j < cellsModels[i].length;j++){
                let model: CellData = cellsModels[i][j];
                var type = model.type;
                var aniView = cc.instantiate(cc.loader.getRes(this.cellPrefabs[type]));
                aniView.parent = this.nodeCells;
                var cellViewScript:CellView = aniView.getComponent(CellView);
                cellViewScript.initWithModel(cellsModels[i][j]);
                this._cellViews[i][j] = aniView;
            }
        }
    }

    private onTouchStart(touch: cc.Event.EventTouch): void
    {
        if(this._isInPlayAni){//播放动画中，不允许点击
            return;
        }
        let cellPos: cc.Vec2 = this.convertTouchPosToGridPos(touch.getLocation());
        if(cellPos){
            var changeModels = this.selectCell(cellPos);
            this._isCanMove = changeModels.length < 3;
        }
        else{
            this._isCanMove = false;
        }
        return;
    }

    private onTouchMove(touch: cc.Event.EventTouch): void
    {
        if(this._isCanMove){
            var startTouchPos = touch.getStartLocation();
            var startCellPos = this.convertTouchPosToGridPos(startTouchPos);
            var touchPos = touch.getLocation();
            var cellPos = this.convertTouchPosToGridPos(touchPos);
            if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){
                this._isCanMove = false;
                var changeModels = this.selectCell(cellPos); 
            }
        }
    }

    /**
     * 将触摸点位置转换成格子坐标
     * @param touchPos 触摸点
     */
    private convertTouchPosToGridPos(touchPos: cc.Vec2): cc.Vec2
    {
        if (null == touchPos) return null;
        let pos: cc.Vec2 = this.nodeCells.convertToNodeSpace(touchPos);
        if (pos.x >= MAX_WIDTH || pos.x < 0 ||
            pos.y > MAX_HEIGHT || pos.y < 0)
        {
            return null;
        }
        let x: number = Math.floor(pos.x / CELL_WIDTH) + 1;
        let y: number = Math.floor(pos.y / CELL_WIDTH) + 1;
        return cc.v2(x, y);
    }
    
    /**
     * 禁用触摸
     * @param time 时间间隔
     * @param step 步数
     */
    private disableTouch(time: number, step: number): void
    {
        if(time <= 0){
            return ;
        }
        this._isInPlayAni = true;
        this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
            this._isInPlayAni = false;
            AudioUtils.getInstance().playContinuousMatch(step);
        }, this)));
    }

    /**
     * 刷新界面格子
     * @param changeModels 
     */
    updateView(changeModels:Array<CellData>){
        let newCellViewInfo = [];
        for(var i in changeModels){
            var model: CellData = changeModels[i];
            var viewInfo = this.findViewByModel(model);
            var view = null;
            // 如果原来的cell不存在，则新建
            if(!viewInfo){
                var type = model.type;
                var aniView:cc.Node = cc.instantiate(cc.loader.getRes(this.cellPrefabs[type]));
                aniView.parent = this.nodeCells;
                var cellViewScript:CellView = aniView.getComponent("CellView");
                cellViewScript.initWithModel(model);
                view = aniView;
            }
            // 如果已经存在
            else{
                view = viewInfo.view;
                this._cellViews[viewInfo.y][viewInfo.x] = null;
            }
            var cellScript:CellView = view.getComponent("CellView");
            cellScript.updateView();// 执行移动动作
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            } 
        }
        // 重新标记this.cellviews的信息
        newCellViewInfo.forEach(function(ele){
            let model = ele.model;
            this._cellViews[model.y][model.x] = ele.view;
        },this);
    }
    
    /**
     * 显示选中的格子的选择效果
     * @param pos 
     */
    updateSelect(pos: cc.Vec2)
    {
         for(var i = 1;i <this._cellViews.length ;i++){
            for(var j = 1 ;j <this._cellViews[i].length ;j ++){
                if(this._cellViews[i][j]){
                    var cellScript:CellView = this._cellViews[i][j].getComponent("CellView");
                    if(pos.x == j && pos.y ==i){
                        cellScript.setSelect(true);
                    }
                    else{
                        cellScript.setSelect(false);
                    }

                }
            }
        }
    }

    /**
     * 根据cell的model返回对应的view
     */
    findViewByModel(model) 
    {
        for(var i = 1;i <this._cellViews.length ;i++){
            for(var j = 1 ;j <this._cellViews[i].length ;j ++){
                if(this._cellViews[i][j] && this._cellViews[i][j].getComponent("CellView").model == model){
                    return {view:this._cellViews[i][j],x:j, y:i};
                }
            }
        }
        return null;
    }

    /**
     * 获取正要播放的动画时长
     * @param changeModels 
     */
    getPlayAniTime(changeModels: Array<CellData>)
    {
        if(!changeModels){
            return 0;
        }
        var maxTime = 0;
        changeModels.forEach(function(ele){
            ele.cmd.forEach(function(cmd){
                if(maxTime < cmd.playTime + cmd.keepTime){
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            },this)
        },this);
        return maxTime;
    }

    /**
     * // 获得爆炸次数， 同一个时间算一个
     * @param effectsQueue 动画列表
     */
    getStep(effectsQueue: any)
    {
        if(!effectsQueue){
            return 0;
        }
        return effectsQueue.reduce(function(maxValue, efffectCmd){
            return Math.max(maxValue, efffectCmd.step || 0);
        }, 0);
    }

    /**
     * 选中格子交换
     */
    private selectCell(cellPos: cc.Vec2): any
    {
        // 计算交换结果
        let result = XiaoxiaoleControl.getInstance().selectCell(cellPos);
        let changedCells = result[0];
        let effectList = result[1];
        this.playEffect(effectList);

        this.disableTouch(this.getPlayAniTime(changedCells), this.getStep(effectList));

        // 更新界面
        this.updateView(changedCells);
        XiaoxiaoleControl.getInstance().cleanCmd(); 
        if(changedCells.length >= 2){
            this.updateSelect(cc.v2(-1,-1));
            AudioUtils.getInstance().playSwap();
        }
        else{
            this.updateSelect(cellPos);
            AudioUtils.getInstance().playClick();
        }
        return changedCells;
    }

    /**
     * 播放动画效果
     * @param effectList 动画效果列表
     */
    private playEffect(effectList: any): void
    {
        this.effectView.playEffect(effectList);
    }

}