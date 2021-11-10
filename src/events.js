import BufferPlayer from './bufferplayer.js'
import MidiHandler from './midihandler.js'

export default class Events {
    constructor(triangles, instrument, numberOfHorizontalTris) {
        ;[this.triangles, this.instrument, this.numberOfHorizontalTris] = [
            triangles,
            instrument,
            numberOfHorizontalTris
        ]
        let drawing = document.getElementById('svgs')
        this.drawing = drawing.getElementsByTagName('svg')[0].instance
        this.player = BufferPlayer.getPlayer()
        this.sounds = []
        this.midi = MidiHandler.getMidiHandler(
            this.numberOfHorizontalTris
        ).midiOut
        this.init()
    }

    soundSwitch = (onOff, serNumOfTri) => {
        let pitch
        pitch = this.triangles[serNumOfTri].getSound()
        if (onOff) {
            if (!this.sounds[pitch]) {
                this.sounds[pitch] = {}
                this.sounds[pitch][serNumOfTri] = false
            }
            if (!this.sounds[pitch][serNumOfTri]) {
                this.sounds[pitch][serNumOfTri] = true
                this.instrument === 'midi'
                    ? this.midi(144, pitch, serNumOfTri)
                    : this.player.play(pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOn()
            }
        }
        if (!onOff) {
            if (this.sounds[pitch]) {
                this.instrument === 'midi'
                    ? this.midi(128, pitch, serNumOfTri)
                    : this.player.stop(pitch, serNumOfTri)
                this.triangles[serNumOfTri].setSignOff()
                this.sounds[pitch][serNumOfTri] = false
            }
        }
    }

    allOff = () => {
        if (this.sounds.length) {
            let pitch
            for (
                let serNumOfTri = 0;
                serNumOfTri < this.triangles.length;
                serNumOfTri++
            ) {
                pitch = this.triangles[serNumOfTri].getSound()
                this.triangles[serNumOfTri].setSignOff()
                if (this.sounds[pitch]) {
                    this.instrument === 'midi'
                        ? this.midi(128, pitch, serNumOfTri)
                        : this.player.stop(pitch, serNumOfTri)
                    this.player.stop(pitch, serNumOfTri)
                }
                this.sounds = []
            }
        }
    }

    init = () => {
        const musicalKeyboard = document.getElementsByTagName('canvas')[0]
        let isMouseDown
        let prevTriangleSerNum
        //let currentTriangleSerNum
        let handleMouse = (e, currentTriangleSerNum) => {
            console.log(
                'handleMouse',
                currentTriangleSerNum,
                e.type,
                isMouseDown
            )
            if (e.type === 'mousedown') isMouseDown = true
            if (e.type === 'mouseup' || e.type === 'mouseout')
                isMouseDown = false
            if (currentTriangleSerNum && isMouseDown) {
                this.soundSwitch(true, currentTriangleSerNum)
                if (prevTriangleSerNum === currentTriangleSerNum)
                    prevTriangleSerNum = null
            }
            if (prevTriangleSerNum && this.sounds.length > 0) {
                this.soundSwitch(false, prevTriangleSerNum)
                if (!isMouseDown) this.allOff()
            }
            prevTriangleSerNum = currentTriangleSerNum
        }

        this.triangles.forEach((triangle) =>
            triangle.poly.on(
                ['mousedown', 'mousemove', 'mouseup'], //mouseout
                (e) => handleMouse(e, triangle.serNumOfTri)
            )
        )

        let prevTriangles = []
        let handleTouch = (e) => {
            e.preventDefault()
            let currentTriangles = []
            for (let touch in e.touches) {
                currentTriangleSerNum = getCurrentTriangle(
                    e.touches[touch].clientX,
                    e.touches[touch].clientY
                )
                if (currentTriangleSerNum) {
                    this.soundSwitch(true, currentTriangleSerNum)
                    let serNumOfTri = 0
                    for (serNumOfTri in prevTriangles) {
                        if (
                            prevTriangles[serNumOfTri] === currentTriangleSerNum
                        )
                            prevTriangles.splice(serNumOfTri, 1)
                    }
                    currentTriangles.push(currentTriangleSerNum)
                }
            }
            for (let serNumOfTri in prevTriangles) {
                this.soundSwitch(false, prevTriangles[serNumOfTri])
            }
            prevTriangles = currentTriangles
        }
        'touchstart touchmove touchend touchcancel'
            .split(' ')
            .forEach((e) =>
                musicalKeyboard.addEventListener(e, handleTouch, false)
            )

        let getCurrentTriangle = (x, y) => {
            let findIt = this.triangles.find(
                (triangle) => triangle.getCurrentTriangle(x, y) > -1
            )
            return findIt ? findIt.serNumOfTri : null
        }
    }
}
