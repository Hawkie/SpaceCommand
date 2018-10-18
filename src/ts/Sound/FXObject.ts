import { SoundEffectData } from "ts/Models/SoundEffectsModel";
import { Amplifier, AmplifierSettings } from "ts/Sound/Amplifier";
import { IAudioObject } from "ts/Sound/SoundObject";

export class ControllerNode {
    constructor(public sourceNode: OscillatorNode,
        public amplifier: Amplifier) { }
}


export class FXObject implements IAudioObject {
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
        let actx = this.audioContext;
        let oscillators: ControllerNode[] = [];
        let sourceNode = this.createOscillator(this.audioContext,
            this.effect.type,
            this.effect.frequencyValue);
        let amplifier: Amplifier = new Amplifier(actx, sourceNode, this.ampSettings);
        oscillators.push(new ControllerNode(sourceNode, amplifier));

        if (this.effect.dissonance > 0) {
            let dOsc1 = this.createOscillator(this.audioContext,
                "sawtooth",
                this.effect.frequencyValue + this.effect.dissonance);
            let amplifier1: Amplifier = new Amplifier(actx, dOsc1, this.ampSettings);
            oscillators.push(new ControllerNode(dOsc1, amplifier1));
                
            let dOsc2 = this.createOscillator(this.audioContext,
                "sawtooth",
                this.effect.frequencyValue - this.effect.dissonance);
            let amplifier2: Amplifier = new Amplifier(actx, dOsc2, this.ampSettings);
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
        let actx = this.audioContext;
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
        type: OscillatorType,
        frequencyValue: number): OscillatorNode {
            // toDO fix var
        var actx = this.audioContext;
        let oscillator: OscillatorNode = actx.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = frequencyValue;
        return oscillator;
    }

    ////The `pitchBend` function
    private pitchBend(oscillatorNode: OscillatorNode, pitchUp: boolean, wait: number, pitchBendAmount: number, attack: number, decay: number) {
        let actx = this.audioContext;
        //If `reverse` is true, make the note drop in frequency. Useful for
        //shooting sounds

        //Get the frequency of the current oscillator
        let frequency = oscillatorNode.frequency.value;

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


