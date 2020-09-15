"use strict"

export default class MidiIn {

    constructor() {
        this.init();
    }

    init() {
        function midiOnStateChange(event) {
            console.log('midiOnStateChange', event);
        }
        function midiOnMIDImessage(event) {
            //console.log('midiOnMIDImessage', event);
            console.log(event.data);
        }
        function requestMIDIAccessSuccess(midi) {
            var inputs = midi.inputs.values();
            for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                console.log('midi input', input);
                input.value.onmidimessage = midiOnMIDImessage;
            }
            midi.onstatechange = midiOnStateChange;
        }
        navigator.requestMIDIAccess().then(requestMIDIAccessSuccess);
    }
}
