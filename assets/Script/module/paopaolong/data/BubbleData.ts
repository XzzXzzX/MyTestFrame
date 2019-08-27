import { BubbleType, BubbleState } from "./ConstConfigs";

/**
 * xuan
 * 2019-8-14 16:57:50
 * 泡泡数据类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class BubbleData {
    /** 记录uid */
    private static BUBBLE_UID: number = 0;

    /** 对象唯一id */
    public uid: number = 0;

    /** 泡泡类型 */
    public type: BubbleType = BubbleType.Empty;

    public x: number;
    public y: number;

    /** 状态 */
    public state: BubbleState;

    /** 动作状态 {aniname:"", anitime:0, }*/
    public cmd = [];


    constructor()
    {
        BubbleData.BUBBLE_UID++;
        this.uid = BubbleData.BUBBLE_UID;
        this.x = -1;
        this.y = -1;
        this.state = BubbleState.COMMON;
    }

    public explore(): void
    {

    }

    public isEmpty(): boolean
    {
        return this.type == BubbleType.Empty;
    }

    /**
     * 是否是奇数行
     */
    public isOdd(): boolean
    {
        return (this.y % 2 == 1);
    }

    public toFix(): void
    {
        this.cmd.push({
            aniname: "fix",
            anitime: 0.1,
            keeptime: 0.1,
            pos: cc.v2(this.x, this.y),
        });
    }

    public toMoveDown(): void
    {
        this.cmd.push({
            aniname: "moveDown",
            anitime: 0.3,
            keeptime: 0.1,
            pos: cc.v2(this.x, this.y),
        });
    }

    public toFall(): void
    {
        this.cmd.push({
            aniname: "fall",
            anitime: 0.3,
            keeptime: 0.1,
            pos: cc.v2(this.x, this.y),
        });
    }

}
