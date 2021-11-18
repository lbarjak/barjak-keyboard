import Events from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'

export default class Loading {
    constructor(selectedValueOfRows, selectedInst) {
        this.selectedValueOfRows = selectedValueOfRows
        this.selectedInst = selectedInst
    }

    loadSoundFiles = () => {
        let menu = document.getElementById('menu')
        let loading = document.getElementById('loading')
        menu.style.display = 'none'
        let player = BufferPlayer.getPlayer()
        let time
        let message
        let timer = () => {
            message =
                'Loading sounds ' +
                player.loading +
                ' out of ' +
                (player.max - player.min + 1) +
                '...'
            loading.innerHTML = '<h3>' + message + '</h3>'
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
