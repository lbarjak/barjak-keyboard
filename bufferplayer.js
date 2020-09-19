"use strict";

export default class BufferPlayer {

    static pianoMin = 12;
    static pianoMax = 96;
    static harpsichordMin = 24;
    static harpsichordMax = 74;
    static harpsichord2Min = 17;
    static harpsichord2Max = 76;
    static min = 0;
    static max = 0;
    static instrument = "piano";
    static startNote = BufferPlayer.pianoMin;
    static countOfSounds = 0;
    static loading = 0;

    constructor() {
        this.startNote = BufferPlayer.startNote;
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

        if (BufferPlayer.instrument == "piano") {
            BufferPlayer.min = BufferPlayer.pianoMin;
            BufferPlayer.max = BufferPlayer.pianoMax;
            this.initPiano();
        }
        if (BufferPlayer.instrument == "harpsichord") {
            BufferPlayer.min = BufferPlayer.harpsichordMin;
            BufferPlayer.max = BufferPlayer.harpsichordMax;
            this.initHarpsichord();
        }
        if (BufferPlayer.instrument == "harpsichord2") {
            BufferPlayer.min = BufferPlayer.harpsichord2Min;
            BufferPlayer.max = BufferPlayer.harpsichord2Max;
            this.initHarpsichord2();
        }

        this.midi();
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

    initPiano() {// 12 C1 - 96 C8
        for (let i = this.startNote; i <= BufferPlayer.pianoMax; i++) {
            this.loader("./piano/" + i + ".ogg", i);
        }
    }
    initHarpsichord() {// 24 C2 - 74 D6
        for (let i = this.startNote; i <= BufferPlayer.harpsichordMax; i++) {
            this.loader("./zell_1737_8_i/" + i + ".ogg", i);
        }
    }
    initHarpsichord2() {// 17 F1 - 76 E6
        for (let i = this.startNote; i <= BufferPlayer.harpsichord2Max; i++) {
            this.loader("./pjcohen/" + i + ".ogg", i);
        }
    }
    loader(fileName, i) {
        window.fetch(fileName)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                this.buffers[i] = audioBuffer;
                BufferPlayer.loading++;
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
            this.delay = 0.1 + (this.startNote + BufferPlayer.countOfSounds - note - 1) / 300;
            this.gains[note][sn].gain.setTargetAtTime(0, this.audioContext.currentTime, this.delay);
            this.channels[note][sn] = false;
        }
    }
}


