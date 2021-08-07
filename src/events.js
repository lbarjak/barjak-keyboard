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
        this.pitch
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
        this.pitch = this.triangles[serNumOfTri].getSound()
        this.midiChannel = Math.floor(serNumOfTri / this.numberOfHorizontalTris)
        this.midiOutput.send([onoff + this.midiChannel, this.pitch, 127])
    }
    soundSwitch(onoff, serNumOfTri) {
        this.pitch = this.triangles[serNumOfTri].getSound()
        if (onoff == 1) {
            if (!this.sounds[this.pitch]) {
                this.sounds[this.pitch] = {}
                this.sounds[this.pitch][serNumOfTri] = false
            }
            if (!this.sounds[this.pitch][serNumOfTri]) {
                this.sounds[this.pitch][serNumOfTri] = true
                this.instrument == 'midi'
                    ? this.midi(144, this.pitch, serNumOfTri)
                    : this.player.play(this.pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOn()
            }
        }
        if (onoff == 0) {
            if (this.sounds[this.pitch]) {
                this.instrument == 'midi'
                    ? this.midi(128, this.pitch, serNumOfTri)
                    : this.player.stop(this.pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOff()
                this.sounds[this.pitch][serNumOfTri] = false
            }
        }
    }

    init() {
        let self = this
        canvas.addEventListener('mouseout', handleMouse, false)
        canvas.addEventListener('mousedown', handleMouse, false)
        canvas.addEventListener('mousemove', handleMouse, false)
        canvas.addEventListener('mouseup', handleMouse, false)
        let isMouseDown
        let oldTriangleSerNum
        function handleMouse(e) {
            if (e.type == 'mousedown') isMouseDown = true
            if (e.type == 'mouseup' || e.type == 'mouseout') isMouseDown = false

            let currentTriangleSerNum = getCurrentTriangle(e.clientX, e.clientY)
            if (currentTriangleSerNum && isMouseDown) {
                self.soundSwitch(
                    1,
                    currentTriangleSerNum
                )
                if (oldTriangleSerNum == currentTriangleSerNum) {
                    oldTriangleSerNum = null
                }
            }
            if (oldTriangleSerNum) {
                self.soundSwitch(
                    0,
                    oldTriangleSerNum
                )
            }
            oldTriangleSerNum = currentTriangleSerNum
        }

        canvas.addEventListener('touchstart', handleTouch, false)
        canvas.addEventListener('touchmove', handleTouch, false)
        canvas.addEventListener('touchend', handleTouch, false)
        canvas.addEventListener('touchcancel', handleTouch, false)
        let oldTriangles = []
        function handleTouch(e) {
            e.preventDefault()
            let newTriangles = []
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
                    for (let serNumOfTri in oldTriangles) {
                        if (
                            oldTriangles[serNumOfTri] == currentTriangleSerNum
                        ) {
                            oldTriangles.splice(serNumOfTri, 1)
                        }
                    }
                    newTriangles.push(currentTriangleSerNum)
                }
            }
            for (let serNumOfTri in oldTriangles) {
                self.soundSwitch(
                    0,
                    oldTriangles[serNumOfTri]
                )
            }
            oldTriangles = newTriangles
        }

        function getCurrentTriangle(x, y) {
            let findIt = self.triangles.find(
                (triangle) => triangle.getCurrentTriangle(x, y) > -1
            )
            return findIt ? findIt.serNumOfTri : null
        }
    }
}
