import Events from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'
export default class Index {
    constructor() {
        this.keyboard = document.getElementsByTagName('canvas')[0]
        this.page1 = document.getElementById("page1")
        this.player = null
        this.selectedInst = "piano"
        this.selectedValue = 6
        this.drawTriangles = null
        this.numberOfVerticalTrisMax = 16
        this.menu()
    }

    precalc(instrument) {  
        let numberOfVerticalTrisMax = 16
        let numberOfHorizontalTris = numberOfHorizontalTrisF()
        let countOfPitches = countOfPitchesF()
        let soundsOfInst = BufferPlayer.instruments[instrument].max - BufferPlayer.instruments[instrument].min + 1
        if (countOfPitches > (soundsOfInst - 1)) {
            while (countOfPitches > (soundsOfInst - 1)) {
                numberOfVerticalTrisMax--
                numberOfHorizontalTris = numberOfHorizontalTrisF()
                countOfPitches = countOfPitchesF()
            }
            numberOfVerticalTrisMax++
            numberOfHorizontalTris = numberOfHorizontalTrisF()
        }
        function numberOfHorizontalTrisF() {
            return 2 + 2 * Math.round(numberOfVerticalTrisMax * (Math.sqrt(3) / 2) * (window.innerWidth / window.innerHeight))
        }
        function countOfPitchesF() {
            return numberOfHorizontalTris - 1 + (numberOfVerticalTrisMax - 1) * 6
        }
        this.numberOfVerticalTrisMax = numberOfVerticalTrisMax
        console.log("numberOfVerticalTrisMax", numberOfVerticalTrisMax)
    }

    menu() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            document.getElementById("esc").style.display = "none"
        }
        
        function insertRows() {
            let rows = document.getElementById("rows")
            let sp = String.fromCharCode(160)
            for (let i = 4; i <= 16; i++) {
                let input = document.createElement('input')
                rows.append(input)
                input.type = "radio"
                input.name = "rows"
                //if (i == 6) input.checked = "checked"
                input.value = i
                let label = document.createElement("label")
                label.textContent = i + sp + sp + sp
                rows.append(label)
            }
        }
        insertRows()


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
            self.drawTriangles = new DrawTriangles(self.selectedInst, self.player)
            self.precalc(self.selectedInst)
            self.load()
        }
    }

    load() {
        this.keyboard.style.display = "block"
        this.page1.style.display = "none"
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
        let triangles = this.drawTriangles.drawTriangles(this.numberOfVerticalTrisMax)
        new Events(
            triangles,
            this.player,
            this.selectedInst,
            this.drawTriangles.numberOfHorizontalTris
        )
        document.addEventListener('keydown', logKey);
        function logKey(e) {
            if (e.key === "Escape") {
                let oAjax = new XMLHttpRequest;
                oAjax.open('get', '');
                oAjax.setRequestHeader('Pragma', 'no-cache');
                oAjax.send();
                oAjax.onreadystatechange = function () {
                    if (oAjax.readyState === 4) {
                        location.reload();
                    }
                }
            }
        }
    }
}
