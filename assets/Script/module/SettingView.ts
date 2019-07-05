import EventManager from "../core/manager/EventManager";
import { EventType } from "../core/data/EventType";
import AudioManager from "../core/manager/AudioManager";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingView extends cc.Component {

    @property(cc.Node)
    btnClose: cc.Node = null;

    @property(cc.Label)
    labBgmVolume: cc.Label = null;
    
    @property(cc.Label)
    labEffVolume: cc.Label = null;

    @property(cc.Slider)
    sliderBgm: cc.Slider = null;
    
    @property(cc.Slider)
    sliderEff: cc.Slider = null;

    @property(cc.Node)
    btnBgm: cc.Node = null;
    
    @property(cc.Node)
    btnEff: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.btnClose.on("click", this.onCloseClick, this);
        this.btnBgm.on("click", this.onBgmClick, this);
        this.btnEff.on("click", this.onEffClick, this);
        this.sliderBgm.node.on("slide", this.onBgmSliderCB, this);
        this.sliderEff.node.on("slide", this.onEffSliderCB, this);
    }

    // update (dt) {}

    private onCloseClick(event: cc.Event.EventCustom): void
    {
        cc.log("onCloseClick: ", event.getUserData());
        EventManager.getInstance().dispatchEvent(EventType.CLOSE_VIEW, {view: this.node});
    }

    private onBgmClick(): void
    {
        AudioManager.getInstance().playBgm("city.mp3");
    }

    private onEffClick(): void
    {
        AudioManager.getInstance().playEffect("click.pm3");
    }

    private onBgmSliderCB(event: cc.Event.EventCustom): void
    {
        // cc.log("onSliderCB: ", event.target);
        let target: cc.Node = event.target;
        let slider: cc.Slider = target.getComponent(cc.Slider);
        this.labBgmVolume.string = "背景音量：" + slider.progress.toFixed(2);
        AudioManager.getInstance().setBgmVolume(slider.progress);
    }

    private onEffSliderCB(event: cc.Event.EventCustom): void
    {
        // cc.log("onEffSliderCB: ", event.target);
        let target: cc.Node = event.target;
        let slider: cc.Slider = target.getComponent(cc.Slider);
        this.labEffVolume.string = "音效音量：" + slider.progress.toFixed(2);
        AudioManager.getInstance().setEffectVolume(slider.progress);
    }
}
