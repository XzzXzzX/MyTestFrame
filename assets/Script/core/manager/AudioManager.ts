/**
 * xuan
 * 2019-7-4 15:59:31
 * 声音管理
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager {
    private static _instance: AudioManager = null;

    /**
     * 当前正在播放的背景音乐名称
     */
    private _curBgmName: string = "";

    /**
     * 当前正在播放的背景音乐id
     */
    private _curBgmAudioID: number = -1;

    /**
     * 当前背景音乐音量
     */
    private _curBgmVolume: number = 1;

    /**
     * 当前正在播放的音效id
     */
    private _curEffectAudioID: number = -1;

    /**
     * 当前音效音乐音量
     */
    private _curEffectVolume: number = 1;

    /**
     * 正在播放bgm
     */
    private _isPlayingBgm: boolean = false;

    public static getInstance(): AudioManager {
        if (null == this._instance) {
            this._instance = new AudioManager();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void {

    }

    /**
     * 获取音频路径
     * @param name 音频名
     */
    private getAudioPath(name: string): string {
        return cc.url.raw("resources/sounds/" + name);
    }

    //#region 公共方法，播放控制

    /**
     * 预加载音频资源
     * @param audioName 音频名
     */
    public preloadAudio(audioName: string, cb?: any): void {
        // cc.audioEngine.preload(this.getAudioPath(audioName), cb);
        cc.loader.getRes(this.getAudioPath(audioName), cb);
    }

    /**
     * 释放音频资源
     * @param audioName 音频名
     */
    public releaseAudio(audioName: string): void {
        cc.audioEngine.uncache(this.getAudioPath(audioName));
        if (audioName == this._curBgmName) {
            this._curBgmAudioID = -1;
            this._curBgmName = "";
        }
    }

    /**
     * 释放所有音频资源
     */
    public releaseAllAudio(): void {
        cc.audioEngine.uncacheAll();
    }

    /**
     * 播放背景音乐
     * @param bgmName 背景音乐名称，需带文件后缀名，注意大小写
     * @param isLoop 是否循环播放
     */
    public playBgm(bgmName: string, isLoop?: boolean): void {
        if (this._curBgmName == bgmName) return;
        if (null == isLoop) isLoop = true;

        this._curBgmName = bgmName;
        this._isPlayingBgm = true;
        // let audio: cc.AudioClip = cc.loader.getRes(this.getAudioPath(bgmName));
        // if (!audio) {
        //     cc.loader.loadRes(this.getAudioPath(bgmName), cc.Asset, this._playBgm.bind(this));
        //     return;
        // }
        // audio = cc.instantiate(audio);

        // this._curBgmAudioID = cc.audioEngine.play(this.getAudioPath(bgmName), isLoop, this._curBgmVolume);
        this._curBgmAudioID = cc.audioEngine.play(this.getAudioPath(bgmName), isLoop, this._curBgmVolume);
    }

    _playBgm(err: any, res: any): void {
        if (!err) {

            let audio: cc.AudioClip = cc.instantiate(res);
            // this._curBgmAudioID = cc.audioEngine.play(audio, true, this._curBgmVolume);
            // this._curBgmAudioID = cc.audioEngine.play(this.getAudioPath(bgmName), isLoop, this._curBgmVolume);
        }

    }

    /**
     * 暂停背景音乐
     */
    public pauseBgm(): void {
        this._isPlayingBgm = false;
        cc.audioEngine.pause(this._curBgmAudioID);
    }

    /**
     * 继续背景音乐
     */
    public resumeBgm(): void {
        if (this._isPlayingBgm) {
            return;
        }
        this._isPlayingBgm = true;
        cc.audioEngine.resume(this._curBgmAudioID);
    }

    /**
     * 停止背景音乐
     */
    public stopBgm(): void {
        this._isPlayingBgm = false;
        cc.audioEngine.stop(this._curBgmAudioID);
        this._curBgmAudioID = -1;
        this._curBgmName = "";
    }

    /**
     * 设置背景音乐音量
     */
    public setBgmVolume(volume: number): void {
        this._curBgmVolume = volume;
        if (this._curBgmAudioID < 0) {
            return;
        }
        cc.audioEngine.setVolume(this._curBgmAudioID, this._curBgmVolume);
    }

    /**
     * 播放音效
     * @param effName 音效名称
     * @param isLoop 是否循环播放
     */
    public playEffect(effName: string, isLoop?: boolean): void {
        if (!isLoop) isLoop = false;
        this._curEffectAudioID = cc.audioEngine.play(this.getAudioPath(effName), isLoop, this._curEffectVolume);
    }

    /**
     * 暂停音效
     */
    public pauseEffect(): void {
        cc.audioEngine.pause(this._curEffectAudioID);
    }

    /**
     * 停止音效
     */
    public stopEffect(): void {
        cc.audioEngine.stop(this._curEffectAudioID);
        this._curEffectAudioID = -1;
    }

    /**
     * 设置音效音量
     */
    public setEffectVolume(volume: number): void {
        this._curEffectVolume = volume;
        if (this._curEffectAudioID < 0) {
            return;
        }
        cc.audioEngine.setVolume(this._curEffectAudioID, this._curEffectVolume);
    }
    //#endregion

    public get CurBgmName(): string {
        return this._curBgmName;
    }
}