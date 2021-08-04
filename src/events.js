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
    midi(onoff, pitch, serNumOfTri) {
        this.midiChannel = Math.floor(serNumOfTri / this.numberOfHorizontalTris)
        this.midiOutput.send([onoff + this.midiChannel, pitch, 127])
    }
    soundSwitch(onoff, pitch, serNumOfTri) {
        if (onoff == 1) {
            if (!this.sounds[pitch]) {
                this.sounds[pitch] = {}
                this.sounds[pitch][serNumOfTri] = false
            }
            if (!this.sounds[pitch][serNumOfTri]) {
                this.sounds[pitch][serNumOfTri] = true
                this.instrument == 'midi'
                    ? this.midi(144, pitch, serNumOfTri)
                    : this.player.play(pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOn()
            }
        }
        if (onoff == 0) {
            if (this.sounds[pitch]) {
                this.instrument == 'midi'
                    ? this.midi(128, pitch, serNumOfTri)
                    : this.player.stop(pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOff()
                this.sounds[pitch][serNumOfTri] = false
            }
        }
    }

    init() {
        let self = this
        let triangles = this.triangles
        let isMouseDown = false
        let previousTriangle = 0
        let currentTriangle
        canvas.addEventListener('mouseout', function (e) {
            if (previousTriangle) {
                self.soundSwitch(
                    0,
                    triangles[previousTriangle].getSound(),
                    previousTriangle
                )
                isMouseDown = false
            }
        })
        canvas.addEventListener('mousedown', function (e) {
            previousTriangle = getCurrentTriangle(e.clientX, e.clientY)
            self.soundSwitch(
                1,
                triangles[previousTriangle].getSound(),
                previousTriangle
            )
            isMouseDown = true
        })
        canvas.addEventListener('mousemove', function (e) {
            if (isMouseDown) {
                currentTriangle = getCurrentTriangle(e.clientX, e.clientY)
                if (currentTriangle != previousTriangle) {
                    self.soundSwitch(
                        0,
                        triangles[previousTriangle].getSound(),
                        previousTriangle
                    )
                    self.soundSwitch(
                        1,
                        triangles[currentTriangle].getSound(),
                        currentTriangle
                    )
                    previousTriangle = currentTriangle
                }
            }
        })
        canvas.addEventListener('mouseup', function (e) {
            self.soundSwitch(
                0,
                triangles[previousTriangle].getSound(),
                previousTriangle
            )
            previousTriangle = getCurrentTriangle(e.clientX, e.clientY)
            isMouseDown = false
        })

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
                        triangles[currentTriangleSerNum].getSound(),
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
                    triangles[oldTriangles[serNumOfTri]].getSound(),
                    oldTriangles[serNumOfTri]
                )
            }
            oldTriangles = newTriangles
        }

        function getCurrentTriangle(x, y) {
            let findIt = triangles.find(
                (triangle) => triangle.getCurrentTriangle(x, y) > -1
            )
            return findIt ? findIt.serNumOfTri : null
        }
    }
}
