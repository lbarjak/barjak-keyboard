import EventJS from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'
export default class IndexJS {
    constructor() {
        this.player
        this.selectedInst
        this.selectedValue
        this.drawTriangles
        this.menu()
    }
    menu() {
        const btn = document.querySelector('#btn')
        self = this
        btn.onclick = function () {
            const inst = document.querySelectorAll('input[name="instrument"]')
            for (const ins of inst) {
                if (ins.checked) {
                    self.selectedInst = ins.value
                    break
                }
            }
            const rbs = document.querySelectorAll('input[name="rows"]')
            for (const rb of rbs) {
                if (rb.checked) {
                    self.selectedValue = rb.value
                    break
                }
            }
            self.player = BufferPlayer.getInstance(self.selectedInst)
            self.drawTriangles = new DrawTriangles(
                self.selectedInst,
                self.selectedValue,
                self.player
            )
            self.load()
        }
    }

    load() {
        const keyboard = document.getElementsByTagName('canvas')[0]
        window.ctx = keyboard.getContext('2d')
        keyboard.width = window.innerWidth
        keyboard.height = window.innerHeight
        ctx.fillStyle = '#4d4d4d'
        ctx.fillRect(0, 0, keyboard.width, keyboard.height)
        //no right click
        keyboard.oncontextmenu = function (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        //no dragging
        document.onselectstart = function () {
            return false
        }
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        let t
        let message
        let self = this
            ; (function timer() {
                ctx.fillStyle = '#4d4d4d'
                ctx.fillRect(0, 0, keyboard.width, keyboard.height)
                message =
                    'Loading sounds ' +
                    self.player.loading +
                    ' out of ' +
                    (self.player.max - self.player.min + 1) +
                    '...'
                ctx.fillStyle = 'white'
                ctx.fillText(message, keyboard.width * 0.5, keyboard.height * 0.3)
                t = setTimeout(timer, 10)
                if (self.player.loading == self.player.max - self.player.min + 1) {
                    clearTimeout(t)
                    self.keyboard()
                }
            })()
    }

    keyboard() {
        let triangles = this.drawTriangles.drawTriangles()
        new EventJS(
            triangles,
            this.player,
            this.selectedInst,
            this.drawTriangles.numberOfHorizontalTris
        )
    }
}
