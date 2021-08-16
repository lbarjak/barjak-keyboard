export default class EventJS {
    constructor(triangles, player, instrument, numberOfHorizontalTris) {
        this.triangles = triangles
        this.player = player
        this.sounds = []
        this.instrument = instrument
        this.numberOfHorizontalTris = numberOfHorizontalTris
        this.midiOutputs = []
        this.midiOutput
        this.midiChannel
        this.init()
        this.midiInit()
    }

    midiInit() {
        let self = this
        navigator.requestMIDIAccess().then(function (response) {
            const outputs = response.outputs.values()
            for (const output of outputs) {
                self.midiOutputs.push(output)
            }
            if (self.midiOutputs[0]) self.midiOutput = self.midiOutputs[0]
            console.log('event.js/Events connected:', self.midiOutputs[0].type, self.midiOutputs[0].name)
        })
    }
    midi(onoff, serNumOfTri) {
        let pitch = this.triangles[serNumOfTri].getSound()
        this.midiChannel = Math.floor(serNumOfTri / this.numberOfHorizontalTris)
        this.midiOutput.send([onoff + this.midiChannel, pitch, 127])
        console.log(
            "output:",
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
    soundSwitch(onOff, serNumOfTri, allOff = false) {
        let pitch
        if (allOff && (this.sounds.length > 0)) {
            for (let serNumOfTri in this.triangles) {
                pitch = this.triangles[serNumOfTri].getSound()
                this.triangles[serNumOfTri].setSignOff()
                if (this.sounds[pitch]) {
                    this.instrument == 'midi'
                        ? this.midi(128, serNumOfTri)
                        : this.player.stop(pitch, serNumOfTri)
                    this.player.stop(pitch, serNumOfTri)
                }
                this.sounds = []
            }
        }
        pitch = this.triangles[serNumOfTri].getSound()
        if (onOff) {
            if (!this.sounds[pitch]) {
                this.sounds[pitch] = {}
                this.sounds[pitch][serNumOfTri] = false
            }
            if (!this.sounds[pitch][serNumOfTri]) {
                this.sounds[pitch][serNumOfTri] = true
                this.instrument == 'midi'
                    ? this.midi(144, serNumOfTri)
                    : this.player.play(pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOn()
            }
        }
        if (!onOff) {
            if (this.sounds[pitch]) {
                this.instrument == 'midi'
                    ? this.midi(128, serNumOfTri)
                    : this.player.stop(pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOff()
                this.sounds[pitch][serNumOfTri] = false
            }
        }
    }

    init() {
        const keyboard = document.getElementsByTagName('canvas')[0]

        window.addEventListener('orientationchange', function (e) {
            keyboard.removeEventListener('touchstart', handleTouch, false)
            keyboard.removeEventListener('touchmove', handleTouch, false)
            keyboard.removeEventListener('touchend', handleTouch, false)
            keyboard.removeEventListener('touchcancel', handleTouch, false)
            keyboard.removeEventListener('mouseout', handleMouse, false)
            keyboard.removeEventListener('mousedown', handleMouse, false)
            keyboard.removeEventListener('mousemove', handleMouse, false)
            keyboard.removeEventListener('mouseup', handleMouse, false)
        })

        let self = this
        keyboard.addEventListener('mouseout', handleMouse, false)
        keyboard.addEventListener('mousedown', handleMouse, false)
        keyboard.addEventListener('mousemove', handleMouse, false)
        keyboard.addEventListener('mouseup', handleMouse, false)
        let isMouseDown
        let prevTriangleSerNum
        let currentTriangleSerNum
        function handleMouse(e) {
            if (e.type == 'mousedown') isMouseDown = true
            if (e.type == 'mouseup' || e.type == 'mouseout') isMouseDown = false
            currentTriangleSerNum = getCurrentTriangle(e.clientX, e.clientY)
            if (currentTriangleSerNum && isMouseDown) {
                self.soundSwitch(
                    true,
                    currentTriangleSerNum
                )
                if (prevTriangleSerNum == currentTriangleSerNum) {
                    prevTriangleSerNum = null
                }
            }
            if (prevTriangleSerNum) {
                self.soundSwitch(
                    false,
                    prevTriangleSerNum
                )
                if (!isMouseDown) self.soundSwitch(false, 0, true)
            }
            prevTriangleSerNum = currentTriangleSerNum
        }

        keyboard.addEventListener('touchstart', handleTouch, false)
        keyboard.addEventListener('touchmove', handleTouch, false)
        keyboard.addEventListener('touchend', handleTouch, false)
        keyboard.addEventListener('touchcancel', handleTouch, false)
        let prevTriangles = []
        function handleTouch(e) {
            e.preventDefault()
            let currentTriangles = []
            for (let touch = 0; touch < e.touches.length; touch++) {
                let currentTriangleSerNum = getCurrentTriangle(
                    e.touches[touch].clientX,
                    e.touches[touch].clientY
                )
                if (currentTriangleSerNum) {
                    self.soundSwitch(
                        true,
                        currentTriangleSerNum
                    )
                    for (let serNumOfTri in prevTriangles) {
                        if (
                            prevTriangles[serNumOfTri] == currentTriangleSerNum
                        ) {
                            prevTriangles.splice(serNumOfTri, 1)
                        }
                    }
                    currentTriangles.push(currentTriangleSerNum)
                }
            }
            for (let serNumOfTri in prevTriangles) {
                self.soundSwitch(
                    false,
                    prevTriangles[serNumOfTri]
                )
            }
            prevTriangles = currentTriangles
        }

        function getCurrentTriangle(x, y) {
            let findIt = self.triangles.find(
                (triangle) => triangle.getCurrentTriangle(x, y) > -1
            )
            return findIt ? findIt.serNumOfTri : null
        }
    }
}
