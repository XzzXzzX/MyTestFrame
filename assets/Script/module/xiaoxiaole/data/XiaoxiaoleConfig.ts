/**
 * xuan
 * 2019-8-12 11:05:11
 * 消消乐通用配置相关
 */

 /**
  * 格子宽高
  */
export const CELL_WIDTH = 70;
export const CELL_HEIGHT = 70;

/** 列数 */
export const GRID_HEIGHT = 9;
/** 行数 */
export const GRID_WIDTH = 10;

/**
 * 最大宽高
 */
export const MAX_WIDTH = CELL_WIDTH * CELL_HEIGHT;
export const MAX_HEIGHT = CELL_HEIGHT * CELL_WIDTH;

/**
 * 格子类型
 */
export enum CELL_TYPE {
    /**空格子 */
    EMPTY = 0,
    /**熊 */
    Bear,
    /**猫头鹰 */
    Cat,
    /**小黄鸡 */
    Chicken,
    /**青蛙 */
    Frog,
    /**狐狸 */
    Fox,
    /**河马 */
    Horse,
    /**五色鸟 */
    BIRD,
}

/**
 * 格子状态
 */
export enum CELL_STATUS {
    /** 普通 */
    COMMON = 0, 
    /** 选中 */
    CLICK = "click",
    /** 行 */
    LINE = "line",
    /** 列 */
    COLUMN = "column",
    /** 爆 */
    WRAP = "wrap",
    /** 五色鸟 */
    BIRD = "bird",
}

/** 各动画时长 */
export const ANITIME = {
  TOUCH_MOVE: 0.3,
  DIE: 0.2,
  DOWN: 0.5,
  BOMB_DELAY: 0.3,
  BOMB_BIRD_DELAY: 0.7,
  DIE_SHAKE: 0.4 // 死前抖动
}

/**
 * 
export const CELL_TYPE = {
    EMPTY : 0,
    A : 1,
    B : 2,
    C : 3,
    D : 4,
    E : 5,
    F : 6,
    BIRD : 7
}
 * export const CELL_STATUS = {
    COMMON: 0 ,
    CLICK: "click",
    LINE: "line",
    COLUMN: "column",
    WRAP: "wrap",
    BIRD: "bird"
} 

export const GRID_WIDTH = 9;
export const GRID_HEIGHT = 9;

export const CELL_WIDTH = 70;
export const CELL_HEIGHT = 70;

export const GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
export const GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;
 */