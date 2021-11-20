import BufferPlayer from './bufferplayer.js'
import MidiHandler from './midihandler.js'

export default class Events {
    constructor(triangles, instrument, numberOfHorizontalTris) {
        this.triangles = triangles
        this.instrument = instrument
        this.numberOfHorizontalTris = numberOfHorizontalTris
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
        let isMouseDown
        let prevTriangleSerNum
        let currentTriangleSerNum

        let handleMouse = (e) => {
            e.preventDefault()
            currentTriangleSerNum = e.target.attributes['data-serNum'].value
            if (e.type === 'mousedown') isMouseDown = true
            if (e.type === 'mouseup' || e.type === 'mouseleave')
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

        let prevTriangles = []
        let currentTriangleSN
        let shapeType
        let x, y

        let handleTouch = (e) => {
            e.preventDefault()
            let currentTriangles = []
            let shape
            for (let touch of e.touches) {
                x = touch.clientX
                y = touch.clientY
                if (
                    x >= 0 ||
                    x < window.innerWidth ||
                    y >= 0 ||
                    y < window.innerHeight
                ) {
                    shape = document.elementFromPoint(
                        touch.clientX,
                        touch.clientY
                    )
                    currentTriangleSN = shape.attributes['data-serNum'].value
                    shapeType = shape.attributes['data-type'].value
                } else {
                    this.allOff()
                }
                if (
                    currentTriangleSN &&
                    shape.attributes['data-type'].value === 'hexagon'
                ) {
                    this.soundSwitch(true, currentTriangleSN)
                    let serNumOfTri = 0
                    for (serNumOfTri in prevTriangles) {
                        if (prevTriangles[serNumOfTri] === currentTriangleSN)
                            prevTriangles.splice(serNumOfTri, 1)
                    }
                    currentTriangles.push(currentTriangleSN)
                }
            }
            for (let serNumOfTri in prevTriangles) {
                this.soundSwitch(false, prevTriangles[serNumOfTri])
            }
            prevTriangles = currentTriangles
        }

        document.addEventListener('mouseleave', handleMouse)
        document.addEventListener('touchleave', handleTouch)

        this.triangles.forEach((triangle) => {
            triangle.hexagon.on(
                ['mousedown', 'mousemove', 'mouseup'],
                handleMouse,
                false
            )
            triangle.triangle.on(['mousedown', 'mouseup'], handleMouse, false)

            triangle.hexagon.on(
                ['touchstart', 'touchmove', 'touchend'],
                handleTouch,
                false
            )
            triangle.triangle.on(
                ['touchstart', 'touchmove', 'touchend'],
                handleTouch,
                false
            )
        })
    }
}
