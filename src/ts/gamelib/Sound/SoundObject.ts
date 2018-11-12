
export interface IAudioObject {
    play(): void;
    pause(): void;
}

export class AudioObject implements IAudioObject {
    private audioElement: HTMLAudioElement;

    constructor(private source: string,
        private loop: boolean = false) {
        this.audioElement = new Audio(this.source);
        this.audioElement.loop = this.loop;
    }

    play(): void {
        this.audioElement.play();
    }

    pause(): void {
        this.audioElement.pause();
    }


}