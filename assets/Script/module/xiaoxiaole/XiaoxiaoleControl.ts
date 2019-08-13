import { CELL_STATUS, ANITIME, CELL_TYPE, GRID_WIDTH, GRID_HEIGHT } from "./data/XiaoxiaoleConfig";
import CellData from "./data/CellData";

/**
 * xuan
 * 2019-8-12 11:00:40
 * 消消乐数据控制类
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class XiaoxiaoleControl {
    private static _instance: XiaoxiaoleControl = null;

    /**
     * 所有格子坐标，二维数组，每个元素表示一行 this._cells[i] 表示第i行
     */
    private _cells:Array<CellData[]> = [];

    /**
     * 当前局的行数
     */
    private _curRow = GRID_WIDTH;

    /**当前局的列数 */
    private _curCol = GRID_HEIGHT;

    /**
     * 上个选中的格子坐标
     */
    private _lastCellPos: cc.Vec2 = cc.v2(-1, -1);

    /**
     * 格子类型数组（这一局产生的所有格子类型，都在这里选取）
     */
    private _typeList: Array<number> = [CELL_TYPE.Bear, CELL_TYPE.Cat, CELL_TYPE.Chicken, CELL_TYPE.Fox, CELL_TYPE.Frog, CELL_TYPE.Horse];

    /** 状态改变了的格子列表 */
    private _changedCells = [];

    /** 格子消失爆炸等效果列表 */
    private _effectList = [];

    private _curTime: number = 0;



    public static getInstance(): XiaoxiaoleControl
    {
        if (null == this._instance)
        {
            this._instance = new XiaoxiaoleControl();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void
    {
        this.initCells();
    }

    /**
     * 设置格子类型列表，打乱列表顺序
     * @param typeArr 格子类型列表
     */
    private setCellTypeList(typeArr:number[]): void
    {
        for (let i = 0; i < typeArr.length; i++) {
            let index = Math.floor(Math.random() * (typeArr.length - i)) + i;
            typeArr[i], typeArr[index] = typeArr[index], typeArr[i];
        }
    }

    /**
     * 获取一个随机格子类型
     */
    private getRandomCellType(): number
    {
        let index = Math.floor(Math.random() * this._typeList.length);
        return this._typeList[index];
    }

    /**
     * 按照格子坐标，检查是否有消除的
     * @param cellX 格子x坐标
     * @param cellY 格子y坐标
     * @returns [] [0]可消除的格子, [1] 可合成的新格子状态,[2]合成的新的格子的类型
     */
    private checkCellPos(cellX: number, cellY: number): any
    {
        // 检查横向、纵向是否有同样的格子
        let checkWithDirection = function (x, y, direction) {
            let queue = [];
            let vis = [];
            vis[x + y * this._curRow] = true;
            queue.push(cc.v2(x, y));
            let front = 0;
            while (front < queue.length) {
                //let direction = [cc.v2(0, -1), cc.v2(0, 1), cc.v2(1, 0), cc.v2(-1, 0)];
                let point = queue[front];
                let cellModel = this._cells[point.y][point.x];
                front++;
                if (!cellModel) {
                    continue;
                }
                for (let i = 0; i < direction.length; i++) {
                    let tmpX = point.x + direction[i].x;
                    let tmpY = point.y + direction[i].y;
                    if (tmpX < 1 || tmpX > this._curCol
                        || tmpY < 1 || tmpY > this._curRow
                        || vis[tmpX + tmpY * this._curRow]
                        || !this._cells[tmpY][tmpX]) {
                        continue;
                    }
                    if (cellModel.type == this._cells[tmpY][tmpX].type) {
                        vis[tmpX + tmpY * this._curRow] = true;
                        queue.push(cc.v2(tmpX, tmpY));
                    }
                }
            }
            return queue;
        }
        // 左右方向，行
        let rowResult = checkWithDirection.call(this, cellX, cellY, [cc.v2(1, 0), cc.v2(-1, 0)]);
        // 上下方向，列
        let colResult = checkWithDirection.call(this, cellX, cellY, [cc.v2(0, -1), cc.v2(0, 1)]);
        let result = [];
        let newCellStatus: CELL_STATUS;
        if (rowResult.length >= 5 || colResult.length >= 5) {
            newCellStatus = CELL_STATUS.BIRD;
        }
        else if (rowResult.length >= 3 && colResult.length >= 3) {
            newCellStatus = CELL_STATUS.WRAP;
        }
        else if (rowResult.length >= 4) {
            newCellStatus = CELL_STATUS.LINE;
        }
        else if (colResult.length >= 4) {
            newCellStatus = CELL_STATUS.COLUMN;
        }
        if (rowResult.length >= 3) {
            result = rowResult;
        }
        // 将同样的可消除的格子，去重，放入result
        if (colResult.length >= 3) {
            let tmp = result.concat();
            colResult.forEach(function (newEle) {
                let flag = false;
                tmp.forEach(function (oldEle) {
                    if (newEle.x == oldEle.x && newEle.y == oldEle.y) {
                        flag = true;
                    }
                }, this);
                if (!flag) {
                    result.push(newEle);
                }
            }, this);
        }
        // result 可消除的格子
        // newCellStatus 可合成的新格子状态(单独消，合成一个可消一行的新格子，合成各种特殊的格子)
        return [result, newCellStatus, this._cells[cellY][cellX].type];
    }

    /** 添加到 变化了的格子列表中 */
    private pushToChangeCells(cell) 
    {
        if (this._changedCells.indexOf(cell) != -1) {
            return;
        }
        this._changedCells.push(cell);
    }

    /**
     * 交换格子位置
     * @param pos1 位置1
     * @param pos2 位置2
     */
    private exchangeCellPos(pos1: cc.Vec2, pos2: cc.Vec2): void
    {
        var tmpModel = this._cells[pos1.y][pos1.x];
        this._cells[pos1.y][pos1.x] = this._cells[pos2.y][pos2.x];
        this._cells[pos1.y][pos1.x].x = pos1.x;
        this._cells[pos1.y][pos1.x].y = pos1.y;
        this._cells[pos2.y][pos2.x] = tmpModel;
        this._cells[pos2.y][pos2.x].x = pos2.x;
        this._cells[pos2.y][pos2.x].y = pos2.y;
    }

    /**
     * 创建新的格子数据
     * @param pos 格子坐标位置
     * @param status 状态
     * @param type 类型
     */
    private createNewCell(pos: cc.Vec2, status: CELL_STATUS, type: number): void
    {
        if (null == status) {
            return;
        }
        if (status == CELL_STATUS.BIRD) {
            type = CELL_TYPE.BIRD
        }
        let model = new CellData();
        this._cells[pos.y][pos.x] = model
        model.init(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this._curTime, true);
        this._changedCells.push(model);
    }
    
    /**
     * 处理消除
     * @param checkPoint 需要检测消除的点
     */
    private processCrush(checkPoint: any[]) {
        let cycleCount = 0; // 消除次数
        while (checkPoint.length > 0) {
            let bombModels = [];
            // 处理特殊消除，俩个特殊的格子互相消除
            if (cycleCount == 0 && checkPoint.length == 2) { 
                let pos1 = checkPoint[0];
                let pos2 = checkPoint[1];
                let model1:CellData = this._cells[pos1.y][pos1.x];
                let model2:CellData = this._cells[pos2.y][pos2.x];
                
                // 两个都是五色鸟，所有的都消光
                if (model1.status == CELL_STATUS.BIRD && model2.status == CELL_STATUS.BIRD)
                {
                    // TODO
                    
                }
                // 其中一个是五色鸟，
                else if (model1.status == CELL_STATUS.BIRD || model2.status == CELL_STATUS.BIRD) {
                    // let bombModel = null;
                    if (model1.status == CELL_STATUS.BIRD) {
                        model1.type = model2.type;
                        model1.setStatus(model2.status);
                        bombModels.push(model1);
                    }
                    else {
                        model2.type = model1.type;
                        model2.setStatus(model1.status);
                        bombModels.push(model2);
                    }
                }
            }
            for (let i in checkPoint) {
                let pos:cc.Vec2 = checkPoint[i];
                if (!this._cells[pos.y][pos.x]) {
                    continue;
                }
                let [result, newCellStatus, newCellType] = this.checkCellPos(pos.x, pos.y);
                if (result.length < 3) {
                    continue;
                }
                for (let j in result) {
                    let model:CellData = this._cells[result[j].y][result[j].x];
                    this.crushCell(result[j].x, result[j].y, false, cycleCount);
                    if (model.status != CELL_STATUS.COMMON) {
                        bombModels.push(model);
                    }
                }
                this.createNewCell(pos, newCellStatus, newCellType);
            }
            this.processBomb(bombModels, cycleCount);
            this._curTime += ANITIME.DIE;
            checkPoint = this.down();
            cycleCount++;
        }
    }

    /**
     * 处理爆炸效果（行、列、块等）
     */
    private processBomb(bombCells: Array<CellData>, cycleCount: number): void
    {
        while (bombCells.length > 0) {
            let newBombModel = [];
            let bombTime = ANITIME.BOMB_DELAY;
            bombCells.forEach(function (model) {
                if (model.status == CELL_STATUS.LINE) {
                    for (let i = 1; i < this._cells[model.y].length; i++) {
                        if (this._cells[model.y][i]) {
                            if (this._cells[model.y][i].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this._cells[model.y][i]);
                            }
                            this.crushCell(i, model.y, false, cycleCount);
                        }
                    }
                    this.addRowBomb(this.curTime, cc.v2(model.x, model.y));
                }
                else if (model.status == CELL_STATUS.COLUMN) {
                    for (let i = 1; i < this._cells.length; i++) {
                        if (this._cells[i][model.x]) {
                            if (this._cells[i][model.x].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this._cells[i][model.x]);
                            }
                            this.crushCell(model.x, i, false, cycleCount);
                        }
                    }
                    this.addColBomb(this.curTime, cc.v2(model.x, model.y));
                }
                else if (model.status == CELL_STATUS.WRAP) {
                    let x = model.x;
                    let y = model.y;
                    for (let i = 1; i < this._cells.length; i++) {
                        for (let j = 1; j < this._cells[i].length; j++) {
                            let delta = Math.abs(x - j) + Math.abs(y - i);
                            if (this._cells[i][j] && delta <= 2) {
                                if (this._cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this._cells[i][j]);
                                }
                                this.crushCell(j, i, false, cycleCount);
                            }
                        }
                    }
                }
                else if (model.status == CELL_STATUS.BIRD) {
                    let crushType = model.type
                    if (bombTime < ANITIME.BOMB_BIRD_DELAY) {
                        bombTime = ANITIME.BOMB_BIRD_DELAY;
                    }
                    if (crushType == CELL_TYPE.BIRD) {
                        crushType = this.getRandomCellType();
                    }
                    for (let i = 1; i < this._cells.length; i++) {
                        for (let j = 1; j < this._cells[i].length; j++) {
                            if (this._cells[i][j] && this._cells[i][j].type == crushType) {
                                if (this._cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this._cells[i][j]);
                                }
                                this.crushCell(j, i, true, cycleCount);
                            }
                        }
                    }
                    //this.crushCell(model.x, model.y);
                }
            }, this);
            if (bombCells.length > 0) {
                this._curTime += bombTime;
            }
            bombCells = newBombModel;
        }
    }

    /**
     * 
     * @param x 格子x坐标
     * @param y 格子y坐标
     * @param needShake 是否需要摇晃
     * @param step 第几步消除
     */
    private crushCell(x: number, y: number, needShake: boolean, step: number): void
    {
        let model: CellData = this._cells[y][x];
        this.pushToChangeCells(model);
        if (needShake) {
            model.toShake(this._curTime)
        }

        let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
        model.toDie(this._curTime + shakeTime);
        this.addCrushEffect(this._curTime + shakeTime, cc.v2(model.x, model.y), step);
        this._cells[y][x] = null;
    }

    /**
     * 下落
     */
    private down(): any
    {
        let newCheckPoint = [];
        for (var i = 1; i < this._cells.length; i++) {
            for (var j = 1; j <this._cells[i].length; j++) {
                if (this._cells[i][j] == null) {
                    var curRow = i;
                    for (var k = curRow; k <this._cells.length; k++) {
                        if (this._cells[k][j]) {
                            this.pushToChangeCells(this._cells[k][j]);
                            newCheckPoint.push(this._cells[k][j]);
                            this._cells[curRow][j] = this._cells[k][j];
                            this._cells[k][j] = null;
                            this._cells[curRow][j].setXY(j, curRow);
                            this._cells[curRow][j].moveTo(cc.v2(j, curRow), this._curTime);
                            curRow++;
                        }
                    }
                    var count = 1;
                    for (var k = curRow; k <this._cells.length; k++) {
                        this._cells[k][j] = new CellData();
                        this._cells[k][j].init(this.getRandomCellType());
                        this._cells[k][j].setStartXY(j, count + this._curRow);
                        this._cells[k][j].setXY(j, count + this._curRow);
                        this._cells[k][j].moveTo(cc.v2(j, k), this._curTime);
                        count++;
                        this._changedCells.push(this._cells[k][j]);
                        newCheckPoint.push(this._cells[k][j]);
                        cc.log("新添的下落格子：", this._cells[k][j]);
                    }
                }
            }
        }
        this._curTime += ANITIME.TOUCH_MOVE + 0.3;

        return newCheckPoint;
    }

    /**
     * 
     * @param {开始播放的时间} playTime 
     * @param {*cell位置} pos 
     * @param {*第几次消除，用于播放音效} step 
     */
    private addCrushEffect(playTime, pos, step) {
        this._effectList.push({
            playTime,
            pos,
            action: "crush",
            step
        });
    }

    private addRowBomb(playTime, pos) {
        this._effectList.push({
            playTime,
            pos,
            action: "rowBomb"
        });
    }

    private addColBomb(playTime, pos) {
        this._effectList.push({
            playTime,
            pos,
            action: "colBomb"
        });
    }

    private addWrapBomb(playTime, pos) {
        // TODO
    }

    //#region  公共方法
    /**
     * 初始化格子数组
     * @param row 行
     * @param col 列
     * @param typeArr 类型数组
     */
    public initCells(row?: number, col?: number, typeArr?: number[]): void
    {
        row = row || this._curRow;
        this._curRow = row;
        col = col || this._curCol;
        this._curCol = col;
        typeArr = typeArr || this._typeList;
        this._typeList = typeArr;

        this.setCellTypeList(this._typeList);

        for (var i = 1; i <= row; i++) {
            this._cells[i] = [];
            for (var j = 1; j <= col; j++) {
                this._cells[i][j] = new CellData();
            }
        }

        // 列
        for (var i = 1; i < this._cells.length; i++) {
            // 行
            for (var j = 1; j < this._cells[i].length; j++) {
                let flag = true;
                // 初始化格子棋盘
                while (flag) {
                    flag = false;
                    let cellData: CellData = this._cells[i][j];
                    cellData.init(this.getRandomCellType());
                    let result = this.checkCellPos(j, i)[0];
                    // 生成的格子如果可消除，则这个格子再重新随机格子类型
                    if (result.length > 2) {
                        flag = true;
                    }
                    cellData.setXY(j, i);
                    cellData.setStartXY(j, i);
                }
            }
        }
    }


    /**
     * 获取界面初始化数据
     */
    public getInitDatas(): any
    {
        return this._cells;
    }

    /**
     * 选中格子，做交换操作
     * @param cellPos 格子坐标
     */
    public selectCell(cellPos: cc.Vec2): any
    {
        this._changedCells = [];
        this._effectList = [];
        let lastPos: cc.Vec2 = this._lastCellPos;

        let delta: number = Math.abs(cellPos.x - lastPos.x) + Math.abs(cellPos.y - lastPos.y);
        // 非相邻的格子，无法交换操作，直接返回
        if (delta != 1)
        {
            this._lastCellPos = cellPos;
            return [[], []];
        }

        let curClickCell = this._cells[cellPos.y][cellPos.x];
        let lastClickCell = this._cells[lastPos.y][lastPos.x];
        // 交换数据位置，检测能否消除
        this.exchangeCellPos(lastPos, cellPos);
        let result1 = this.checkCellPos(cellPos.x, cellPos.y)[0];
        let result2 = this.checkCellPos(lastPos.x, lastPos.y)[0];

        this._curTime = 0; // 动画播放的当前时间
        this.pushToChangeCells(curClickCell);
        this.pushToChangeCells(lastClickCell);
        let isCanBomb = (curClickCell.status != CELL_STATUS.COMMON && // 判断两个是否是特殊的动物
            lastClickCell.status != CELL_STATUS.COMMON) ||
            curClickCell.status == CELL_STATUS.BIRD ||
            lastClickCell.status == CELL_STATUS.BIRD;
        if (result1.length < 3 && result2.length < 3 && !isCanBomb) {
            this.exchangeCellPos(lastPos, cellPos);
            // 不会发生消除的情况,还原数据位置交换
            curClickCell.moveToAndBack(lastPos);
            lastClickCell.moveToAndBack(cellPos);
            this._lastCellPos = cc.v2(-1, -1);
            return [this._changedCells];
        }
        else {
            this._lastCellPos = cc.v2(-1, -1);
            // 可以消除，界面位置交换
            curClickCell.moveTo(lastPos, this._curTime);
            lastClickCell.moveTo(cellPos, this._curTime);
            var checkPoint = [cellPos, lastPos];
            this._curTime += ANITIME.TOUCH_MOVE;
            this.processCrush(checkPoint);
            return [this._changedCells, this._effectList];
        }
    }
    //#endregion


    /**
     * 清除每个cell的cmd
     */
    public cleanCmd() 
    {
        for (var i = 1; i < this._cells.length; i++) {
            for (var j = 1; j < this._cells[i].length; j++) {
                if (this._cells[i][j]) {
                    this._cells[i][j].cmd = [];
                }
            }
        }
    }

}