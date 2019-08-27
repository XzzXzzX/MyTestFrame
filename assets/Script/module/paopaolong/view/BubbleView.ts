import BubbleData from "../data/BubbleData";
import { BubbleColors, BUBBLE_WIDTH, BUBBLE_HEIGHT } from "../data/ConstConfigs";

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
 * 2019-8-14 16:57:50
 * 泡泡界面类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class BubbleView extends cc.Component {



    start() {

    }

    // update (dt) {}
    public initWithBubbleData(data: BubbleData): void
    {
        this.node.color = BubbleColors[data.type];
        let offsetx: number = BUBBLE_WIDTH / 2;
        if (data.isOdd()) offsetx = 0;
        let x: number = (data.x - 0.5) * BUBBLE_WIDTH + offsetx;
        let y: number = (data.y - 0.5) * BUBBLE_HEIGHT;

        this.node.x = x;
        this.node.y = -y;
    }
}
