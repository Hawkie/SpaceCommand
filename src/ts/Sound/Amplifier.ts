export class AmplifierSettings {
    
    constructor(public attack: number = 0,
        public decay: number = 0,
        public volumeValue: number = 1,
        public panValue: number = 0,
        public wait: number = 0,
        public reverbReverse = false,
        public echo: number[] = undefined,
        public reverb: number[] = undefined) { }
}

export class Amplifier {

    private gainNode: GainNode;

    constructor(private audioContext: AudioContext, source: AudioNode, private settings: AmplifierSettings) {
        var actx = this.audioContext;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.gain.value = settings.volumeValue;
        source.connect(this.gainNode);

        var panNode: AudioNode = this.createPanNode(actx, settings.panValue);
        panNode.connect(actx.destination);
        this.gainNode.connect(panNode);
        var endNode: AudioNode = panNode;

        if (settings.echo !== undefined) {
            var echoNode = this.createEcho(settings.echo);
            this.gainNode.connect(echoNode);
            echoNode.connect(endNode);
        }

        if (settings.reverb !== undefined) {
            this.addReverb(this.gainNode, settings.reverb, settings.reverbReverse, endNode);
        }
    }

    reset() {
        var actx = this.audioContext;
        if (this.settings.attack > 0) this.fadeIn(this.gainNode, this.settings.wait, this.settings.volumeValue, this.settings.attack);
        if (this.settings.decay > 0) this.fadeOut(this.gainNode, this.settings.volumeValue, this.settings.attack, this.settings.wait, this.settings.decay);
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