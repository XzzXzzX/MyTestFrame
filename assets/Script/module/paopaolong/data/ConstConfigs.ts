/**
 * xuan
 * 2019-8-14 17:02:34
 * 常用枚举及常量
 */

export enum BubbleType
{
   Empty,
   Blue,
   Green,
   Red,
   Yellow,
}

export const BubbleColors = {
    [BubbleType.Empty] : cc.Color.TRANSPARENT,
    [BubbleType.Blue] : cc.Color.BLUE,
    [BubbleType.Green] : cc.Color.GREEN,
    [BubbleType.Red] : cc.Color.RED,
    [BubbleType.Yellow] : cc.Color.YELLOW,
}

export enum BubbleState {
    /** 普通类型 */
    COMMON,
    /** 预备发射类型 */
    PREPARE,
}

/** 泡泡宽度 */
export const BUBBLE_WIDTH: number = 70;
/** 泡泡高度 */
export const BUBBLE_HEIGHT: number = 70;