import BubbleData from "../data/BubbleData";
import BubbleView from "./BubbleView";
import PaopaolongControl from "../PaopaolongControl";
import AssetManager from "../../../core/manager/AssetManager";
import { ModuleTypes } from "../../../core/data/CommonEnumTypes";
import { ViewType } from "../../../core/data/ViewType";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class PaopaolongView extends cc.Component {

    @property(cc.Node)
    bubbleLayer: cc.Node = null;

    onLoad () {
        AssetManager.getInstance().preLoadAsset(ModuleTypes.Paopaolong, null, ()=>{
            this.initWithBubbleDatas(PaopaolongControl.getInstance().getBubbleDatas());
        });
    }

    private _bubbleViews: Array<BubbleView[]> = [];

    start () {
        this.addEvent();

        // this.initWithBubbleDatas(PaopaolongControl.getInstance().getBubbleDatas());
    }

    private addEvent(): void
    {
        this.bubbleLayer.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.bubbleLayer.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.bubbleLayer.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public initWithBubbleDatas(datas: Array<BubbleData[]>): void
    {
        for (let i = 1; i < datas.length; i++) {
            // const element = datas[i];
            this._bubbleViews[i] = [];
            for (let j = 1; j < datas[i].length; j++) {
                let node: cc.Node = cc.instantiate(cc.loader.getRes(ViewType.BubbleView));
                let bubblecmp: BubbleView = node.getComponent(BubbleView);
                bubblecmp.initWithBubbleData(datas[i][j]);
                node.parent = this.bubbleLayer;
            }
        }
    }

    private onTouchStart(touch: cc.Event.EventTouch)
    {
        cc.log("touch start pos: ", touch.getLocation());
    }

    private onTouchMove(touch: cc.Event.EventTouch)
    {
        cc.log("touch move pos: ", touch.getLocation());
        
    }

    private onTouchEnd(touch: cc.Event.EventTouch)
    {
        cc.log("touch end pos: ", touch.getLocation());
        
    }

}
