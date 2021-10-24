export default class MidiHandler {
    static midiHandler
    static getMidiHandler(triangles, numberOfHorizontalTris) {
        if (!this.midiHandler)
            this.midiHandler = new MidiHandler(
                triangles,
                numberOfHorizontalTris
            )
        return this.midiHandler
    }

    constructor(triangles, numberOfHorizontalTris) {
        this.triangles = triangles
        this.numberOfHorizontalTris = numberOfHorizontalTris
        this.midiOutputs = []
        this.midiOutput = null
        this.midiChannel = 0
        if (navigator.requestMIDIAccess) this.midiOutInit()
    }

    midiOutInit = () => {
        navigator
            .requestMIDIAccess()
            .then((response) => {
                const outputs = response.outputs.values()
                for (const output of outputs) {
                    this.midiOutputs.push(output)
                }
                if (this.midiOutputs[0]) this.midiOutput = this.midiOutputs[0]
                console.log(
                    'event.js/Events connected:',
                    this.midiOutputs[0].type,
                    this.midiOutputs[0].name
                )
            })
            .catch((error) => console.warn(error))
    }

    midiOut = (onoff, serNumOfTri) => {
        let pitch = this.triangles[serNumOfTri].getSound()
        this.midiChannel = Math.floor(serNumOfTri / this.numberOfHorizontalTris)
        if (pitch < 128) {
            this.midiOutput.send([onoff + this.midiChannel, pitch, 127])
            console.log(
                'output:',
                this.midiOutput.name,
                '-',
                'midiEvent:',
                onoff.toString(16)[0],
                ' midiChannel:',
                this.midiChannel,
                ' midiKey:',
                pitch,
                'midiVelocity:',
                127
            )
        }
    }

    midiInInit = (self) => {
        let midiResponse = (response) => {
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
                self.play(midiKey, midiChannel, midiVelocity)
            } else {
                self.stop(midiKey, midiChannel)
            }
        }
        navigator
            .requestMIDIAccess()
            .then(midiResponse)
            .catch((error) => console.warn(error))
    }
}
