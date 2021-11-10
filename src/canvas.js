import Events from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'

export default class Canvas {
    constructor(selectedValueOfRows, selectedInst) {
        this.selectedValueOfRows = selectedValueOfRows
        this.selectedInst = selectedInst
        this.keyboard = document.getElementsByTagName('canvas')[0]
        this.root = document.getElementById('root')
    }

    loadSoundFiles = () => {
        let player = BufferPlayer.getPlayer()
        this.keyboard.style.display = 'block'
        this.root.style.display = 'none'
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
        let time
        let message
        let timer = () => {
            ctx.fillStyle = '#4d4d4d'
            ctx.fillRect(0, 0, this.keyboard.width, this.keyboard.height)
            message =
                'Loading sounds ' +
                player.loading +
                ' out of ' +
                (player.max - player.min + 1) +
                '...'
            ctx.fillStyle = 'white'
            ctx.fillText(
                message,
                this.keyboard.width * 0.5,
                this.keyboard.height * 0.3
            )
            time = setTimeout(timer, 10)
            if (player.loading === player.max - player.min + 1) {
                clearTimeout(time)
                this.musicalKeyboard()
            }
        }
        timer()
    }

    musicalKeyboard = () => {
        let drawTriangles = new DrawTriangles()
        let triangles = drawTriangles.drawTriangles(this.selectedValueOfRows)
        new Events(
            triangles,
            this.selectedInst,
            drawTriangles.numberOfHorizontalTris
        )
    }
}
