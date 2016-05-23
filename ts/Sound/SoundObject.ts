import { SoundEffectData } from "ts/Models/Sound/SoundEffectsModel";
import { SoundPlayer } from "ts/Sound/SoundPlayer";

export interface ISoundObject {
    play();
    pause();
}

export class SoundObject implements ISoundObject {
    private audioElement: HTMLAudioElement;

    constructor(private source: string,
        private loop: boolean = false) {
        this.audioElement = new Audio(this.source);
        this.audioElement.loop = this.loop;
    }

    play() {
        this.audioElement.play();
    }

    pause() {
        this.audioElement.pause();
    }
}

export class AudioWithEffects implements ISoundObject {
    private audioElement: HTMLAudioElement;
    private sourceNode: MediaElementAudioSourceNode;
    constructor(private source: string,
        private audioContext: AudioContext,
        private soundPlayer: SoundPlayer,
        private effect: SoundEffectData,
        private loop: boolean = false) {

        this.audioElement = new Audio(this.source);
        this.audioElement.loop = loop;
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);

        // connect effect
        //var effectNode = this.player.createEffect(this.effect);
        //sourceNode.connect(effectNode);
    }

    play() {
        // connect effect
        var effectNode = this.soundPlayer.createEffect(this.effect);
        this.sourceNode.connect(effectNode);
        this.audioElement.play();
    }
    pause() {
        this.audioElement.pause();
    }
}

export class FXObject implements ISoundObject {
    private sourceNode: OscillatorNode;
    private adjFrequency: number;
    constructor(private audioContext: AudioContext,
        private player: SoundPlayer,
        private effect: SoundEffectData) {
        //private type: string,
        //private randomValue: number,
        //private frequencyValue:number) {
        // source
        
    }

    private createSource(actx: AudioContext,
        type: string = "sine",
        randomValue: number= 0,
        frequencyValue: number = 200,
        wait:number = 0,
        pitchBendAmount: number = 0,
        pitchDown: boolean = false,
        attack: number = 0,
        decay:number = 1): OscillatorNode {
        var actx = this.audioContext;
        this.sourceNode = actx.createOscillator();
        var oscillator: OscillatorNode = this.sourceNode;
        oscillator.type = type;
        //Optionally randomize the pitch. If the `randomValue` is greater
        //than zero, a random pitch is selected that's within the range
        //specified by `frequencyValue`. The random pitch will be either
        //above or below the target frequency.
        var frequency;
        var randomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min
        };
        if (randomValue > 0) {
            frequency = randomInt(
                frequencyValue - randomValue / 2,
                frequencyValue + randomValue / 2
            );
        } else {
            frequency = frequencyValue;
        }
        oscillator.frequency.value = frequency;
        this.adjFrequency = frequency;
        // add pitchbend
        if (pitchBendAmount > 0) this.pitchBend(oscillator, pitchDown, wait, pitchBendAmount, attack, decay);
        return oscillator;
    }

    //The `pitchBend` function
    pitchBend(oscillatorNode: OscillatorNode, reverse: boolean, wait: number, pitchBendAmount: number, attack: number, decay: number) {
        var actx = this.audioContext;
        //If `reverse` is true, make the note drop in frequency. Useful for
        //shooting sounds

        //Get the frequency of the current oscillator
        var frequency = oscillatorNode.frequency.value;

        //If `reverse` is true, make the sound drop in pitch
        if (!reverse) {
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency,
                actx.currentTime + wait
            );
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency - pitchBendAmount,
                actx.currentTime + wait + attack + decay
            );
        }

        //If `reverse` is false, make the note rise in pitch. Useful for
        //jumping sounds
        else {
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency,
                actx.currentTime + wait
            );
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency + pitchBendAmount,
                actx.currentTime + wait + attack + decay
            );
        }
    }

    play(wait:number = 0, duration:number = 2) {
        var actx = this.audioContext;
        this.sourceNode = this.createSource(actx,
            this.effect.type,
            this.effect.randomValue,
            this.effect.frequencyValue,
            this.effect.wait,
            this.effect.pitchBendAmount,
            this.effect.reverse,
            this.effect.attack,
            this.effect.decay);
        // update data with source random frequency for dissonance
        this.effect.frequencyValue = this.adjFrequency;
        var effectNode = this.player.createEffect(this.effect);
        this.sourceNode.connect(effectNode);
        this.sourceNode.start(actx.currentTime + wait);

        //Oscillators have to be stopped otherwise they accumulate in 
        //memory and tax the CPU. They'll be stopped after a default
        //timeout of 2 seconds, which should be enough for most sound 
        //effects. Override this in the `soundEffect` parameters if you
        //need a longer sound
        this.sourceNode.stop(actx.currentTime + wait + duration);
    }

    pause() {
        this.sourceNode.stop(this.audioContext.currentTime);
    }
}

// buffer object
//playSound(buffer: AudioBuffer) {
//    //Create a sound node.
//    var actx = this.actx;
//    var soundNode: AudioBufferSourceNode = actx.createBufferSource();

//    //Set the sound node's buffer property to the loaded sound.
//    soundNode.buffer = buffer;
//    //this.sound.playBuffer(soundNode);
//}