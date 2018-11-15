import { IAudioObject } from "../../../gamelib/Sound/SoundObject";

export interface IMenuSound {
    musicFilename: string;
    playing: boolean;
}


export function stateToAudio(audio: IAudioObject, playing: boolean): boolean {
    if (audio.ready) {
        if (!playing) {
            audio.play();
        }
        return true;
    }
    return false;
}

// pure function that returns new sound
export function reduceSound<TState>(timeModifier: number, sound: TState, playing: boolean): TState {
    return Object.assign({}, sound, {
        playing: playing,
    });
}