import EventManager from "../core/manager/EventManager";
import { EventType } from "../core/data/EventType";
import AudioManager from "../core/manager/AudioManager";
import { StorageTypes } from "../core/data/StorageTypes";
import BaseView from "../core/view/BaseView";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

/**
 * xuan
 * 2019-7-5 23:09:02
 * 设置界面
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingView extends BaseView {

    // @property(cc.Node)
    // btnClose: cc.Node = null;

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

    @property(cc.Node)
    btnLoad: cc.Node = null;
    @property(cc.Node)
    btnRelease: cc.Node = null;
    @property(cc.Node)
    btnPause: cc.Node = null;
    @property(cc.Node)
    btnResume: cc.Node = null;
    @property(cc.Node)
    btnStop: cc.Node = null;
    // @property(cc.Node)
    // btnEff: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private onPreload(): void {
        let a = arguments;
        cc.log("audio load cb: ", arguments);
    }

    start() {
        super.start();
        this.btnClose.on("click", this.onCloseClick, this);
        this.btnBgm.on("click", this.onBgmClick, this);
        this.btnEff.on("click", this.onEffClick, this);

        this.btnLoad.on("click", () => {
            AudioManager.getInstance().preloadAudio(AudioManager.getInstance().CurBgmName || "city.mp3", this.onPreload);
        }, this);
        this.btnRelease.on("click", () => {
            AudioManager.getInstance().releaseAudio(AudioManager.getInstance().CurBgmName);
        }, this);
        this.btnPause.on("click", () => {
            AudioManager.getInstance().pauseBgm();
        }, this);
        this.btnResume.on("click", () => {
            AudioManager.getInstance().resumeBgm();
        }, this);
        this.btnStop.on("click", () => {
            AudioManager.getInstance().stopBgm();
        }, this);

        this.sliderBgm.node.on("slide", this.onBgmSliderCB, this);
        this.sliderEff.node.on("slide", this.onEffSliderCB, this);

        let volume: number = Number(cc.sys.localStorage.getItem(StorageTypes.AUDIO_BMG_VOLUME) || "1");
        this.sliderBgm.progress = volume;
        this.labBgmVolume.string = "背景音量：" + volume;
        volume = Number(cc.sys.localStorage.getItem(StorageTypes.AUDIO_EFF_VOLUME) || "1");
        this.sliderEff.progress = volume;
        this.labEffVolume.string = "音效音量：" + volume;
    }

    // update (dt) {}

    protected onCloseClick(): void {
        // super.onCloseClick();
        EventManager.getInstance().dispatchEvent(EventType.CLOSE_VIEW, { viewType: this._viewType, bRemove: true });
    }

    private onBgmClick(): void {
        AudioManager.getInstance().playBgm("city.mp3");
    }

    private onEffClick(): void {
        AudioManager.getInstance().playEffect("click.mp3");
    }

    private onBgmSliderCB(event: any): void {
        // cc.log("onSliderCB: ", event.target);
        let slider: cc.Slider = event;
        if (cc.ENGINE_VERSION == '1.8.2') {
            let target: cc.Node = event.target;
            slider = target.getComponent(cc.Slider);
        }

        this.labBgmVolume.string = "背景音量：" + slider.progress.toFixed(2);
        AudioManager.getInstance().setBgmVolume(slider.progress);

        cc.sys.localStorage.setItem(StorageTypes.AUDIO_BMG_VOLUME, slider.progress.toFixed(2));
    }

    private onEffSliderCB(event: any): void {
        // cc.log("onEffSliderCB: ", event.target);
        let slider: cc.Slider = event;
        if (cc.ENGINE_VERSION == '1.8.2') {
            let target: cc.Node = event.target;
            slider = target.getComponent(cc.Slider);
        }
        this.labEffVolume.string = "音效音量：" + slider.progress.toFixed(2);
        AudioManager.getInstance().setEffectVolume(slider.progress);
        cc.sys.localStorage.setItem(StorageTypes.AUDIO_EFF_VOLUME, slider.progress.toFixed(2));
    }
}
