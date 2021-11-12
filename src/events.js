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
        this.rect = drawing.getElementsByTagName('rect')[0].instance
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
        // let isMouseDown
        // let prevTriangleSerNum
        // let handleMouse = (e, currentTriangleSerNum = 0) => {
        //     if (e.type === 'mousedown') isMouseDown = true
        //     if (e.type === 'mouseup' || e.type === 'mouseleave')
        //         isMouseDown = false
        //     if (currentTriangleSerNum && isMouseDown) {
        //         this.soundSwitch(true, currentTriangleSerNum)
        //         if (prevTriangleSerNum === currentTriangleSerNum)
        //             prevTriangleSerNum = null
        //     }
        //     if (prevTriangleSerNum && this.sounds.length > 0) {
        //         this.soundSwitch(false, prevTriangleSerNum)
        //         if (!isMouseDown) this.allOff()
        //     }
        //     prevTriangleSerNum = currentTriangleSerNum
        // }
        // document.addEventListener('mouseleave', handleMouse)
        // this.triangles.forEach((triangle) =>
        //     triangle.poly.on(['mousedown', 'mousemove', 'mouseup'], (e) =>
        //         handleMouse(e, triangle.serNumOfTri)
        //     )
        // )

        let currentTriangleSN
        let type
        let soundControl = () => {
            console.log(currentTriangleSN)
            console.log(type)
        }
        window.addEventListener('touchmove', (e) => {
            //console.log(e.touches[0].clientX, e.touches[0].clientY, e)
            this.triangles.forEach((triangle) => {
                if (
                    triangle.isPointInShape(
                        e.touches[0].clientX,
                        e.touches[0].clientY
                    )
                ) {
                    console.log(triangle.serNumOfTri)
                }
            })
        })
        let handleTouch = (e) => {
            if (e.touches.length) {
                for (let touch of e.touches) {
                    currentTriangleSN = touch.target.attributes[1].value
                    type = e.type
                }
            } else {
                currentTriangleSN = e.target.attributes[1].value
                type = e.type
            }
            soundControl()
        }
        this.triangles.forEach((triangle) =>
            triangle.poly.on(['touchstart', 'touchend', 'touchcancel'], (e) =>
                handleTouch(e)
            )
        )
    }
}
