import Events from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'
export default class Index {
    constructor() {
        this.keyboard = document.getElementsByTagName('canvas')[0]
        this.page1 = document.getElementById("page1")
        this.player = null
        this.selectedInst = "piano"
        this.selectedValue = 0
        this.drawTriangles = null
        this.numberOfVerticalTrisMax = 16
        this.mobile = false
        window.onresize = this.reload
        this.menu()
    }

    reload(e) {
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

    precalc(instrument) {
        let numberOfVerticalTrisMax = 16
        let numberOfHorizontalTris = numberOfHorizontalTrisF()
        let countOfPitches = countOfPitchesF()
        let soundsOfInst =
            BufferPlayer.instruments[instrument].max - BufferPlayer.instruments[instrument].min + 1
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
    }

    menu() {
        let self = this
        let inst = document.querySelectorAll('input[name="instrument"]')
        let rows = document.getElementById("rows")

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.mobile = true
        }

        function insertRows() {
            rows.innerHTML += "<p><b>Rows of keyboard:</b></p>"
            for (let i = 4; i <= self.numberOfVerticalTrisMax; i++) {
                let input = document.createElement('input')
                rows.append(input)
                input.type = "radio"
                input.name = "rows"
                input.value = i
                let label = document.createElement("label")
                label.textContent = i + " "
                rows.append(label)
            }
            if (!self.mobile) rows.innerHTML += "<p><b>esc: back to this menu</b></p>"
        }

        for (const ins of inst) {
            ins.onchange = () => {
                self.selectedInst = ins.value
                removeAllChildNodes(rows)
                instances()
            }
        }
        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        function instances() {
            self.precalc(self.selectedInst)
            if (self.selectedValue > self.numberOfVerticalTrisMax) self.selectedValue = self.numberOfVerticalTrisMax
            insertRows()
            const rbs = document.querySelectorAll('input[name="rows"]')
            for (const rb of rbs) {
                rb.onchange = () => {
                    self.selectedValue = rb.value
                    self.player = BufferPlayer.getInstance(self.selectedInst)
                    self.drawTriangles = new DrawTriangles(self.player)
                    self.load()
                }
            }
        }
    }

    load() {
        let self = this
        this.keyboard.style.display = "block"
        this.page1.style.display = "none"
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
        let self = this
        let triangles = this.drawTriangles.drawTriangles(this.selectedValue)
        console.log(
            new Events(triangles, this.player, this.selectedInst, this.drawTriangles.numberOfHorizontalTris)
                .instrument)
        document.onkeydown = (e) => {
            if (e.key === "Escape") {
                self.reload()
            }
        }
    }
}
