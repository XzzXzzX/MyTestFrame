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
    private _bubbleTypes:Array<BubbleType> = [BubbleType.Empty, BubbleType.Blue, BubbleType.Green, BubbleType.Red, BubbleType.Yellow];

    /** 行数 */
    private _row: number = 12;
    /** 列数，取大的， 即一行为8列，一行为9列 */
    private _col: number = 8;

    /** 将要发射的泡泡 */
    _preBubbles: BubbleData[] = [];


    /** 6个检测方向 */
    private _directions: Array<cc.Vec2> = [cc.v2(1, 0), cc.v2(-1, 0), // 横向左右的检测(左右)
        cc.v2(-1, -1), cc.v2(1, -1),  // 下方的（下左，下右）
        cc.v2(-1, 1), cc.v2(1, 1),  // 上方的（上左，上右）
    ];

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
        this._row = 12;
        this._col = 8;
        this.initBubbleDatas();
        this.createPreBubbles();
    }

    private initBubbleDatas() : void
    {
        for (let i = 1; i <= this._row; i++) {
            // 创建一行空的
            this._bubbleDatas[i] = [];
            // 然后填满空行
            let col: number = this._col;
            if (i % 2 == 1) col += 1;
            for (let j = 1; j <= col; j++) {
                this._bubbleDatas[i][j] = new BubbleData();
            }
        }

        this._bubbleDatas.forEach((bubbleList, i)=>{
            bubbleList.forEach((bubble, j)=>{
                let type: BubbleType = this.getRandomBubbleType();
                bubble.type = type;
                bubble.x = j;
                bubble.y = i;
            });
        })

        // for (let i = 1; i < this._bubbleDatas.length; i++) {
        //     // let bGetNewOne: boolean = true;
        //     // while (bGetNewOne)
        //     // {
        //         for (let j = 1; j < this._bubbleDatas[i].length; j++) {
        //             let bubble: BubbleData = this._bubbleDatas[i][j];
        //             let type: BubbleType = this.getRandomBubbleType();
        //             bubble.type = type;
        //             bubble.x = j;
        //             bubble.y = i;
        //             // bubble.line = i;
        //         }
        //         // 新添的一行泡泡会掉下去，则重新随机一个
        //         // let fallBubbles:Array<BubbleData> = this.checkBubbleFall();
        //         // if (fallBubbles.length > 0) bGetNewOne = true;
        //         // else bGetNewOne = false;
        //         // if (i == 1) bGetNewOne = false;
        //     // }
        // }
    }

    //#region 公共方法
    /**
     * 获取泡泡数据列表
     */
    public getBubbleDatas(): any
    {
        return this._bubbleDatas;
    }

    public getPreBubbles(): any
    {
        if (null == this._preBubbles || this._preBubbles.length < 2)
            this.createPreBubbles();
        return this._preBubbles;
    }

    public exchangePreBubbles(): void
    {
        let temp: BubbleData = this._preBubbles[0];
        this._preBubbles[0] = this._preBubbles[1];
        this._preBubbles[1] = temp;
    }

    //#endregion

    /**
     * 创建将要发射的泡泡数据
     */
    private createPreBubbles(): any
    {
        while(this._preBubbles.length < 2)
        {
            let bubble: BubbleData = new BubbleData();
            bubble.type = this.getRandomBubbleType();
            this._preBubbles.push(bubble);
        }
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
     * @returns 返回可消除的泡泡坐标数组
     */
    private checkBubbleCrush(x: number, y: number): any
    {
        let sameBubblePoss: Array<cc.Vec2> = []; // 与新添的泡泡相同的泡泡
        let saveTag = {};
        saveTag[x + "_" + y] = true;
        let curBubble: BubbleData = this._bubbleDatas[y][x];
        if (null == curBubble || curBubble.isEmpty()) return [];

        sameBubblePoss.push(cc.v2(curBubble.x, curBubble.y));
        let index: number = 0;
        while (index < sameBubblePoss.length)
        {
            let pos: cc.Vec2 = sameBubblePoss[index];
            let bubble: BubbleData = this._bubbleDatas[pos.y][pos.x];
            index++;
            if (null == bubble || bubble.isEmpty()) continue;
            // 检测各个方向的是否有相同类型的泡泡
            for (let i = 0; i < this._directions.length; i++) {
                let direc:cc.Vec2 = this._directions[i];
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
                    sameBubblePoss.push(cc.v2(tempX, tempY));
                }
            }
        }

        return sameBubblePoss;
    }

    // 所有不会掉落的泡泡
    linkedBubblePoss = [];

    /**
     * 检查掉落的泡泡，判断每个泡泡的连接，能够连接到最顶上的泡泡的，
     * 则不会掉落，反之则会掉落
     * @returns 会掉落的泡泡
     */
    private checkBubbleFall(): any
    {
        // 最顶上的一行
        let topLine: Array<BubbleData> = [];
        // 将最顶上的一行取出来
        for (let i = 1; i < this._bubbleDatas[1].length; i++) {
            const element: BubbleData = this._bubbleDatas[1][i];
            if (!element.isEmpty()) topLine.push(element);
        }

        if (!topLine || topLine.length <= 0) return [];

        // 所有不会掉落的泡泡
        // let linkedBubbles: Array<BubbleData> = [];
        for (let i = 0; i < topLine.length; i++) {
            const bubble:BubbleData = topLine[i];
            if (null == bubble || bubble.isEmpty()) continue;
            let bubblePoss: Array<cc.Vec2> = this.getLinkedBubbles(bubble.x, bubble.y);
            for (let j = 0; j < bubblePoss.length; j++) {
                const el:cc.Vec2 = bubblePoss[j];
                if (!el) continue;
                if (this.linkedBubblePoss.indexOf(el) == -1) this.linkedBubblePoss.push(el);
            }
        }

        let fallBubbles: Array<cc.Vec2> = [];
        this._bubbleDatas.forEach((bubbleList)=>{
            bubbleList.forEach((bubble)=>{
                let pos: cc.Vec2 = cc.v2(bubble.x, bubble.y);
                if (this.linkedBubblePoss.indexOf(pos) == -1) fallBubbles.push(pos);
            });
        });
        // for (let i = 1; i < this._bubbleDatas.length; i++) {
        //     const bubbles:Array<BubbleData> = this._bubbleDatas[i];
        //     for (let j = 1; j < bubbles.length; j++) {
        //         const element = bubbles[j];
        //         if (!element || element.isEmpty()) continue;
        //         if (this.linkedBubblePoss.indexOf(element) == -1) fallBubbles.push(cc.v2(element.x, element.y));
        //     }
        // }

        return fallBubbles;
    }

    /**
     * 获取与此bubble相连的所有bubbles
     * @param x x坐标
     * @param y y坐标
     */
    private getLinkedBubbles(x: number, y: number): any
    {
        let bubble: BubbleData = this._bubbleDatas[y][x];
        if (!bubble || bubble.isEmpty()) return [];

        let linkBubblePoss: Array<cc.Vec2> = [];
        let saveTag = {};

        linkBubblePoss.push(cc.v2(bubble.x, bubble.y));
        saveTag[x + "_" + y] = true;
        let index = 0;

        while (index < linkBubblePoss.length)
        {
            let pos: cc.Vec2 = linkBubblePoss[index];
            let bubble: BubbleData = this._bubbleDatas[pos.y][pos.x];
            index++;
            if (null == bubble || bubble.isEmpty()) continue;
            // 检测各个方向的泡泡
            for (let i = 0; i < this._directions.length; i++) {
                let direc:cc.Vec2 = this._directions[i];
                let tempX: number = bubble.x + direc.x;
                let tempY: number = bubble.y + direc.y;
                if (tempX < 1 || tempX > this._bubbleDatas.length ||
                    tempY < 1 || tempY > this._bubbleDatas.length ||
                    !this._bubbleDatas[tempY][tempX] || 
                    this._bubbleDatas[tempY][tempX].isEmpty() || 
                    !saveTag[tempX + "_" + tempY])
                {
                    continue;
                }
                // 记录还未记录的泡泡
                if (this.linkedBubblePoss.indexOf(cc.v2(tempY, tempX)) == -1)
                    linkBubblePoss.push(cc.v2(tempY, tempX));
            }
        }
        return linkBubblePoss;
    }

    /**
     * 消除泡泡
     * @param crushList 要消除的泡泡列表
     */
    private doBubbleCrush(crushList: Array<cc.Vec2>): void
    {
        if (null == crushList || crushList.length <= 0) return;

    }

    /**
     * 处理泡泡下落
     */
    private doBubbleFall(fallList: Array<cc.Vec2>): void
    {
        if (null == fallList || fallList.length <= 0) return;

    }


    private doAddBubble(): void
    {

    }
    
}
