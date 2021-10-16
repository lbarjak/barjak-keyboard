import Precalc from './precalc.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'
import Canvas from './canvas.js'

export default class Menu {
    constructor() {
        this.mobile = false
        window.onresize = this.reload
        this.menu()
    }

    reload = () => {
        fetch('', {
            'Cache-Control': 'no-cache'
        })
            .then(() => location.reload())
            .catch((error) => console.warn(error))
    }

    menu = () => {
        document.onkeydown = (e) => {
            if (e.key === 'Escape') {
                this.reload()
            }
        }

        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
                navigator.userAgent
            )
        ) {
            this.mobile = true
        }
        if (navigator.requestMIDIAccess)
            document.getElementById('midi').style.display = 'block'

        let section1 = document.getElementById('section1')

        let setInstruments = () => {
            let instruments = document.getElementById('instruments')
            instruments.addEventListener('change', (event) => {
                this.selectedInst = event.target.value
                removeAllChildNodes(section1)
                insertForm(section1, 'Octave shift:', 'octaves', 0, 3)
                setOctaves()
            })
        }
        setInstruments()

        let removeAllChildNodes = (parent) => {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild)
            }
        }

        let insertForm = (sect, title, name, min, max) => {
            sect.innerHTML += '<p><b>' + title + '</b></p>'
            let form = document.createElement('form')
            form.setAttribute('id', name)
            for (let i = min; i < max; i++) {
                let input = document.createElement('input')
                form.append(input)
                input.type = 'radio'
                input.name = name
                input.value = i
                let label = document.createElement('label')
                label.textContent = i + ' '
                form.append(label)
            }
            sect.append(form)
        }

        let setOctaves = () => {
            section1.innerHTML += "<span id='section2'></span>"
            let octaves = document.getElementById('octaves')
            octaves.addEventListener('change', (event) => {
                this.selectedOctave = event.target.value
                removeAllChildNodes(section2)
                this.numberOfVerticalTrisMax = new Precalc().precalc(
                    this.selectedOctave
                )
                insertForm(
                    section2,
                    'Rows of keyboard:',
                    'rows',
                    4,
                    this.numberOfVerticalTrisMax + 1
                )
                setRows()
            })
        }

        let setRows = () => {
            if (!this.mobile)
                section2.innerHTML += '<p><b>esc: back to this menu</b></p>'
            let rows = document.getElementById('rows')
            rows.addEventListener('change', (event) => {
                this.selectedValueOfRows = event.target.value
                instances()
            })
        }

        let instances = () => {
            if (this.selectedValueOfRows > this.numberOfVerticalTrisMax)
                this.selectedValueOfRows = this.numberOfVerticalTrisMax
            BufferPlayer.getPlayer(this.selectedInst, this.selectedOctave)
            this.drawTriangles = new DrawTriangles()
            new Canvas(this.drawTriangles, this.selectedValueOfRows).load()
        }
    }
}
