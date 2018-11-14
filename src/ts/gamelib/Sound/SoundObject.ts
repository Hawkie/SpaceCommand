export interface IAudioObject {
    ready: boolean;
    play(): void;
    pause(): void;
}

export class AudioObject implements IAudioObject {
    private audioElement: HTMLAudioElement;
    private r: boolean = false;
    get ready(): boolean { return this.r; }

    constructor(private source: string,
        private loop: boolean = false) {
        this.audioElement = new Audio(this.source);
        this.audioElement.oncanplay = (ev: Event) => {this.r = true;};
        this.audioElement.loop = this.loop;
    }

    play(): void {
        if (this.ready) {
            this.audioElement.play();
        }
    }

    pause(): void {
        if (this.ready) {
            this.audioElement.pause();
        }
    }


}