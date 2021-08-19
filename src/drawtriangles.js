import Triangle from './triangle.js'

export default class DrawTriangles {
    constructor(instrument, numberOfVerticalTris, player) {
        this.numberOfVerticalTris = numberOfVerticalTris
        this.triangles = []
        this.instrument = instrument
        this.player = player
        this.startTriangle = 0
        this.numberOfHorizontalTris = 0
        this.edgeOfTriangle = 0
        this.heightOfTriangle = 0
        this.settings()
    }

    settings() {

        let mobile = false
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)
        ) {
            mobile = true
        }
        if (mobile && window.screen.orientation.angle == 0) {
            this.numberOfVerticalTris = 9
            this.startTriangle = 33
        }
        if (mobile && window.screen.orientation.angle > 0) {
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

        this.edgeOfTriangle =
            (window.innerHeight / this.numberOfVerticalTris / Math.sqrt(3)) * 2
        Triangle.edgeOfTriangle = this.edgeOfTriangle
        this.heightOfTriangle = (this.edgeOfTriangle * Math.sqrt(3)) / 2
        this.numberOfHorizontalTris =
            2 + 2 * Math.round(window.innerWidth / this.edgeOfTriangle)
        console.log("countOfTriangles =", this.numberOfVerticalTris * this.numberOfHorizontalTris)

    }

    drawTriangles() {
        const noteOffsetAlwaysSix = 6
        let heightOfKeyboard = Math.round(
            this.heightOfTriangle * this.numberOfVerticalTris
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
                //(this.heightOfTriangle / 2 + row * this.heightOfTriangle)
                this.heightOfTriangle * (0.5 + row)
            for (
                let column = 0;
                column < this.numberOfHorizontalTris;
                column++
            ) {
                triangleCenterX =
                    (window.innerWidth -
                        (this.numberOfHorizontalTris / 2 + 0.5) *
                        this.edgeOfTriangle) /
                    2 +
                    this.edgeOfTriangle / 2 +
                    (column * this.edgeOfTriangle) / 2

                indexOfNote = pitch % 12
                color = noteColors[indexOfNote]
                if (
                    (this.instrument != 'midi' &&
                        (pitch == this.startTriangle || pitch > this.player.max)) ||
                    (this.instrument == 'midi' && pitch == this.startTriangle)
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
