import Events from './events.js'

export default class Canvas {
    constructor(player, drawTriangles, selectedValue) {
        this.player = player
        this.drawTriangles = drawTriangles
        this.selectedValue = selectedValue
        this.keyboard = document.getElementsByTagName('canvas')[0]
        this.root = document.getElementById('root')
    }

    load = () => {
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
            ctx.fillText(
                message,
                this.keyboard.width * 0.5,
                this.keyboard.height * 0.3
            )
            t = setTimeout(timer, 10)
            if (this.player.loading == this.player.max - this.player.min + 1) {
                clearTimeout(t)
                this.kbd()
            }
        }
        timer()
    }

    kbd = () => {
        console.log(this.selectedValue)
        console.log(this.drawTriangles)
        let triangles = this.drawTriangles.drawTriangles(this.selectedValue)
        console.log(
            new Events(
                triangles,
                this.player,
                this.selectedInst,
                this.drawTriangles.numberOfHorizontalTris
            ).instrument
        )
        document.onkeydown = (e) => {
            if (e.key === 'Escape') {
                this.reload()
            }
        }
    }
}
