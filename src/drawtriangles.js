import Shapes from './shapes.js'
import BufferPlayer from './bufferplayer.js'

export default class DrawTriangles {
    constructor() {
        this.player = BufferPlayer.getPlayer()
        this.startTriangle = this.player.min - 1
        this.numberOfVerticalTris = 16
        this.numberOfVerticalTrisMax = 16
        this.triangles = []
        this.edgeOfTriangle = 0
        this.heightOfTriangle = 0
        this.drawing = SVG()
            .addTo('#svgs')
            .size(window.innerWidth, window.innerHeight)
        this.rect = this.drawing
            .rect(window.innerWidth, window.innerHeight)
            .attr({ fill: 'gray' })
    }

    drawTriangles = (numberOfVerticalTris) => {
        this.numberOfVerticalTris = numberOfVerticalTris
        this.edgeOfTriangle =
            (window.innerHeight / this.numberOfVerticalTris / Math.sqrt(3)) * 2
        this.heightOfTriangle = (this.edgeOfTriangle * Math.sqrt(3)) / 2
        this.numberOfHorizontalTris =
            2 + 2 * Math.round(window.innerWidth / this.edgeOfTriangle)
        const noteOffsetAlwaysSix = 6
        let heightOfKeyboard = Math.round(
            this.heightOfTriangle * this.numberOfVerticalTris
        )
        const noteProperties = {
            noteColors: [
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
            ],
            noteNames: [
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
        }
        let indexOfNote, pitch
        let triangleParams = {
            triangleCenterX: 0,
            triangleCenterY: 0,
            mirroring: 0,
            noteName: '',
            color: '',
            pitch: 0,
            serNumOfTri: 0,
            edgeOfTriangle: 0
        }
        for (let row = 0; row < this.numberOfVerticalTris; row++) {
            pitch = this.startTriangle + row * noteOffsetAlwaysSix
            triangleParams.triangleCenterY =
                heightOfKeyboard - this.heightOfTriangle * (0.5 + row)
            for (
                let column = 0;
                column < this.numberOfHorizontalTris;
                column++
            ) {
                triangleParams.triangleCenterX =
                    (window.innerWidth -
                        (this.numberOfHorizontalTris / 2 + 0.5) *
                            this.edgeOfTriangle) /
                        2 +
                    this.edgeOfTriangle / 2 +
                    (column * this.edgeOfTriangle) / 2
                indexOfNote = pitch % 12
                triangleParams.noteName = noteProperties.noteNames[indexOfNote]
                triangleParams.color = noteProperties.noteColors[indexOfNote]
                if (pitch === this.startTriangle || pitch > this.player.max)
                    triangleParams.color = 'gray'
                triangleParams.mirroring = 2 * (column % 2 ^ row % 2) - 1
                triangleParams.pitch = pitch++
                triangleParams.edgeOfTriangle = this.edgeOfTriangle
                this.triangles[triangleParams.serNumOfTri] = new Shapes(
                    triangleParams,
                    this.drawing
                )
                triangleParams.serNumOfTri++
            }
        }
        this.triangles.forEach((triangle) => {
            triangle.offArea.back()
        })
        return this.triangles
    }
}
