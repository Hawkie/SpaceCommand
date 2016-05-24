import { SoundEffectData } from "ts/Models/Sound/SoundEffectsModel";
import { Amplifier, ControllerNodes } from "ts/Sound/Amplifier";

export interface ISoundObject {
    play();
    pause();
}

export class AudioObject implements ISoundObject {
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
    private gainNode: GainNode;
    constructor(private source: string,
        private audioContext: AudioContext,
        private amplifier: Amplifier,
        private effect: SoundEffectData,
        private loop: boolean = false) {

        this.audioElement = new Audio(this.source);
        this.audioElement.loop = loop;
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        
    }

    play() {
        // connect effect
        
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.effect.volumeValue;
        this.sourceNode.connect(this.gainNode);
        var controllerNodes:ControllerNodes[] = this.amplifier.addEffect(this.gainNode, this.effect);
        this.amplifier.reset(this.gainNode, this.effect.wait, this.effect.timeout, this.effect.volumeValue, this.effect.attack, this.effect.decay);
        this.audioElement.play();
        controllerNodes.forEach(n => this.amplifier.play(n.sourceNode,
            n.gainNode,
            this.effect.wait,
            this.effect.timeout,
            this.effect.volumeValue,
            this.effect.attack,
            this.effect.decay,
            this.effect.pitchBendAmount,
            this.effect.pitchBendUp));
    }
    pause() {
        this.audioElement.pause();
    }
}

export class FXObject implements ISoundObject {
    private sourceNode: OscillatorNode;
    private gainNode: GainNode;
    private effectNodes: ControllerNodes[];

    constructor(private audioContext: AudioContext,
        private amplifier: Amplifier,
        private effect: SoundEffectData) {
        
    }

    private createSource(actx: AudioContext,
        type: string,
        frequencyValue: number): OscillatorNode {
        var actx = this.audioContext;
        var oscillator: OscillatorNode = actx.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = frequencyValue;
        return oscillator;
    }

    play() {
        var actx = this.audioContext;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = this.effect.volumeValue;

        this.sourceNode = this.createSource(this.audioContext,
            this.effect.type,
            this.effect.frequencyValue);
        this.sourceNode.connect(this.gainNode);

        this.effectNodes = this.amplifier.addEffect(this.gainNode, this.effect);
        
        this.amplifier.play(this.sourceNode,
            this.gainNode,
            this.effect.wait,
            this.effect.timeout,
            this.effect.volumeValue,
            this.effect.attack,
            this.effect.decay,
            this.effect.pitchBendAmount,
            this.effect.pitchBendUp);
        this.effectNodes.forEach(n => this.amplifier.play(n.sourceNode,
            n.gainNode,
            this.effect.wait,
            this.effect.timeout,
            this.effect.volumeValue,
            this.effect.attack,
            this.effect.decay,
            this.effect.pitchBendAmount,
            this.effect.pitchBendUp));
    }

    
    pause() {
        this.sourceNode.stop(this.audioContext.currentTime);
        this.effectNodes.forEach(n => n.sourceNode.stop(this.audioContext.currentTime));
    }
}

export class BufferObject implements ISoundObject {

    constructor(private actx:AudioContext, private buffer: AudioBuffer) {
    }

    play() {
        //Create a sound node.
        var actx = this.actx;
        var soundNode: AudioBufferSourceNode = actx.createBufferSource();

        //Set the sound node's buffer property to the loaded sound.
        soundNode.buffer = this.buffer;
        
        var gainNode = actx.createGain();
        soundNode.connect(gainNode);
        gainNode.connect(actx.destination);
        soundNode.start(actx.currentTime);
    }

    pause() { }
}