import { Slider, ControlPanelModel } from "ts/Models/Controls/ControlPanelModel";
import { DynamicModel } from "ts/Models/DynamicModels";
import { AmplifierSettings } from "ts/Sound/Amplifier";

export class SoundEffectData {

    //public frequencyValue: number;      //The sound's fequency pitch in Hertz
    //public attack:number;              //The time, in seconds, to fade the sound in
    //public decay: number;               //The time, in seconds, to fade the sound out
    //public type: string;                //waveform type: "sine", "triangle", "square", "sawtooth"
    //public volumeValue: number;         //The sound's maximum volume
    //public panValue: number;            //The speaker pan. left: -1, middle: 0, right: 1
    //public wait: number;                //The time, in seconds, to wait before playing the sound
    //public pitchBendAmount: number;     //The number of Hz in which to bend the sound's pitch down
    //public reverse: boolean;            //If `reverse` is true the pitch will bend up
    //public randomValue: number;         //A range, in Hz, within which to randomize the pitch
    //public dissonance: number;          //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
    //public echo: number[];              //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
    //public reverb: number[];            //An array: [durationInSeconds, decayRateInSeconds, reverse]
    //public timeout: number;             // How long to play for

    constructor(public frequencyValue: number = 200,
        public attack: number = 0,
        public decay: number = 0,
        public type: string = "sine",
        public volumeValue: number = 1,
        public panValue: number = 0,
        public wait: number = 0,
        public pitchBendAmount: number = 0,
        public pitchBendUp = false,
        public dissonance: number = 0,
        public echo: number[] = undefined,
        public reverb: number[] = undefined,
        public timeout:number = undefined) {
    }
}

export enum SoundType {
    sine,
    triangle,
    square, 
    sawtooth, 
}

export class SoundEffectsModel extends ControlPanelModel {

    private typeNames: string[];

    sliders: Slider[]
    constructor() {
        var sliders = [new Slider("frequency(Hz)", 1046, 0, 10000, 10),
            new Slider("attack(sec)", 0, 0, 10, 0.05),
            new Slider("decay(sec)", 0.3, 0, 10, 0.05),
            new Slider("type", 3, 0, 3, 1), // "sine", "triangle", "square", "sawtooth"
            new Slider("volume", 1, 0, 1, 0.01),
            new Slider("pan", -0.8, -1, 1, 0.1),
            new Slider("wait(sec)", 0, 0, 10, 0.1),
            new Slider("pitchBend", 1200, 0, 10000, 200),
            new Slider("pitchBendUp", 0, 0, 1, 1),
            new Slider("dissonance(Hz)", 25, 0, 10000, 10),
            new Slider("echoDelay(sec)", 0.2, 0, 10, 0.05, true),
            new Slider("echoFeedback(sec)", 0.2, 0, 10, 0.05, true),
            new Slider("echo(Hz)", 2000, 0, 10000, 10, false),
            new Slider("reverbDuration(sec)", 0.1, 0, 10, 0.05, false),
            new Slider("reverbDecay(sec)", 0.1, 0, 10, 0.05, false),
            new Slider("reverbReverse", 0, 0, 1, 1, false),
            new Slider("timeout(sec)", 3, 0, 20, 0.05)];
        super(sliders);
        this.typeNames = ["sine", "triangle", "square", "sawtooth"];
    }

    get ampSettings(): AmplifierSettings {
        var echo = undefined;
        if (this.sliders[10].enabled) {
            echo = [this.sliders[10].value,
                this.sliders[11].value,
                this.sliders[12].value];
        }
        var reverb = undefined;
        if (this.sliders[13].enabled) {
            reverb = [this.sliders[13].value,
                this.sliders[14].value,
                this.sliders[15].value];
        }
        return new AmplifierSettings(this.sliders[1].value,
            this.sliders[2].value,
            this.sliders[4].value,
            this.sliders[5].value,
            this.sliders[6].value,
            (this.sliders[8].value === 1),
            echo,
            reverb);
    }

    get sfxData(): SoundEffectData {
        var sfxData = new SoundEffectData();
        sfxData.frequencyValue = this.sliders[0].value;
        sfxData.attack = this.sliders[1].value;
        sfxData.decay = this.sliders[2].value;
        // todo mapping to strings
        sfxData.type = this.typeNames[this.sliders[3].value];
        sfxData.volumeValue = this.sliders[4].value;
        sfxData.panValue = this.sliders[5].value;
        sfxData.wait = this.sliders[6].value;
        sfxData.pitchBendAmount = this.sliders[7].value;
        sfxData.pitchBendUp = (this.sliders[8].value === 1);
        
        sfxData.dissonance = this.sliders[9].value;
        if (this.sliders[10].enabled) {
            sfxData.echo = [this.sliders[10].value,
                this.sliders[11].value,
                this.sliders[12].value];
        } else {
            sfxData.echo = undefined;
        }
        if (this.sliders[13].enabled) {
            sfxData.reverb = [this.sliders[13].value,
                this.sliders[14].value,
                this.sliders[15].value];
        } else {
            sfxData.reverb = undefined;
        }
        sfxData.timeout = this.sliders[16].value;
        return sfxData;
    }
}