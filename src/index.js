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
        this.selectedOctave = 0
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

    precalc() {
        let numberOfVerticalTrisMax = 16
        let numberOfHorizontalTris = numberOfHorizontalTrisF()
        let countOfPitches = countOfPitchesF()
        let soundsOfInst =
            BufferPlayer.instruments[this.selectedInst].max - BufferPlayer.instruments[this.selectedInst].min
            + 1 - 12 * this.selectedOctave
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
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.mobile = true
        }

        let self = this
        let section = document.getElementById("section")
        setInstruments()

        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
        function insertForm(sect, title, name, min, max){
            sect.innerHTML += "<p><b>"+ title +"</b></p>"
            for (let i = min; i < max; i++) {
                let input = document.createElement('input')
                sect.append(input)
                input.type = "radio"
                input.name = name
                input.value = i
                let label = document.createElement("label")
                label.textContent = i + " "
                sect.append(label)
            }
        }
        function setInstruments() {
            section.innerHTML += "<span id='section1'></span>"
            let instruments = document.querySelectorAll('input[name="instruments"]')
            for (const instrument of instruments) {
                instrument.onchange = () => {
                    self.selectedInst = instrument.value
                    removeAllChildNodes(section1)
                    insertForm(section1, "Octave shift:", "octaves", 0, 3)
                    setOctaves()
                }
            }
        }
        function setOctaves() {
            section1.innerHTML += "<span id='section2'></span>"
            let octaves = document.querySelectorAll('input[name="octaves"]')
            for (const octave of octaves) {
                octave.onchange = () => {
                    self.selectedOctave = octave.value
                    removeAllChildNodes(section2)
                    self.precalc()
                    insertForm(section2, "Rows of keyboard:", "rows", 4, self.numberOfVerticalTrisMax + 1)
                    setRows()
                }
            }
        }
        function setRows() {
            if (!self.mobile) section2.innerHTML += "<p><b>esc: back to this menu</b></p>"
            let rows = document.querySelectorAll('input[name="rows"]')
            for (const row of rows) {
                row.onchange = () => {
                    self.selectedValue = row.value
                    instances()
                }
            }
        }
        function instances() {
            if (self.selectedValue > self.numberOfVerticalTrisMax) self.selectedValue = self.numberOfVerticalTrisMax
            self.player = BufferPlayer.getInstance(self.selectedInst, self.selectedOctave)
            self.drawTriangles = new DrawTriangles(self.player)
            self.load()
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
