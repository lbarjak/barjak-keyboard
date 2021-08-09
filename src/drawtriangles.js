import Triangle from './triangle.js'

export default class DrawTriangles {
    constructor(numberOfVerticalTris, instrument, player, startTriangle) {
        this.numberOfVerticalTris = numberOfVerticalTris
        this.triangles = []
        this.instrument = instrument
        this.player = player
        this.startTriangle = startTriangle
        this.numberOfHorizontalTris
    }

    drawTriangles() {
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
