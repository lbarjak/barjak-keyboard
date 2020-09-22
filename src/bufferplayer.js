"use strict";

export default class BufferPlayer {

    constructor(instrument = "piano") {
        this.audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext);
        this.audioContext.resume();
        this.buffers = [];
        this.channels = [];
        this.gains = [];
        this.delay;
        this.pianoMin = 12;
        this.pianoMax = 96;
        this.harpsichordMin = 24;
        this.harpsichordMax = 74;
        this.harpsichord2Min = 17;
        this.harpsichord2Max = 76;
        this.min = 0;
        this.max = 107;
        this.loading = 0;
        this.instrument = instrument;

        if (this.instrument == "piano") {
            this.min = this.pianoMin;
            this.max = this.pianoMax;
            this.initPiano();
        }
        if (this.instrument == "harpsichord") {
            this.min = this.harpsichordMin;
            this.max = this.harpsichordMax;
            this.initHarpsichord();
        }
        if (this.instrument == "harpsichord2") {
            this.min = this.harpsichord2Min;
            this.max = this.harpsichord2Max;
            this.initHarpsichord2();
        }
        if (this.instrument == "midi") {
            this.loading = 108;
        }

        //this.midi();
    }

    initPiano() {// 12 C1 - 96 C8
        for (let i = this.min; i <= this.max; i++) {
            this.loader("./piano/" + i + ".ogg", i);
        }
    }
    initHarpsichord() {// 24 C2 - 74 D6
        for (let i = this.min; i <= this.max; i++) {
            this.loader("./zell_1737_8_i/" + i + ".ogg", i);
        }
    }
    initHarpsichord2() {// 17 F1 - 76 E6
        for (let i = this.min; i <= this.max; i++) {
            this.loader("./pjcohen/" + i + ".ogg", i);
        }
    }
    loader(fileName, i) {
        window.fetch(fileName)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.buffers[i] = audioBuffer;
                this.loading++;
            });
    }

    play(note, sn) {
        if (!this.channels[note]) {
            this.channels[note] = {};
            this.channels[note][sn] = false;
        }
        if (!this.channels[note][sn]) {
            this.channels[note][sn] = this.audioContext.createBufferSource();
            this.channels[note][sn].buffer = this.buffers[note];
            if (!this.gains[note])
                this.gains[note] = {};
            this.gains[note][sn] = this.audioContext.createGain();
            this.gains[note][sn].gain.setValueAtTime(0.8, this.audioContext.currentTime);
            this.gains[note][sn].connect(this.audioContext.destination);
            this.channels[note][sn].connect(this.gains[note][sn]);
            this.channels[note][sn].start();
        }
    }
    stop(note, sn) {
        if (this.gains[note][sn]) {
            this.delay = 0.1 + (this.max - this.min - note + 12 - 2 - 1) / 300;
            this.gains[note][sn].gain.setTargetAtTime(0, this.audioContext.currentTime, this.delay);
            this.channels[note][sn] = false;
        }
    }

    midi() {
        function requestMIDIAccessSuccess(midi) {
            var inputs = midi.inputs.values();
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                console.log('1. midi input', input.value.name);
                input.value.onmidimessage = midiOnMIDImessage;
            }
            midi.onstatechange = midiOnStateChange;
        }
        function midiOnStateChange(event) {
            console.log('2. midiOnStateChange', event.port.name);
        }
        let self = this;
        let midiStatusByte, midiEvent, midiChannel, midiKey, midiVelocity;
        function midiOnMIDImessage(event) {
            midiStatusByte = event.data[0].toString(16);
            midiEvent = midiStatusByte.substring(0, 1);
            midiChannel = midiStatusByte.substring(1);
            midiKey = event.data[1];
            midiVelocity = event.data[2];
            console.log("3.", midiStatusByte, midiEvent, midiChannel, midiKey, midiVelocity);
            if (midiEvent == "9") {
                self.play(midiKey - 12, midiChannel);
            } else {
                self.stop(midiKey - 12, midiChannel);
            }
        }
        navigator.requestMIDIAccess().then(requestMIDIAccessSuccess);
    }
}


