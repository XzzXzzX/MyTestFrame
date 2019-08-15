import { BubbleType } from "./ConstConfigs";

/**
 * xuan
 * 2019-8-14 16:57:50
 * 泡泡数据类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class BubbleData {
    /** 对象唯一id */
    public uid: number = 0;

    /** 泡泡类型 */
    public type: BubbleType = BubbleType.Empty;

    public x: number;
    public y: number;
    /** 所在行数 */
    public line: number;

}
