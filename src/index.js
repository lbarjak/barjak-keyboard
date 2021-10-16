import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'
import Canvas from './canvas.js'
export default class Index {
    constructor() {
        //this.keyboard = document.getElementsByTagName('canvas')[0]
        //this.root = document.getElementById('root')
        this.player = null
        this.selectedInst = 'piano'
        this.selectedValue = 0
        this.selectedOctave = 0
        this.drawTriangles = null
        this.numberOfVerticalTrisMax = 16
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

    precalc = () => {
        let numberOfVerticalTrisMax = 16
        let numberOfHorizontalTrisF = () => {
            return (
                2 +
                2 *
                    Math.round(
                        numberOfVerticalTrisMax *
                            (Math.sqrt(3) / 2) *
                            (window.innerWidth / window.innerHeight)
                    )
            )
        }
        let numberOfHorizontalTris = numberOfHorizontalTrisF()
        let countOfPitchesF = () => {
            return (
                numberOfHorizontalTris - 1 + (numberOfVerticalTrisMax - 1) * 6
            )
        }
        let countOfPitches = countOfPitchesF()
        let soundsOfInst =
            BufferPlayer.instruments[this.selectedInst].max -
            BufferPlayer.instruments[this.selectedInst].min +
            1 -
            12 * this.selectedOctave
        if (countOfPitches > soundsOfInst - 1) {
            while (countOfPitches > soundsOfInst - 1) {
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
            let f = document.createElement('form')
            f.setAttribute('id', name)
            for (let i = min; i < max; i++) {
                let input = document.createElement('input')
                f.append(input)
                input.type = 'radio'
                input.name = name
                input.value = i
                let label = document.createElement('label')
                label.textContent = i + ' '
                f.append(label)
            }
            sect.append(f)
        }

        let setOctaves = () => {
            section1.innerHTML += "<span id='section2'></span>"
            let octaves = document.getElementById('octaves')
            octaves.addEventListener('change', (event) => {
                this.selectedOctave = event.target.value
                removeAllChildNodes(section2)
                this.precalc()
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
                this.selectedValue = event.target.value
                instances()
            })
        }

        let instances = () => {
            if (this.selectedValue > this.numberOfVerticalTrisMax)
                this.selectedValue = this.numberOfVerticalTrisMax
            this.player = new BufferPlayer(
                this.selectedInst,
                this.selectedOctave
            )
            this.drawTriangles = new DrawTriangles(this.player)
            new Canvas(
                this.player,
                this.drawTriangles,
                this.selectedValue
            ).load()
        }
    }
}
