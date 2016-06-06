﻿import { SoundEffectData } from "ts/Models/Sound/SoundEffectsModel";
import { Amplifier, AmplifierSettings } from "ts/Sound/Amplifier";

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

export class AudioWithAmplifier implements ISoundObject {
    private audioElement: HTMLAudioElement;
    private sourceNode: MediaElementAudioSourceNode;
    constructor(private source: string,
        private audioContext: AudioContext,
        private settings: AmplifierSettings = undefined,
        private loop: boolean = false) {

        this.audioElement = new Audio(this.source);
        this.audioElement.loop = loop;
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
    }

    play() {
        // connect effect
        if (this.settings !== undefined) {
            var amplifier = new Amplifier(this.audioContext, this.sourceNode, this.settings);
        }
        amplifier.reset();
        this.audioElement.play();
    }

    pause() {
        this.audioElement.pause();
    }
}


export class BufferObject implements ISoundObject {

    constructor(private actx: AudioContext,
        private buffer: AudioBuffer,
        private settings: AmplifierSettings = undefined,
        private loop:boolean = false) {
    }

    play() {
        //Create a sound node.
        var actx = this.actx;
        var sourceNode: AudioBufferSourceNode = actx.createBufferSource();

        //Set the sound node's buffer property to the loaded sound.
        sourceNode.buffer = this.buffer;
        sourceNode.loop = this.loop;
        if (this.settings !== undefined) {
            var amplifier = new Amplifier(actx, sourceNode, this.settings);
            amplifier.reset();
        } else {
            sourceNode.connect(actx.destination);
        }

        sourceNode.start(actx.currentTime);
    }

    pause() { }
}