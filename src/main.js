import Events from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'

export default class MainJS {
    constructor() {
        this.player
        this.drawTriangles
        this.instrument = "piano"
        this.main()
        this.keyboard()
    }

    main() {
        window.addEventListener('orientationchange', function (e) {
            location.reload()
        })
        let query = window.location.search.substring(1)
        if (query) {
            this.instrument = MainJS.parse_query_string(query).inst
        }

        //this.player = new BufferPlayer(this.instrument)
        this.player = BufferPlayer.getInstance()

        this.drawTriangles = new DrawTriangles(
            this.instrument,
            this.player
        )
    }

    static parse_query_string(query) {
        var vars = query.split('&')
        var query_string = {}
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=')
            var key = decodeURIComponent(pair[0])
            var value = decodeURIComponent(pair[1])
            if (typeof query_string[key] === 'undefined') {
                query_string[key] = decodeURIComponent(value)
            } else if (typeof query_string[key] === 'string') {
                var arr = [query_string[key], decodeURIComponent(value)]
                query_string[key] = arr
            } else {
                query_string[key].push(decodeURIComponent(value))
            }
        }
        return query_string
    }

    start() {
        let triangles = this.drawTriangles.drawTriangles()
        new Events(
            triangles,
            this.player,
            this.instrument,
            this.drawTriangles.numberOfHorizontalTris
        )
    }

    keyboard() {
        const keyboard = document.getElementsByTagName('canvas')[0]
        window.ctx = keyboard.getContext('2d')
        keyboard.width = window.innerWidth
        keyboard.height = window.innerHeight
        ctx.fillStyle = '#4d4d4d'
        ctx.fillRect(0, 0, keyboard.width, keyboard.height)
        //no right click
        keyboard.oncontextmenu = function (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        //no dragging
        document.onselectstart = function () {
            return false
        }
        this.start()
        // ctx.font = '16px Arial'
        // ctx.textAlign = 'center'
        // ctx.textBaseline = 'middle'
        // let t
        // let message
        // let self = this
        //     ; (function timer() {
        //         ctx.fillStyle = '#4d4d4d'
        //         ctx.fillRect(0, 0, keyboard.width, keyboard.height)
        //         message =
        //             'Loading sounds ' +
        //             self.player.loading +
        //             ' out of ' +
        //             (self.player.max - self.player.min + 1) +
        //             '...'
        //         ctx.fillStyle = 'white'
        //         ctx.fillText(message, keyboard.width * 0.5, keyboard.height * 0.3)
        //         t = setTimeout(timer, 10)
        //         if (self.player.loading == self.player.max - self.player.min + 1) {
        //             clearTimeout(t)
        //             self.start()
        //         }
        //     })()
        //const keyboard = document.getElementsByTagName('canvas')[0]
    }
}
