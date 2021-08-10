export default class Events {
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
        })
    }
    midi(onoff, serNumOfTri) {
        let pitch = this.triangles[serNumOfTri].getSound()
        this.midiChannel = Math.floor(serNumOfTri / this.numberOfHorizontalTris)
        console.log(pitch)
        this.midiOutput.send([onoff + this.midiChannel, pitch, 127])
    }
    soundSwitch(onoff, serNumOfTri) {
        let pitch = this.triangles[serNumOfTri].getSound()
        if (onoff == 1) {
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
        if (onoff == 0) {
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
                    1,
                    currentTriangleSerNum
                )
                if (prevTriangleSerNum == currentTriangleSerNum) {
                    prevTriangleSerNum = null
                }
            }
            if (prevTriangleSerNum) {
                self.soundSwitch(
                    0,
                    prevTriangleSerNum
                )
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
                        1,
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
                    0,
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
