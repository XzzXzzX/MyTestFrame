const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioUtils {
    // properties: {

    private static _instance: AudioUtils = null;

    public static getInstance(): AudioUtils
    {
        if (null == this._instance)
        {
            this._instance = new AudioUtils();
            // this._instance.init();
        }
        return this._instance;
    }


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }

    playClick()
    {
        // cc.audioEngine.play(this.click, false, 1);
    }

    playSwap()
    {
        // cc.audioEngine.play(this.swap, false, 1);
    }

    playEliminate(step)
    {
        // step = Math.min(this.eliminate.length - 1, step);
        // cc.audioEngine.play(this.eliminate[step], false, 1);
    }

    playContinuousMatch(step)
    {
        console.log("step = ", step);
        return;
        step = Math.min(step, 11);
        if(step < 2){
            return 
        }
        cc.audioEngine.play(this.continuousMatch[Math.floor(step/2) - 1], false, 1);
    }

}
