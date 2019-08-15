import BubbleData from "./data/BubbleData";
import { BubbleType } from "./data/ConstConfigs";

/**
 * xuan
 * 2019-8-14 16:57:50
 * 泡泡龙控制类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class PaopaolongControl {
    private static _instance: PaopaolongControl = null;

    /** 泡泡数据数组 每个元素表示一行的泡泡*/
    private _bubbleDatas:Array<BubbleData[]> = [];

    /** 泡泡类型 */
    private _bubbleTypes:Array<BubbleType> = [BubbleType.Blue, BubbleType.Green, BubbleType.Red, BubbleType.Yellow];

    public static getInstance(): PaopaolongControl
    {
        if (null == this._instance)
        {
            this._instance = new PaopaolongControl();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void
    {

    }

    private initBubbleDatas() : void
    {

    }

    /**
     * 获取一个随机类型
     */
    private getRandomBubbleType(): BubbleType
    {
        let index = Math.floor(Math.random() * this._bubbleTypes.length);
        return this._bubbleTypes[index];
    }

    /**
     * 检测泡泡是否能消除
     * @param x 泡泡的x坐标
     * @param y y坐标
     * @returns 返回可消除的泡泡数组
     */
    private checkBubbleCrush(x: number, y: number): any
    {
        // 检测方向
        let directions: Array<cc.Vec2> = [cc.v2(1, 0), cc.v2(-1, 0), // 横向左右的检测
            cc.v2(-1, -1), cc.v2(1, -1),  // 下方的
            cc.v2(-1, 1), cc.v2(1, 1),  // 上方的
        ];

        let sameBubbles: Array<BubbleData> = []; // 与新添的泡泡相同的泡泡
        let saveTag = {};
        saveTag[x + "_" + y] = true;
        let curBubble: BubbleData = this._bubbleDatas[y][x];
        sameBubbles.push(curBubble);
        let index: number = 0;
        while (index < sameBubbles.length)
        {
            let bubble: BubbleData = sameBubbles[index];
            index++;
            if (null == bubble) continue;
            // 检测各个方向的是否有相同类型的泡泡
            for (let i = 0; i < directions.length; i++) {
                let direc:cc.Vec2 = directions[i];
                let tempX: number = bubble.x + direc.x;
                let tempY: number = bubble.y + direc.y;
                if (tempX < 1 || tempX > this._bubbleDatas.length ||
                    tempY < 1 || tempY > this._bubbleDatas.length ||
                    !this._bubbleDatas[tempY][tempX] || 
                    !saveTag[tempX + "_" + tempY])
                {
                    continue;
                }

                // 相同类型的记录到samebubbles，再次检测记录的bubble
                if (bubble.type == this._bubbleDatas[tempY][tempX].type)
                {
                    sameBubbles.push(this._bubbleDatas[tempY][tempX]);
                }
            }
        }

        return sameBubbles;
    }


    private checkBubbleFall(): any
    {

    }

    private doBubbleCrush(crushList: Array<BubbleData>): void
    {
        if (null == crushList || crushList.length <= 0) return;
        
    }
    
}
