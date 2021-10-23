export default class BufferPlayer {
    static instruments = {
        piano: { min: 24, max: 108, initInstrument: './piano/' }, //C1 - C8
        harpsichord: { min: 36, max: 86, initInstrument: './zell_1737_8_i/' }, //C2 - D6
        harpsichord2: { min: 29, max: 88, initInstrument: './pjcohen/' }, //F1 - E6
        midi: { min: 12, max: 127 } //C0 - G9
    }
    static player
    static getPlayer(selectedInst, selectedOctave) {
        if (!BufferPlayer.player)
            BufferPlayer.player = new BufferPlayer(selectedInst, selectedOctave)
        return BufferPlayer.player
    }

    constructor(instrument = 'piano', octave = 0) {
        this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext)()
        this.buffers = []
        this.channels = []
        this.gains = []
        this.delay = 0.0
        this.min = 12
        this.max = 127
        this.loading = 0
        this.instrument = instrument
        this.min = BufferPlayer.instruments[this.instrument].min + 12 * octave
        this.max = BufferPlayer.instruments[this.instrument].max
        if (this.instrument == 'midi') {
            this.loading = 116 - 12 * octave
        } else {
            this.initInstrument(
                BufferPlayer.instruments[this.instrument].initInstrument
            )
        }
        if (navigator.requestMIDIAccess) this.midiInit()
    }
    initInstrument = (path) => {
        for (let i = this.min; i <= this.max; i++) {
            fetch(path + i + '.mp3')
                .then((response) => response.arrayBuffer())
                .then((arrayBuffer) =>
                    this.audioContext.decodeAudioData(arrayBuffer)
                )
                .then((audioBuffer) => {
                    this.buffers[i] = audioBuffer
                    this.loading++
                })
                .catch((error) => {
                    console.warn(error)
                })
        }
    }

    play = (note, serNumOfTri, midiVelocity = 127) => {
        if (!this.channels[note]) {
            this.channels[note] = {}
            this.channels[note][serNumOfTri] = false
        }
        if (!this.channels[note][serNumOfTri]) {
            this.channels[note][serNumOfTri] =
                this.audioContext.createBufferSource()
            this.channels[note][serNumOfTri].buffer = this.buffers[note]
            if (!this.gains[note]) this.gains[note] = {}
            this.gains[note][serNumOfTri] = this.audioContext.createGain()
            this.gains[note][serNumOfTri].gain.setValueAtTime(
                (0.8 * midiVelocity) / 127,
                this.audioContext.currentTime
            )
            this.gains[note][serNumOfTri].connect(this.audioContext.destination)
            this.channels[note][serNumOfTri].connect(
                this.gains[note][serNumOfTri]
            )
            this.channels[note][serNumOfTri].start()
        }
    }
    stop = (note, serNumOfTri) => {
        if (this.gains[note][serNumOfTri]) {
            this.delay = 0.1 + (this.max - note - 2) / 300
            this.gains[note][serNumOfTri].gain.setTargetAtTime(
                0,
                this.audioContext.currentTime,
                this.delay
            )
            this.channels[note][serNumOfTri] = false
        }
    }

    midiInit = () => {
        let midi = (response) => {
            for (let inputPort of response.inputs.values()) {
                connect(inputPort)
            }
            response.onstatechange = midiOnStateChange
        }
        let midiOnStateChange = (event) => {
            if (
                event.port.type == 'input' &&
                event.port.state == 'connected' &&
                !event.port.onmidimessage
            ) {
                connect(event.port)
            }
        }
        let connect = (port) => {
            console.log('BufferPlayer connected:', port.type, port.name)
            port.onmidimessage = midiMessage
        }
        let midiStatusByte, midiEvent, midiChannel, midiKey, midiVelocity
        let midiMessage = (event) => {
            midiStatusByte = event.data[0].toString(16)
            midiEvent = midiStatusByte.substring(0, 1)
            midiChannel = midiStatusByte.substring(1)
            midiKey = event.data[1]
            midiVelocity = this.instrument == 'piano' ? event.data[2] : 127
            console.log(
                'input:',
                event.currentTarget.name,
                '-',
                'midiEvent:',
                midiEvent,
                ' midiChannel:',
                midiChannel,
                ' midiKey:',
                midiKey,
                'midiVelocity:',
                midiVelocity
            )
            if (midiEvent == '9') {
                this.play(midiKey, midiChannel, midiVelocity)
            } else {
                this.stop(midiKey, midiChannel)
            }
        }
        navigator
            .requestMIDIAccess()
            .then(midi)
            .catch((error) => console.warn(error))
    }
}
