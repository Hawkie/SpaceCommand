import { SoundEffectData } from "ts/Models/Sound/SoundEffectsModel";
//function fixSetTarget(param) {
//    if (!param)	// if NYI, just return
//        return;
//    if (!param.setTargetAtTime)
//        param.setTargetAtTime = param.setTargetValueAtTime;
//}

export class SoundPlayer {

    constructor(private audioContext: AudioContext) {
    }

    playWithEffect(source) {
        var actx = this.audioContext;
        var audioElement = new Audio(source);
        var sourceNode: MediaElementAudioSourceNode = actx.createMediaElementSource(audioElement);
        var gainNode: GainNode = actx.createGain();
        gainNode.gain.value = 1;
        sourceNode.connect(gainNode);
        gainNode.connect(actx.destination);
        audioElement.play();
    }

    private createSourceBuffer() {
        var actx = this.audioContext;
        var node: AudioBufferSourceNode = actx.createBufferSource();
        
    }

    private createSourceOscillator() {
        var actx = this.audioContext;
        var node: OscillatorNode = actx.createOscillator();
    }

    private createSourceMedia(source) {
        var actx = this.audioContext;
        var node: MediaElementAudioSourceNode = actx.createMediaElementSource(source);
        
    }

    playBuffer(volumeNode: GainNode) {
        var actx = this.audioContext;
        //var volumeNode = actx.createGain();

        //Create the pan node using the efficient `createStereoPanner`
        //method, if it's available.
        var panNode;
        if (!actx.createStereoPanner) {
            panNode = actx.createPanner();
        } else {
            panNode = actx.createStereoPanner();
        }
        //delayNode = actx.createDelay();
        //feedbackNode = actx.createGain();
        //o.filterNode = actx.createBiquadFilter();
        var convolverNode = actx.createConvolver();
        //o.soundNode = null;
        //o.buffer = null;
        //o.source = source;
        var loop = true;
        var playing = false;

        //The function that should run when the sound is loaded.
        //o.loadHandler = undefined;

        //Values for the `pan` and `volume` getters/setters.
        //o.panValue = 0;
        var volumeValue = 1;

        //Values to help track and set the start and pause times.
        var startTime = 0;
        var startOffset = 0;

        //Set the playback rate.
        var playbackRate = 1;

        //Echo properties.
        //o.echo = false;
        //o.delayValue = 0.3;
        //o.feebackValue = 0.3;
        //o.filterValue = 0;

        ////Reverb properties
        //o.reverb = false;
        //o.reverbImpulse = null;
  
        //The sound object's methods.
        //o.play = function () {

        //Set the start time (it will be `0` when the sound
        //first starts.
        startTime = actx.currentTime;

        //Create a sound node.
        //o.soundNode = actx.createBufferSource();

        //Set the sound node's buffer property to the loaded sound.
        //o.soundNode.buffer = o.buffer;


        //Set the playback rate
        //soundNode.playbackRate.value = playbackRate;

        //Connect the sound to the pan, connect the pan to the
        //volume, and connect the volume to the destination.
        //soundNode.connect(volumeNode);

        //If there's no reverb, bypass the convolverNode
        //if (o.reverb === false) {
            volumeNode.connect(panNode);
        //} 

        //If there is reverb, connect the `convolverNode` and apply
        //the impulse response
        //else {
        //    o.volumeNode.connect(o.convolverNode);
        //    o.convolverNode.connect(o.panNode);
        //    o.convolverNode.buffer = o.reverbImpulse;
        //}
    
        //Connect the `panNode` to the destination to complete the chain.
        panNode.connect(actx.destination);

        //Add optional echo.
        //if (o.echo) {

        //    //Set the values.
        //    o.feedbackNode.gain.value = o.feebackValue;
        //    o.delayNode.delayTime.value = o.delayValue;
        //    o.filterNode.frequency.value = o.filterValue;

        //    //Create the delay loop, with optional filtering.
        //    o.delayNode.connect(o.feedbackNode);
        //    if (o.filterValue > 0) {
        //        o.feedbackNode.connect(o.filterNode);
        //        o.filterNode.connect(o.delayNode);
        //    } else {
        //        o.feedbackNode.connect(o.delayNode);
        //    }

        //    //Capture the sound from the main node chain, send it to the
        //    //delay loop, and send the final echo effect to the `panNode` which
        //    //will then route it to the destination.
        //    o.volumeNode.connect(o.delayNode);
        //    o.delayNode.connect(o.panNode);
        //}

        //Will the sound loop? This can be `true` or `false`.
        //soundNode.loop = loop;

        //Finally, use the `start` method to play the sound.
        //The start time will either be `0`,
        //or a later time if the sound was paused.
        //soundNode.start(
        //    0, startOffset % soundNode.buffer.duration
        //);

        //Set `playing` to `true` to help control the
        //`pause` and `restart` methods.
        playing = true;
    
    }

    playWithData(data: SoundEffectData) {
        this.playEffect(data.frequencyValue,
            data.attack,
            data.decay,
            data.type,
            data.volumeValue,
            data.panValue,
            data.wait,
            data.pitchBendAmount,
            data.reverse,
            data.randomValue,
            data.dissonance,
            data.echo,
            data.reverb,
            data.timeout);
    }

    playEffect(frequencyValue: number,      //The sound's fequency pitch in Hertz
        attack: number,              //The time, in seconds, to fade the sound in
        decay: number,               //The time, in seconds, to fade the sound out
        type: string,                //waveform type: "sine", "triangle", "square", "sawtooth"
        volumeValue: number,         //The sound's maximum volume
        panValue: number,            //The speaker pan. left: -1, middle: 0, right: 1
        wait: number,                //The time, in seconds, to wait before playing the sound
        pitchBendAmount: number,     //The number of Hz in which to bend the sound's pitch down
        reverse: boolean,             //If `reverse` is true the pitch will bend up
        randomValue: number,         //A range, in Hz, within which to randomize the pitch
        dissonance: number,          //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
        echo: number[],                //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
        reverb: number[],              //An array: [durationInSeconds, decayRateInSeconds, reverse]
        timeout: number) {              //A number, in seconds, which is the maximum duration for sound effects) {

        var actx = this.audioContext;
        //Set the default values
        if (frequencyValue === undefined) frequencyValue = 200;
        if (attack === undefined) attack = 0;
        if (decay === undefined) decay = 1;
        if (type === undefined) type = "sine";
        if (volumeValue === undefined) volumeValue = 1;
        if (panValue === undefined) panValue = 0;
        if (wait === undefined) wait = 0;
        if (pitchBendAmount === undefined) pitchBendAmount = 0;
        if (reverse === undefined) reverse = false;
        if (randomValue === undefined) randomValue = 0;
        if (dissonance === undefined) dissonance = 0;
        if (echo === undefined) echo = undefined;
        if (reverb === undefined) reverb = undefined;
        if (timeout === undefined) timeout = undefined;

        //Create an oscillator, gain and pan nodes, and connect them
        //together to the destination
        var oscillator: OscillatorNode,
            volume: GainNode,
            stereoPan: StereoPannerNode,
            Panner: PannerNode,
            pan: any;
        
        oscillator = actx.createOscillator();
        oscillator.type = type;
        volume = actx.createGain();
        if (!actx.createStereoPanner) {
            pan = actx.createPanner();
        } else {
            pan = actx.createStereoPanner();
        }
        oscillator.connect(volume);
        volume.connect(pan);
        pan.connect(actx.destination);

        //Set the supplied values
        volume.gain.value = volumeValue;
        if (!actx.createStereoPanner) {
            pan.setPosition(panValue, 0, 1 - Math.abs(panValue));
        } else {
            pan.pan.value = panValue;
        }
        

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

        //Apply effects
        if (attack > 0) this.fadeIn(volume, wait, volumeValue, attack);
        this.fadeOut(volume, volumeValue, attack, wait, decay);
        if (pitchBendAmount > 0) this.pitchBend(oscillator, reverse, wait, pitchBendAmount, attack, decay);
        if (echo) this.addEcho(volume, echo, pan);
        if (reverb) this.addReverb(volume, reverb, reverse, pan);
        if (dissonance > 0) this.addDissonance(volumeValue, frequency, dissonance, attack, decay, pitchBendAmount, echo, reverb, wait, reverse, pan);

        //Play the sound
        this.play(oscillator, wait);
    }

    addReverb(volumeNode: GainNode, reverb: number[], reverse: boolean, pan) {
        var actx = this.audioContext;
        var convolver = actx.createConvolver();
        convolver.buffer = this.impulseResponse(reverb[0], reverb[1], reverse, actx);
        volumeNode.connect(convolver);
        convolver.connect(pan);
    }

    addEcho(volumeNode: GainNode, echo: number[], pan) {
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

        //Connect the delay loop to the oscillator's volume
        //node, and then to the destination
        volumeNode.connect(delay);

        //Connect the delay loop to the main sound chain's
        //pan node, so that the echo effect is directed to
        //the correct speaker
        delay.connect(pan);
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

    //The `fadeOut` function
    fadeOut(volumeNode: GainNode, volumeValue: number, attack: number, wait: number, decay:number) {
        var actx = this.audioContext;
        volumeNode.gain.linearRampToValueAtTime(
            volumeValue, actx.currentTime + attack + wait
        );
        volumeNode.gain.linearRampToValueAtTime(
            0, actx.currentTime + wait + attack + decay
        );
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

    addDissonance(volumeValue: number, frequency: number, dissonance: number, attack: number, decay: number, pitchBendAmount: number, echo: number[], reverb: number[], wait: number, reverse: boolean, pan:any) {
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

        //Fade in/out, pitch bend and play the oscillators
        //to match the main sound
        if (attack > 0) {
            this.fadeIn(d1Volume, wait, volumeValue, attack);
            this.fadeIn(d2Volume, wait, volumeValue, attack);
        }
        if (decay > 0) {
            this.fadeOut(d1Volume, volumeValue, attack, wait, decay);
            this.fadeOut(d2Volume, volumeValue, attack, wait, decay);
        }
        if (pitchBendAmount > 0) {
            this.pitchBend(d1, reverse, wait, pitchBendAmount, attack, decay);
            this.pitchBend(d2, reverse, wait, pitchBendAmount, attack, decay);
        }
        if (echo) {
            this.addEcho(d1Volume, echo, pan);
            this.addEcho(d2Volume, echo, pan);
        }
        if (reverb) {
            this.addReverb(d1Volume, reverb, reverse, pan);
            this.addReverb(d2Volume, reverb, reverse, pan);
        }
        this.play(d1, wait);
        this.play(d2, wait);
    }

    //The `play` function
    play(node: OscillatorNode, wait) {
        var actx = this.audioContext;
        node.start(actx.currentTime + wait);

        //Oscillators have to be stopped otherwise they accumulate in 
        //memory and tax the CPU. They'll be stopped after a default
        //timeout of 2 seconds, which should be enough for most sound 
        //effects. Override this in the `soundEffect` parameters if you
        //need a longer sound
        node.stop(actx.currentTime + wait + 2);
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