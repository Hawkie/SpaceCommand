import { IActor } from "./Actor";
import { AudioObject } from "../Sound/SoundObject";



export interface ISoundInputs {
    play: boolean;
}

export class Sound implements IActor {
    private audioObject: AudioObject = null;
    private playing: boolean = false;
    constructor(private filename: string, private getInputs:() => ISoundInputs) {
        this.audioObject= new AudioObject(filename);
    }

    update(timeModifier: number): void {
        var inputs:ISoundInputs = this.getInputs();
        if (inputs.play) {
            if (this.playing === false) {
                this.audioObject.play();
                this.playing = true;
            }
        } else {
            this.audioObject.pause();
            this.playing = false;
        }
    }
}