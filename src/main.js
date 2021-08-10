import Events from './events.js'
import BufferPlayer from './bufferplayer.js'
import DrawTriangles from './drawtriangles.js'

export default class MainJS {
    constructor() {
        this.player
        this.main()
        this.canvas()
        this.drawTriangles
        this.instrument
    }
    main() {
        window.addEventListener('orientationchange', function (e) {
            location.reload()
        })

        let numberOfVerticalTris = 5

        let rows, startTriangle
        let query = window.location.search.substring(1) || 'rows=6&inst=piano'
        if (query) {
            rows = parse_query_string(query).rows
            this.instrument = parse_query_string(query).inst
        }
        numberOfVerticalTris = rows > 3 && rows < 11 ? rows : 6

        let mobile = false
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)
        ) {
            mobile = true
        }
        if (mobile == true && window.screen.orientation.angle == 0) {
            numberOfVerticalTris = 9
            startTriangle = 33
        }
        if (mobile == true && window.screen.orientation.angle > 0) {
            numberOfVerticalTris = 4
            startTriangle = 45
        }

        this.player = new BufferPlayer(this.instrument)

        switch (this.instrument) {
            case 'piano':
                startTriangle =
                    numberOfVerticalTris > 6 ? this.player.min - 1 : this.player.min + 12 - 1
                break
            case 'harpsichord':
                numberOfVerticalTris =
                    numberOfVerticalTris > 6 ? 6 : numberOfVerticalTris
                startTriangle = this.player.min - 1
                break
            case 'harpsichord2':
                numberOfVerticalTris =
                    numberOfVerticalTris > 7 ? 7 : numberOfVerticalTris
                startTriangle = this.player.min - 1
                break
            case 'midi':
                startTriangle = numberOfVerticalTris > 8 ? 11 : 23
        }

        this.drawTriangles = new DrawTriangles(
            numberOfVerticalTris,
            this.instrument,
            this.player,
            startTriangle
        )

        function parse_query_string(query) {
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
    }

    start() {
        console.log("start")
        let triangles = this.drawTriangles.drawTriangles()
        new Events(
            triangles,
            this.player,
            this.instrument,
            this.drawTriangles.numberOfHorizontalTris
        )
    }

    canvas() {
        const keyboard = document.getElementById('canvas')
        window.ctx = keyboard.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx.fillStyle = '#4d4d4d'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        //no right click
        canvas.oncontextmenu = function (e) {
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
        let self = this
            ; (function timer() {
                ctx.fillStyle = '#4d4d4d'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                message =
                    'Loading sounds ' +
                    self.player.loading +
                    ' out of ' +
                    (self.player.max - self.player.min + 1) +
                    '...'
                ctx.fillStyle = 'white'
                ctx.fillText(message, canvas.width * 0.5, canvas.height * 0.3)
                t = setTimeout(timer, 10)
                if (self.player.loading == self.player.max - self.player.min + 1) {
                    clearTimeout(t)
                    self.start()
                }
            })()
    }
}
