import { IActor } from "./Actor";
import { AudioObject, IAudioObject } from "ts/Sound/SoundObject";

export interface ISoundInputs {
    play: boolean;
}

export class Sound implements IActor {
    private audioObject: AudioObject = null;
    private reset: boolean = true;
    constructor(private filename: string,
        private multiPlay: boolean,
        private loop: boolean,
        private getInputs:() => ISoundInputs,
        private whenPlayed: ()=>void = ()=>null) {
        this.audioObject= new AudioObject(this.filename, this.loop);
    }

    update(timeModifier: number): void {
        let inputs:ISoundInputs = this.getInputs();
        if (this.multiPlay) {
            if (inputs.play) {
                if (this.reset === true) {
                    let newAudio: IAudioObject = new AudioObject(this.filename, this.loop);
                    newAudio.play();
                    this.reset = false;
                    this.whenPlayed();
                }
            } else {
                this.reset = true;
            }
        } else {
            if (inputs.play) {
                // play only once while on
                if (this.reset === true) {
                    this.audioObject.play();
                    this.whenPlayed();
                }
            } else {
                this.audioObject.pause();
                this.reset = true;
            }
        }
    }
}