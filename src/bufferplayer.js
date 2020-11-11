"use strict";

export default class BufferPlayer {

    constructor(instrument = "piano") {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext ||
            window.mozAudioContext || window.oAudioContext || window.msAudioContext);
        this.buffers = [];
        this.channels = [];
        this.gains = [];
        this.delay;
        this.min = 12;
        this.max = 119;
        this.loading = 0;
        this.instrument = instrument;

        if (this.instrument == "piano") {//midi 24 C1 - 108 C8
            this.min = 24;
            this.max = 108;
            this.initInstrument("./piano/");
        }
        if (this.instrument == "harpsichord") {//midi 36 C2 - 86 D6
            this.min = 36;
            this.max = 86;
            this.initInstrument("./zell_1737_8_i/");
        }
        if (this.instrument == "harpsichord2") {//midi 29 F1 - 88 E6
            this.min = 29;
            this.max = 88;
            this.initInstrument("./pjcohen/");
        }
        if (this.instrument == "midi") {
            this.loading = 108;
        }

        //this.midiInit();
    }
    initInstrument(name) {
        for (let i = this.min; i <= this.max; i++) {
            window.fetch(name + i + ".ogg")
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    this.buffers[i] = audioBuffer;
                    this.loading++;
                });
        }
    }

    play(note, serNumOfTri) {
        if (!this.channels[note]) {
            this.channels[note] = {};
            this.channels[note][serNumOfTri] = false;
        }
        if (!this.channels[note][serNumOfTri]) {
            this.channels[note][serNumOfTri] = this.audioContext.createBufferSource();
            this.channels[note][serNumOfTri].buffer = this.buffers[note];
            if (!this.gains[note])
                this.gains[note] = {};
            this.gains[note][serNumOfTri] = this.audioContext.createGain();
            this.gains[note][serNumOfTri].gain.setValueAtTime(0.8, this.audioContext.currentTime);
            this.gains[note][serNumOfTri].connect(this.audioContext.destination);
            this.channels[note][serNumOfTri].connect(this.gains[note][serNumOfTri]);
            this.channels[note][serNumOfTri].start();
        }
    }
    stop(note, serNumOfTri) {
        if (this.gains[note][serNumOfTri]) {
            this.delay = 0.1 + (this.max - note - 2) / 300;
            this.gains[note][serNumOfTri].gain.setTargetAtTime(0, this.audioContext.currentTime, this.delay);
            this.channels[note][serNumOfTri] = false;
        }
    }

    midiInit() {
        function midi(response) {
            for (let inputPort of response.inputs.values()) {
                connect(inputPort);
            }
            response.onstatechange = midiOnStateChange;
        }
        function midiOnStateChange(event) {
            if (event.port.type == "input" && event.port.state == "connected" && !event.port.onmidimessage) {
                connect(event.port);
            }
        }

        function connect(port) {
            console.log("connected:", port.type, port.name);
            port.onmidimessage = midiMessage;
        }
        let self = this;
        let midiStatusByte, midiEvent, midiChannel, midiKey, midiVelocity;
        function midiMessage(event) {
            midiStatusByte = event.data[0].toString(16);
            midiEvent = midiStatusByte.substring(0, 1);
            midiChannel = midiStatusByte.substring(1);
            midiKey = event.data[1];
            midiVelocity = event.data[2];
            console.log(event.currentTarget.name, "-", "midiEvent:", midiEvent, " midiChannel:", midiChannel, " midiKey:", midiKey);
            if (midiEvent == "9") {
                self.play(midiKey, midiChannel);
            } else {
                self.stop(midiKey, midiChannel);
            }
        }

        navigator.requestMIDIAccess().then(midi);
    }
}


