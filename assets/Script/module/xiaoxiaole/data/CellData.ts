import { CELL_STATUS, CELL_TYPE, ANITIME } from "./XiaoxiaoleConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CellData  {

    /** 格子类型 */
    public type = null;
    /** 格子状态 */
    public status = CELL_STATUS.COMMON;
    public x = 1;
    public y = 1;
    public startX = 1;
    public startY = 1;
    public cmd = [];
    public isDeath = false;
    public objecCount = Math.floor(Math.random() * 1000);

    public init(type) 
    {
        this.type = type;
    }

    public isEmpty() 
    {
        return this.type == CELL_TYPE.EMPTY;
    }

    public setEmpty() 
    {
        this.type = CELL_TYPE.EMPTY;
    }

    public setXY(x, y) 
    {
        this.x = x;
        this.y = y;
    }

    public setStartXY(x, y) 
    {
        this.startX = x;
        this.startY = y;
    }

    public setStatus(status) 
    {
        this.status = status;
    }

    public moveToAndBack(pos) 
    {
        var srcPos = cc.v2(this.x, this.y);
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: 0,
            pos: pos
        });
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: ANITIME.TOUCH_MOVE,
            pos: srcPos
        });
    }

    public moveTo(pos, playTime) 
    {
        var srcPos = cc.v2(this.x, this.y); 
        this.cmd.push({
            action: "moveTo",
            keepTime: ANITIME.TOUCH_MOVE,
            playTime: playTime,
            pos: pos
        });
        this.x = pos.x;
        this.y = pos.y;
    }

    public toDie(playTime) 
    {
        this.cmd.push({
            action: "toDie",
            playTime: playTime,
            keepTime: ANITIME.DIE
        });
        this.isDeath = true;
    }

    public toShake(playTime) 
    {
        this.cmd.push({
            action: "toShake",
            playTime: playTime,
            keepTime: ANITIME.DIE_SHAKE
        });
    }

    public setVisible(playTime, isVisible) 
    {
        this.cmd.push({
            action: "setVisible",
            playTime: playTime,
            keepTime: 0,
            isVisible: isVisible
        });
    }

    public moveToAndDie(pos) 
    {

    }

    public isBird() 
    {
        return this.type == CELL_TYPE.BIRD
    }
}