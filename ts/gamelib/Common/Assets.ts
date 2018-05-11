export class BufferData<TBuffer> {
    source: string;
    data: TBuffer;
}

export class Assets {

    // properties to help track the assets being loaded.
    private toLoad: number = 0;
    private loaded: number = 0;
    soundData: BufferData<AudioBuffer>[] = [];

    // file extensions for different types of sounds.
    audioExtensions: string[] = ["mp3", "ogg", "wav", "webm"];

    load(actx: AudioContext, sources: string[], whenAllLoaded: () => void): void {
        console.log("Loading sounds..");

        // get a reference to this asset object so we can
        // refer to it in the `forEach` loop ahead.
        var self = this;

        //Find the number of files that need to be loaded.
        self.toLoad = sources.length;
        sources.forEach((source) => {

            //Find the file extension of the asset.
            var extension = source.split('.').pop();

            //#### Sounds
            //Load audio files that have file extensions that match
            //the `audioExtensions` array.
            if (self.audioExtensions.indexOf(extension) !== -1) {

                //Create a sound sprite.
                self.loadSound(actx, source, self.loadHandler.bind(self), whenAllLoaded);
            }
            // display a message if the file type isn't recognized.
            else {
                console.log("File type not recognized: " + source);
            }
        });
    }

    // create and send request to load source with callback 
    loadSound(actx: AudioContext, source: string,
        dataHandler: (data: BufferData<AudioBuffer>, whenLoaded: () => void) => void,
        whenLoaded: () => void) {

        var xhr = new XMLHttpRequest();

        //Use xhr to load the sound file.
        xhr.open("GET", source, true);
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.responseType = "arraybuffer";

        //When the sound has finished loading, decode it using the
        //`decodeAudio` function (which you'll see ahead)
        xhr.addEventListener("load", this.decodeAudio(actx, xhr, (buffer: AudioBuffer) => {
            let sd = new BufferData<AudioBuffer>();
            sd.source = source;
            sd.data = buffer;
            this.soundData.push(sd);
            dataHandler(sd, whenLoaded);
        }));

        //Send the request to load the file.
        xhr.send();
    }


    //#### loadHandler
    //The `loadHandler` will be called each time an asset finishes loading.
    private loadHandler(data: BufferData<AudioBuffer>, whenLoaded: () => void) {
        var self = this;
        self.loaded += 1;
        console.log(data.source + self.loaded.toString());

        //Check whether everything has loaded.
        if (self.toLoad === self.loaded) {

            //If it has, run the callback function that was assigned to the `whenLoaded` property
            console.log("Sounds finished loading");

            //Reset `loaded` and `toLoaded` so we can load more assets
            //later if we want to.
            self.toLoad = 0;
            self.loaded = 0;
            if (whenLoaded !== undefined) whenLoaded();
        }
    }

//The `decodeAudio` function decodes the audio file for you and 
//launches the `loadHandler` when it's done
 decodeAudio(actx: AudioContext, xhr: XMLHttpRequest, dataHandler: (buffer: AudioBuffer) => void): EventListener {

     let success: DecodeSuccessCallback = (buffer: AudioBuffer) => {
         if (dataHandler) { dataHandler(buffer); }
     }
     let error: DecodeErrorCallback = () => { throw new Error("Audio could not be decoded: "); }
     //Decode the sound and store a reference to the buffer.
     return () => {
         actx.decodeAudioData(
             xhr.response,
             success,
             error);
     }
 }

}