import { Sound } from "ts/Sound/AudioContext";

export class SoundContext {

    actx: AudioContext;
    sound: Sound;

    constructor() {
        this.actx = new AudioContext();
        this.sound = new Sound(this.actx);
    }

    playLaser() {
        this.sound.playEffect(
            1046.5,           //frequency
            0,                //attack
            0.3,              //decay
            "sawtooth",       //waveform
            1,                //Volume
            -0.8,             //pan
            0,                //wait before playing
            1200,             //pitch bend amount
            false,            //reverse bend
            0,                //random pitch range
            25,               //dissonance
            [0.2, 0.2, 2000], //echo: [delay, feedback, filter]
            undefined,        //reverb: [duration, decay, reverse?]
            3                 //Maximum duration of sound, in seconds
        );
    }

    playThrust() {
        this.sound.playEffect(
            50,          //frequency
            0.01,           //attack
            0.01,           //decay
            "sawtooth",  //waveform
            0.3,           //volume
            0.1,           //pan
            0,           //wait before playing
            500,           //pitch bend amount
            true,       //reverse
            10,           //random pitch range
            150,          //dissonance
            undefined,   //echo array: [delay, feedback, filter]
            undefined,   //reverb array: [duration, decay, reverse?]
            0.05
        );
    }

    playExplosion() {
        this.sound.playEffect(
            16,          //frequency
            0,           //attack
            1,           //decay
            "sawtooth",  //waveform
            1,           //volume
            0,           //pan
            0,           //wait before playing
            0,           //pitch bend amount
            false,       //reverse
            0,           //random pitch range
            50,          //dissonance
            [0, 0.2, 1000],   //echo array: [delay, feedback, filter]
            undefined,   //reverb array: [duration, decay, reverse?]
            0.1
        );
    }

}