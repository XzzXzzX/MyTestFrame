import { ViewType } from "../../../core/data/ViewType";
import { CELL_WIDTH } from "../data/XiaoxiaoleConfig";
import AudioUtils from "../AudioUtil";

/**
 * xuan
 * 2019-8-12 17:59:37
 * 特效动画层view
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectView extends cc.Component {

    public playEffect(effectQueue): void
    {
        if(!effectQueue || effectQueue.length <= 0){
            return ;
        }
        let soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放
        effectQueue.forEach(function(cmd){
            let delayTime = cc.delayTime(cmd.playTime);
            let callFunc = cc.callFunc(function(){
                let instantEffect = null;
                let animation = null;
                if(cmd.action == "crush"){
                    instantEffect = cc.instantiate(cc.loader.getRes(ViewType.Crush));
                    animation  = instantEffect.getComponent(cc.Animation);
                    animation.play("effect");
                    !soundMap["crush" + cmd.playTime] && AudioUtils.getInstance().playEliminate(cmd.step);
                    soundMap["crush" + cmd.playTime] = true;
                }
                else if(cmd.action == "rowBomb"){
                    instantEffect = cc.instantiate(cc.loader.getRes(ViewType.BombWhite));
                    animation  = instantEffect.getComponent(cc.Animation);
                    animation.play("effect_line");
                }
                else if(cmd.action == "colBomb"){
                    instantEffect = cc.instantiate(cc.loader.getRes(ViewType.BombWhite));
                    animation  = instantEffect.getComponent(cc.Animation);
                    animation.play("effect_col");
                }

                instantEffect.x = CELL_WIDTH * (cmd.pos.x - 0.5);
                instantEffect.y = CELL_WIDTH * (cmd.pos.y - 0.5);
                instantEffect.parent = this.node;
                animation.on("finished",function(){
                    instantEffect.destroy();
                },this);
               
            },this);
            this.node.runAction(cc.sequence(delayTime, callFunc));
        },this);
    }
}