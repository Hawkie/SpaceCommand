import { SoundEffectData } from "ts/Models/Sound/SoundEffectsModel";
//function fixSetTarget(param) {
//    if (!param)	// if NYI, just return
//        return;
//    if (!param.setTargetAtTime)
//        param.setTargetAtTime = param.setTargetValueAtTime;
//}

export class ControllerNodes {
    constructor(public gainNode: GainNode,
        public sourceNode: OscillatorNode) { }
}

export class Amplifier {

    constructor(private audioContext: AudioContext) {
    }

    play(node: OscillatorNode, gainNode:GainNode, wait: number, duration:number, volumeValue:number, attack:number, decay:number, pitchBendAmount:number, pitchDown:boolean) {
        var actx = this.audioContext;
        if (pitchBendAmount > 0) this.pitchBend(node, pitchDown, wait, pitchBendAmount, attack, decay);
        if (attack > 0) this.fadeIn(gainNode, wait, volumeValue, attack);
        if (decay > 0) this.fadeOut(gainNode, volumeValue, attack, wait, decay);
        node.start(actx.currentTime + wait);

        //Oscillators have to be stopped otherwise they accumulate in 
        //memory and tax the CPU. They'll be stopped after a default
        //timeout of 2 seconds, which should be enough for most sound 
        //effects. Override this in the `soundEffect` parameters if you
        //need a longer sound
        node.stop(actx.currentTime + wait + duration);
    }


    addEffect(gainNode:GainNode, data: SoundEffectData): ControllerNodes[] {
        var actx = this.audioContext;
        var controllerNodes: ControllerNodes[] = [];

        var panNode: AudioNode = this.createPanNode(actx, data.panValue);
        panNode.connect(actx.destination);
        gainNode.connect(panNode);
        var endNode: AudioNode = panNode;

        if (data.echo !== undefined) {
            var echoNode = this.createEcho(data.echo);
            this.insertNode(gainNode, echoNode, endNode);
        }

        if (data.reverb !== undefined) {
            this.addReverb(gainNode, data.reverb, data.pitchBendUp, endNode);
        }
        if (data.dissonance > 0) {
            controllerNodes = this.addDissonance(data.volumeValue,
                data.frequencyValue,
                data.dissonance,
                data.attack,
                data.decay,
                data.pitchBendAmount,
                data.echo,
                data.reverb,
                data.wait,
                data.pitchBendUp,
                endNode);
        }

        return controllerNodes;
    }

    createPanNode(actx:AudioContext, panValue:number): AudioNode {
        // Pan
        var stereoPan: StereoPannerNode,
            Panner: PannerNode,
            pan: any;
        if (!actx.createStereoPanner) {
            pan = actx.createPanner();
        } else {
            pan = actx.createStereoPanner();
        }
        if (!actx.createStereoPanner) {
            pan.setPosition(panValue, 0, 1 - Math.abs(panValue));
        } else {
            pan.pan.value = panValue;
        }

        return pan;
    }

    addReverb(startNode: AudioNode, reverb: number[], reverse: boolean, pan:AudioNode) {
        var actx = this.audioContext;
        var convolver = actx.createConvolver();
        convolver.buffer = this.impulseResponse(reverb[0], reverb[1], reverse, actx);
        startNode.connect(convolver);
        convolver.connect(pan);
    }

    createEcho(echo: number[]) : AudioNode {
        var actx = this.audioContext;
        //Create the nodes
        var feedback = actx.createGain(),
            delay = actx.createDelay(),
            filter = actx.createBiquadFilter();

        //Set their values (delay time, feedback time and filter frequency)
        delay.delayTime.value = echo[0];
        feedback.gain.value = echo[1];
        if (echo[2]) filter.frequency.value = echo[2];

        //Create the delay feedback loop, with
        //optional filtering
        delay.connect(feedback);
        if (echo[2]) {
            feedback.connect(filter);
            filter.connect(delay);
        } else {
            feedback.connect(delay);
        }

        return delay;
    }

    //The `fadeIn` function
    fadeIn(volumeNode: GainNode, wait: number, volumeValue: number, attack: number) {
        var actx = this.audioContext;
        //Set the volume to 0 so that you can fade
        //in from silence
        volumeNode.gain.value = 0;

        volumeNode.gain.linearRampToValueAtTime(
            0, actx.currentTime + wait
        );
        volumeNode.gain.linearRampToValueAtTime(
            volumeValue, actx.currentTime + wait + attack
        );
    }

    ////The `fadeOut` function
    fadeOut(volumeNode: GainNode, volumeValue: number, attack: number, wait: number, decay:number) {
        var actx = this.audioContext;
        volumeNode.gain.linearRampToValueAtTime(
            volumeValue, actx.currentTime + attack + wait
        );
        volumeNode.gain.linearRampToValueAtTime(
            0, actx.currentTime + wait + attack + decay
        );
    }

    ////The `pitchBend` function
    pitchBend(oscillatorNode: OscillatorNode, pitchUp: boolean, wait: number, pitchBendAmount: number, attack: number, decay: number) {
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

    addDissonance(volumeValue: number,
        frequency: number,
        dissonance: number,
        attack: number,
        decay: number,
        pitchBendAmount: number,
        echo: number[],
        reverb: number[],
        wait: number,
        reverse: boolean,
        pan: AudioNode): ControllerNodes[]{
        var actx = this.audioContext;
        //Create two more oscillators and gain nodes
        var d1: OscillatorNode = actx.createOscillator(),
            d2: OscillatorNode = actx.createOscillator(),
            d1Volume = actx.createGain(),
            d2Volume = actx.createGain();

        //Set the volume to the `volumeValue`
        d1Volume.gain.value = volumeValue;
        d2Volume.gain.value = volumeValue;

        //Connect the oscillators to the gain and destination nodes
        d1.connect(d1Volume);
        d1Volume.connect(actx.destination);
        d2.connect(d2Volume);
        d2Volume.connect(actx.destination);

        //Set the waveform to "sawtooth" for a harsh effect
        d1.type = "sawtooth";
        d2.type = "sawtooth";

        //Make the two oscillators play at frequencies above and
        //below the main sound's frequency. Use whatever value was
        //supplied by the `dissonance` argument
        d1.frequency.value = frequency + dissonance;
        d2.frequency.value = frequency - dissonance;

        ////Fade in/out, pitch bend and play the oscillators
        ////to match the main sound
        //if (attack > 0) {
        //    this.fadeIn(d1Volume, wait, volumeValue, attack);
        //    this.fadeIn(d2Volume, wait, volumeValue, attack);
        //}
        //if (decay > 0) {
        //    this.fadeOut(d1Volume, volumeValue, attack, wait, decay);
        //    this.fadeOut(d2Volume, volumeValue, attack, wait, decay);
        //}
        //if (pitchBendAmount > 0) {
        //    this.pitchBend(d1, reverse, wait, pitchBendAmount, attack, decay);
        //    this.pitchBend(d2, reverse, wait, pitchBendAmount, attack, decay);
        //}
        if (echo) {
            var echoNode1:AudioNode = this.createEcho(echo);
            this.insertNode(d1Volume, echoNode1, pan);
            var echoNode2:AudioNode = this.createEcho(echo);
            this.insertNode(d2Volume, echoNode2, pan);
        }
        if (reverb) {
            this.addReverb(d1Volume, reverb, reverse, pan);
            this.addReverb(d2Volume, reverb, reverse, pan);
        }
        return [new ControllerNodes(d1Volume, d1), new ControllerNodes(d2Volume, d2)];
    }

    insertNode(nodeIn: AudioNode, node: AudioNode, nodeOut: AudioNode) {
        //Connect the delay loop to the oscillator's volume
        //node, and then to the destination
        nodeIn.connect(node);

        //Connect the delay loop to the main sound chain's
        //pan node, so that the echo effect is directed to
        //the correct speaker
        node.connect(nodeOut);
    }


    /*
    impulseResponse
    ---------------
    
    The `makeSound` and `soundEffect` functions uses `impulseResponse`  to help create an optional reverb effect.  
    It simulates a model of sound reverberation in an acoustic space which 
    a convolver node can blend with the source sound. Make sure to include this function along with `makeSound`
    and `soundEffect` if you need to use the reverb feature.
    */

    impulseResponse(duration:number, decay: number, reverse: boolean, actx: AudioContext) :AudioBuffer {

        //The length of the buffer.
        // TODO check you can do this with audio buffered data?!
        var length = actx.sampleRate * duration;

        //Create an audio buffer (an empty sound container) to store the reverb effect.
        var impulse = actx.createBuffer(2, length, actx.sampleRate);

        //Use `getChannelData` to initialize empty arrays to store sound data for
        //the left and right channels.
        var left = impulse.getChannelData(0),
            right = impulse.getChannelData(1);

        //Loop through each sample-frame and fill the channel
        //data with random noise.
        for (var i = 0; i < length; i++) {

            //Apply the reverse effect, if `reverse` is `true`.
            var n;
            if (reverse) {
                n = length - i;
            } else {
                n = i;
            }

            //Fill the left and right channels with random white noise which
            //decays exponentially.
            left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
            right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
        }

        //Return the `impulse`.
        return impulse;
    }
}


//export class AudioContext {
//    constructor(window) {
//        if (window.hasOwnProperty('webkitAudioContext') &&
//            !window.hasOwnProperty('AudioContext')) {
//            window.AudioContext = window.webkitAudioContext;
//        }
//        if (window.hasOwnProperty('webkitOfflineAudioContext') &&
//            !window.hasOwnProperty('OfflineAudioContext')) {
//            window.OfflineAudioContext = window.webkitOfflineAudioContext;
//        }
//    }


//}

//if (window.hasOwnProperty('webkitAudioContext') &&
//    !window.hasOwnProperty('AudioContext')) {
//    window.AudioContext = webkitAudioContext;

//    if (!AudioContext.prototype.hasOwnProperty('createGain'))
//        AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
//    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
//        AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
//    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
//        AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
//    if (!AudioContext.prototype.hasOwnProperty('createPeriodicWave'))
//        AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;


//    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
//    AudioContext.prototype.createGain = function () {
//        var node = this.internal_createGain();
//        fixSetTarget(node.gain);
//        return node;
//    };

//    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
//    AudioContext.prototype.createDelay = function (maxDelayTime) {
//        var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
//        fixSetTarget(node.delayTime);
//        return node;
//    };

//    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
//    AudioContext.prototype.createBufferSource = function () {
//        var node = this.internal_createBufferSource();
//        if (!node.start) {
//            node.start = function (when, offset, duration) {
//                if (offset || duration)
//                    this.noteGrainOn(when || 0, offset, duration);
//                else
//                    this.noteOn(when || 0);
//            };
//        } else {
//            node.internal_start = node.start;
//            node.start = function (when, offset, duration) {
//                if (typeof duration !== 'undefined')
//                    node.internal_start(when || 0, offset, duration);
//                else
//                    node.internal_start(when || 0, offset || 0);
//            };
//        }
//        if (!node.stop) {
//            node.stop = function (when) {
//                this.noteOff(when || 0);
//            };
//        } else {
//            node.internal_stop = node.stop;
//            node.stop = function (when) {
//                node.internal_stop(when || 0);
//            };
//        }
//        fixSetTarget(node.playbackRate);
//        return node;
//    };

//    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
//    AudioContext.prototype.createDynamicsCompressor = function () {
//        var node = this.internal_createDynamicsCompressor();
//        fixSetTarget(node.threshold);
//        fixSetTarget(node.knee);
//        fixSetTarget(node.ratio);
//        fixSetTarget(node.reduction);
//        fixSetTarget(node.attack);
//        fixSetTarget(node.release);
//        return node;
//    };

//    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
//    AudioContext.prototype.createBiquadFilter = function () {
//        var node = this.internal_createBiquadFilter();
//        fixSetTarget(node.frequency);
//        fixSetTarget(node.detune);
//        fixSetTarget(node.Q);
//        fixSetTarget(node.gain);
//        return node;
//    };

//    if (AudioContext.prototype.hasOwnProperty('createOscillator')) {
//        AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
//        AudioContext.prototype.createOscillator = function () {
//            var node = this.internal_createOscillator();
//            if (!node.start) {
//                node.start = function (when) {
//                    this.noteOn(when || 0);
//                };
//            } else {
//                node.internal_start = node.start;
//                node.start = function (when) {
//                    node.internal_start(when || 0);
//                };
//            }
//            if (!node.stop) {
//                node.stop = function (when) {
//                    this.noteOff(when || 0);
//                };
//            } else {
//                node.internal_stop = node.stop;
//                node.stop = function (when) {
//                    node.internal_stop(when || 0);
//                };
//            }
//            if (!node.setPeriodicWave)
//                node.setPeriodicWave = node.setWaveTable;
//            fixSetTarget(node.frequency);
//            fixSetTarget(node.detune);
//            return node;
//        };
//    }
//}

//if (window.hasOwnProperty('webkitOfflineAudioContext') &&
//    !window.hasOwnProperty('OfflineAudioContext')) {
//    window.OfflineAudioContext = webkitOfflineAudioContext;
//}

//}(window));