export default class MidiHandler {
    static midiHandler
    static getMidiHandler() {
        if (!this.midiHandler) this.midiHandler = new MidiHandler()
        return this.midiHandler
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
