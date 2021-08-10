import Triangle from './triangle.js'

export default class DrawTriangles {
        constructor(instrument, player) {
        this.numberOfVerticalTris
        this.triangles = []
        this.instrument = instrument
        this.player = player
        this.startTriangle
        this.numberOfHorizontalTris
    }

    drawTriangles() {

        let rows
        let query = window.location.search.substring(1) || 'rows=6&inst=piano'
        if (query) {
            rows = parse_query_string(query).rows
            this.instrument = parse_query_string(query).inst
        }
        this.numberOfVerticalTris = rows > 3 && rows < 11 ? rows : 6

        let mobile = false
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)
        ) {
            mobile = true
        }
        if (mobile == true && window.screen.orientation.angle == 0) {
            this.numberOfVerticalTris = 9
            this.startTriangle = 33
        }
        if (mobile == true && window.screen.orientation.angle > 0) {
            this.numberOfVerticalTris = 4
            this.startTriangle = 45
        }

        switch (this.instrument) {
            case 'piano':
                this.startTriangle =
                    this.numberOfVerticalTris > 6 ? this.player.min - 1 : this.player.min + 12 - 1
                break
            case 'harpsichord':
                this.numberOfVerticalTris =
                    this.numberOfVerticalTris > 6 ? 6 : this.numberOfVerticalTris
                this.startTriangle = this.player.min - 1
                break
            case 'harpsichord2':
                this.numberOfVerticalTris =
                    this.numberOfVerticalTris > 7 ? 7 : this.numberOfVerticalTris
                this.startTriangle = this.player.min - 1
                break
            case 'midi':
                this.startTriangle = this.numberOfVerticalTris > 8 ? 11 : 23
        }

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

        const noteOffsetAlwaysSix = 6
        let edgeOfTriangle =
            (window.innerHeight / this.numberOfVerticalTris / Math.sqrt(3)) * 2
        Triangle.edgeOfTriangle = edgeOfTriangle
        let heightOfTriangle = (edgeOfTriangle * Math.sqrt(3)) / 2
        this.numberOfHorizontalTris =
            2 + 2 * Math.round(canvas.width / edgeOfTriangle)
        let heightOfKeyboard = Math.round(
            heightOfTriangle * this.numberOfVerticalTris
        )
        let color

        const noteNames = [
            'C',
            'C#',
            'D',
            'D#',
            'E',
            'F',
            'F#',
            'G',
            'G#',
            'A',
            'A#',
            'B'
        ]
        const noteColors = [
            'white',
            'black',
            'white',
            'black',
            'white',
            'white',
            'black',
            'white',
            'black',
            'white',
            'black',
            'white'
        ]

        let pitch,
            triangleCenterX,
            triangleCenterY,
            indexOfNote,
            mirroring,
            countOfTriangles = 0
        for (let row = 0; row < this.numberOfVerticalTris; row++) {
            pitch = this.startTriangle + row * noteOffsetAlwaysSix

            triangleCenterY =
                heightOfKeyboard -
                (heightOfTriangle / 2 + row * heightOfTriangle)
            for (
                let column = 0;
                column < this.numberOfHorizontalTris;
                column++
            ) {
                triangleCenterX =
                    (canvas.width -
                        (this.numberOfHorizontalTris / 2 + 0.5) *
                            edgeOfTriangle) /
                        2 +
                    edgeOfTriangle / 2 +
                    (column * edgeOfTriangle) / 2

                indexOfNote = pitch % 12
                color = noteColors[indexOfNote]
                if (
                    (this.instrument != 'midi' &&
                        (pitch < this.player.min || pitch > this.player.max)) ||
                    (this.instrument == 'midi' && pitch < 12)
                )
                    color = 'gray'

                mirroring = 2 * (column % 2 ^ row % 2) - 1
                this.triangles[countOfTriangles] = Triangle.getTriangle(
                    triangleCenterX,
                    triangleCenterY,
                    mirroring,
                    noteNames[indexOfNote],
                    color,
                    pitch,
                    countOfTriangles++
                )
                pitch++
            }
        }
        return this.triangles
    }
}
