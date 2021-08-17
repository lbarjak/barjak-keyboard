import EventsJS from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'
export default class IndexJS {
    constructor() {
        this.keyboard = document.getElementsByTagName('canvas')[0]
        this.player = null
        this.selectedInst = "piano"
        this.selectedValue = 6
        this.drawTriangles = null
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
        let self = this
        window.ctx = this.keyboard.getContext('2d')
        this.keyboard.width = window.innerWidth
        this.keyboard.height = window.innerHeight
        ctx.fillStyle = '#4d4d4d'
        ctx.fillRect(0, 0, this.keyboard.width, this.keyboard.height)
        //no right click
        this.keyboard.oncontextmenu = function (e) {
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
            ; (function timer() {
                ctx.fillStyle = '#4d4d4d'
                ctx.fillRect(0, 0, self.keyboard.width, self.keyboard.height)
                message =
                    'Loading sounds ' +
                    self.player.loading +
                    ' out of ' +
                    (self.player.max - self.player.min + 1) +
                    '...'
                ctx.fillStyle = 'white'
                ctx.fillText(message, self.keyboard.width * 0.5, self.keyboard.height * 0.3)
                t = setTimeout(timer, 10)
                if (self.player.loading == self.player.max - self.player.min + 1) {
                    clearTimeout(t)
                    self.kbd()
                }
            })()
    }

    kbd() {
        //let self = this
        //self.keyboard.style.display = "block"
        let triangles = this.drawTriangles.drawTriangles()
        new EventsJS(
            triangles,
            this.player,
            this.selectedInst,
            this.drawTriangles.numberOfHorizontalTris
        )
        document.addEventListener('keydown', logKey);
        function logKey(e) {
            if (e.key === "Escape") {
                console.log(e.key)
                //self.keyboard.style.display = "none"
                const form = document.createElement('form')
                form.method = "GET"
                form.action = location.href
                document.body.appendChild(form)
                form.submit()
            }
        }
    }
}
