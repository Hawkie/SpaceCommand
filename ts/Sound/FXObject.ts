import { SoundEffectData } from "ts/Models/Sound/SoundEffectsModel";
import { Amplifier, AmplifierSettings } from "ts/Sound/Amplifier";
import { ISoundObject } from "ts/Sound/SoundObject";

export class ControllerNode {
    constructor(public sourceNode: OscillatorNode,
        public amplifier: Amplifier) { }
}


export class FXObject implements ISoundObject {
    private ampSettings: AmplifierSettings;
    constructor(private audioContext: AudioContext,
        private effect: SoundEffectData) {
        this.ampSettings = new AmplifierSettings(effect.attack,
            effect.decay,
            effect.volumeValue,
            effect.panValue,
            effect.wait,
            effect.pitchBendUp,
            effect.echo,
            effect.reverb);
    }

    play() {
        var actx = this.audioContext;
        var oscillators: ControllerNode[] = [];
        var sourceNode = this.createOscillator(this.audioContext,
            this.effect.type,
            this.effect.frequencyValue);
        var amplifier: Amplifier = new Amplifier(actx, sourceNode, this.ampSettings);
        oscillators.push(new ControllerNode(sourceNode, amplifier));

        if (this.effect.dissonance > 0) {
            var dOsc1 = this.createOscillator(this.audioContext,
                "sawtooth",
                this.effect.frequencyValue + this.effect.dissonance);
            var amplifier1: Amplifier = new Amplifier(actx, dOsc1, this.ampSettings);
            oscillators.push(new ControllerNode(dOsc1, amplifier1));
                
            var dOsc2 = this.createOscillator(this.audioContext,
                "sawtooth",
                this.effect.frequencyValue - this.effect.dissonance);
            var amplifier2: Amplifier = new Amplifier(actx, dOsc2, this.ampSettings);
            oscillators.push(new ControllerNode(dOsc2, amplifier2));
                 
        }

        oscillators.forEach(n => this.playOscillator(n.sourceNode,
            n.amplifier,
            this.effect.wait,
            this.effect.timeout,
            this.effect.volumeValue,
            this.effect.attack,
            this.effect.decay,
            this.effect.pitchBendAmount,
            this.effect.pitchBendUp));
    }

    // can't pause!
    pause() {
        //this.oscillators.forEach(n => n.sourceNode.stop(this.audioContext.currentTime));
    }

    private playOscillator(node: OscillatorNode, amplifier: Amplifier, wait: number, duration: number, volumeValue: number, attack: number, decay: number, pitchBendAmount: number, pitchDown: boolean) {
        var actx = this.audioContext;
        amplifier.reset();
        if (pitchBendAmount > 0) this.pitchBend(node, pitchDown, wait, pitchBendAmount, attack, decay);

        node.start(actx.currentTime + wait);

        //Oscillators have to be stopped otherwise they accumulate in 
        //memory and tax the CPU. They'll be stopped after a default
        //timeout of 2 seconds, which should be enough for most sound 
        //effects. Override this in the `soundEffect` parameters if you
        //need a longer sound
        node.stop(actx.currentTime + wait + duration);
    }



    private createOscillator(actx: AudioContext,
        type: string,
        frequencyValue: number): OscillatorNode {
        var actx = this.audioContext;
        var oscillator: OscillatorNode = actx.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = frequencyValue;
        return oscillator;
    }

    ////The `pitchBend` function
    private pitchBend(oscillatorNode: OscillatorNode, pitchUp: boolean, wait: number, pitchBendAmount: number, attack: number, decay: number) {
        var actx = this.audioContext;
        //If `reverse` is true, make the note drop in frequency. Useful for
        //shooting sounds

        //Get the frequency of the current oscillator
        var frequency = oscillatorNode.frequency.value;

        //If `pitchUp` is false, make the sound drop in pitch
        if (!pitchUp) {
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency,
                actx.currentTime + wait
            );
            oscillatorNode.frequency.linearRampToValueAtTime(
                frequency - pitchBendAmount,
                actx.currentTime + wait + attack + decay
            );
        }

        //If `pitchUp` is true, make the note rise in pitch. Useful for
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
}


