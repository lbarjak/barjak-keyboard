import Triangle from './triangle.js'

export default class DrawTriangles {
    constructor(player) {
        this.player = player
        this.startTriangle = this.player.min - 1
        this.numberOfVerticalTris = 16
        this.numberOfVerticalTrisMax = 16
        this.triangles = []
        this.edgeOfTriangle = 0
        this.heightOfTriangle = 0
    }

    drawTriangles = (numberOfVerticalTris) => {
        this.numberOfVerticalTris = numberOfVerticalTris
        this.edgeOfTriangle = (window.innerHeight / this.numberOfVerticalTris / Math.sqrt(3)) * 2
        this.heightOfTriangle = (this.edgeOfTriangle * Math.sqrt(3)) / 2
        this.numberOfHorizontalTris = 2 + 2 * Math.round(window.innerWidth / this.edgeOfTriangle)
        const noteOffsetAlwaysSix = 6
        let heightOfKeyboard = Math.round(this.heightOfTriangle * this.numberOfVerticalTris)
        const noteProperties = {
            "noteColors": ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
            "noteNames": ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        }
        let triangleCenterX, triangleCenterY, mirroring, noteName, color, pitch, countOfTriangles = 0
        let indexOfNote
        let triangleParams = {
            "triangleCenterX": 0, "triangleCenterY": 0, "mirroring": 0, "noteName": "", 
            "color": "", "pitch": 0, "countOfTriangles": 0, "edgeOfTriangle": 0
        }

        for (let row = 0; row < this.numberOfVerticalTris; row++) {
            pitch = this.startTriangle + row * noteOffsetAlwaysSix
            triangleCenterY = heightOfKeyboard - this.heightOfTriangle * (0.5 + row)
            for (let column = 0; column < this.numberOfHorizontalTris; column++) {
                triangleCenterX =
                    (window.innerWidth - (this.numberOfHorizontalTris / 2 + 0.5) * this.edgeOfTriangle) / 2
                    + this.edgeOfTriangle / 2
                    + (column * this.edgeOfTriangle) / 2
                indexOfNote = pitch % 12
                noteName = noteProperties.noteNames[indexOfNote]
                color = noteProperties.noteColors[indexOfNote]
                if (pitch == this.startTriangle || pitch > this.player.max) color = 'gray'
                mirroring = 2 * (column % 2 ^ row % 2) - 1
                triangleParams.triangleCenterX = triangleCenterX
                triangleParams.triangleCenterY = triangleCenterY
                triangleParams.mirroring = mirroring
                triangleParams.noteName = noteName
                triangleParams.color = color
                triangleParams.pitch = pitch++
                triangleParams.countOfTriangles = countOfTriangles
                triangleParams.edgeOfTriangle = this.edgeOfTriangle
                this.triangles[countOfTriangles++] = new Triangle(triangleParams)
                //pitch++
            }
        }
        return this.triangles
    }
}
