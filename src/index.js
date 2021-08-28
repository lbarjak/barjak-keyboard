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

    reload = () => {
        let oAjax = new XMLHttpRequest;
        oAjax.open('get', '');
        oAjax.setRequestHeader('Pragma', 'no-cache');
        oAjax.send();
        oAjax.onreadystatechange = () => {
            if (oAjax.readyState === 4) {
                location.reload();
            }
        }
    }

    precalc = () => {
        let numberOfVerticalTrisMax = 16
        let numberOfHorizontalTrisF = () => {
            return 2 + 2 * Math.round(numberOfVerticalTrisMax * (Math.sqrt(3) / 2) * (window.innerWidth / window.innerHeight))
        }
        let numberOfHorizontalTris = numberOfHorizontalTrisF()
        let countOfPitchesF = () => {
            return numberOfHorizontalTris - 1 + (numberOfVerticalTrisMax - 1) * 6
        }
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
        this.numberOfVerticalTrisMax = numberOfVerticalTrisMax
    }

    menu = () => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            this.mobile = true
        }

        let section = document.getElementById("section")

        let setInstruments = () => {
            section.innerHTML += "<span id='section1'></span>"
            let instruments = document.querySelectorAll('input[name="instruments"]')
            for (const instrument of instruments) {
                instrument.onchange = () => {
                    this.selectedInst = instrument.value
                    removeAllChildNodes(section1)
                    insertForm(section1, "Octave shift:", "octaves", 0, 3)
                    setOctaves()
                }
            }
        }
        setInstruments()

        let removeAllChildNodes = (parent) => {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }

        let insertForm = (sect, title, name, min, max) => {
            sect.innerHTML += "<p><b>" + title + "</b></p>"
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

        let setOctaves = () => {
            section1.innerHTML += "<span id='section2'></span>"
            let octaves = document.querySelectorAll('input[name="octaves"]')
            for (const octave of octaves) {
                octave.onchange = () => {
                    this.selectedOctave = octave.value
                    removeAllChildNodes(section2)
                    this.precalc()
                    insertForm(section2, "Rows of keyboard:", "rows", 4, this.numberOfVerticalTrisMax + 1)
                    setRows()
                }
            }
        }

        let setRows = () => {
            if (!this.mobile) section2.innerHTML += "<p><b>esc: back to this menu</b></p>"
            let rows = document.querySelectorAll('input[name="rows"]')
            for (const row of rows) {
                row.onchange = () => {
                    this.selectedValue = row.value
                    instances()
                }
            }
        }

        let instances = () => {
            if (this.selectedValue > this.numberOfVerticalTrisMax) this.selectedValue = this.numberOfVerticalTrisMax
            this.player = BufferPlayer.getInstance(this.selectedInst, this.selectedOctave)
            this.drawTriangles = new DrawTriangles(this.player)
            this.load()
        }
    }

    load = () => {
        this.keyboard.style.display = "block"
        this.page1.style.display = "none"
        window.ctx = this.keyboard.getContext('2d')
        this.keyboard.width = window.innerWidth
        this.keyboard.height = window.innerHeight
        ctx.fillStyle = '#4d4d4d'
        ctx.fillRect(0, 0, this.keyboard.width, this.keyboard.height)
        //no right click
        this.keyboard.oncontextmenu = (e) => {
            e.preventDefault()
            e.stopPropagation()
        }
        //no dragging
        document.onselectstart = () => {
            return false
        }
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        let t
        let message
        let timer = () => {
            ctx.fillStyle = '#4d4d4d'
            ctx.fillRect(0, 0, this.keyboard.width, this.keyboard.height)
            message =
                'Loading sounds ' +
                this.player.loading +
                ' out of ' +
                (this.player.max - this.player.min + 1) +
                '...'
            ctx.fillStyle = 'white'
            ctx.fillText(message, this.keyboard.width * 0.5, this.keyboard.height * 0.3)
            t = setTimeout(timer, 10)
            if (this.player.loading == this.player.max - this.player.min + 1) {
                clearTimeout(t)
                this.kbd()
            }
        }
        timer()
    }

    kbd = () => {
        let triangles = this.drawTriangles.drawTriangles(this.selectedValue)
        console.log(
            new Events(triangles, this.player, this.selectedInst, this.drawTriangles.numberOfHorizontalTris)
                .instrument)
        document.onkeydown = (e) => {
            if (e.key === "Escape") {
                this.reload()
            }
        }
    }
}
