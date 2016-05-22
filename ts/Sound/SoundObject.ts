export interface ISoundObject {
    play();
    pause();
}

export class SoundObject implements ISoundObject {
    audioElement: HTMLAudioElement;

    constructor(private source: string, private loop: boolean) {
        this.audioElement = new Audio(this.source);
    }

    play() {
        this.audioElement.loop = this.loop;
        this.audioElement.play();
    }

    pause() {
        this.audioElement.pause();
    }
}

export class FXObject {
}