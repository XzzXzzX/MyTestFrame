import UIManager from "../../core/manager/UIManager";
import BaseView from "../../core/view/BaseView";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestPopView extends BaseView {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.btnClose.on("click", this.onCloseClick, this);

    }

    // update (dt) {}


    protected onCloseClick(): void {
        super.onCloseClick();
        // UIManager.getInstance().closeView(this.node);
    }
}
