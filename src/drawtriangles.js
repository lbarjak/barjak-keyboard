import Triangle from './triangle.js'

export default class DrawTriangles {
    constructor(instrument, player) {
        this.instrument = instrument
        this.player = player
        this.numberOfVerticalTris = 16
        this.numberOfVerticalTrisMax = 16
        this.triangles = []
        this.startTriangle = 0
        this.edgeOfTriangle = 0
        this.heightOfTriangle = 0
        this.precalc()
    }

    precalc() {  
        let numberOfVerticalTrisMax = 16
        let numberOfHorizontalTris = numberOfHorizontalTrisF()
        let countOfPitches = countOfPitchesF()
        let soundsOfInst = this.player.max - this.player.min + 1
        if (countOfPitches > (soundsOfInst - 1)) {
            while (countOfPitches > (soundsOfInst - 1)) {
                numberOfVerticalTrisMax--
                numberOfHorizontalTris = numberOfHorizontalTrisF()
                countOfPitches = countOfPitchesF()
            }
            numberOfVerticalTrisMax++
            numberOfHorizontalTris = numberOfHorizontalTrisF()
        }
        function numberOfHorizontalTrisF() {
            return 2 + 2 * Math.round(numberOfVerticalTrisMax * (Math.sqrt(3) / 2) * (window.innerWidth / window.innerHeight))
        }
        function countOfPitchesF() {
            return numberOfHorizontalTris - 1 + (numberOfVerticalTrisMax - 1) * 6
        }
        this.numberOfVerticalTrisMax = numberOfVerticalTrisMax
    }

    settings(numberOfVerticalTris = 16) {
        this.numberOfVerticalTris = this.numberOfVerticalTrisMax

        if (this.instrument == "midi") {
            //let starters = { "4": 47, "5": 47, "6": 35, "7": 23, "8": 23, "9": 11, "10": 11 }
            this.startTriangle = this.player.min - 1//starters[this.numberOfVerticalTris]
        }
        if (this.instrument == "piano") {
            this.startTriangle = this.player.min - 1
            //this.numberOfVerticalTris > 6 ? this.player.min - 1 : this.player.min + 12 - 1
        }
        if (this.instrument == "harpsichord") {
            // this.numberOfVerticalTris =
            //     this.numberOfVerticalTris > 6 ? 6 : this.numberOfVerticalTris
            //let starters = { "4": this.player.min - 1 + 12, "5": this.player.min - 1 + 12, "6": this.player.min - 1 }
            this.startTriangle = this.player.min - 1//starters[this.numberOfVerticalTris]
        }
        if (this.instrument == "harpsichord2") {
            // this.numberOfVerticalTris =
            //     this.numberOfVerticalTris > 7 ? 7 : this.numberOfVerticalTris
            //let starters = { "4": this.player.min - 1 + 24, "5": this.player.min - 1 + 12, "6": this.player.min - 1 + 7, "7": this.player.min - 1 }
            this.startTriangle = this.player.min - 1//starters[this.numberOfVerticalTris]
        }

        this.edgeOfTriangle = (window.innerHeight / this.numberOfVerticalTris / Math.sqrt(3)) * 2
        Triangle.edgeOfTriangle = this.edgeOfTriangle
        this.heightOfTriangle = (this.edgeOfTriangle * Math.sqrt(3)) / 2
        this.numberOfHorizontalTris = 2 + 2 * Math.round(window.innerWidth / this.edgeOfTriangle)
    }

    drawTriangles() {
        const noteOffsetAlwaysSix = 6
        let heightOfKeyboard = Math.round(
            this.heightOfTriangle * this.numberOfVerticalTris
        )
        let color

        const noteProperties = {
            "noteColors": ['white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
            "noteNames": ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        }

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
                color = noteProperties.noteColors[indexOfNote]
                if (pitch == this.startTriangle || pitch > this.player.max)
                    color = 'gray'

                mirroring = 2 * (column % 2 ^ row % 2) - 1
                this.triangles[countOfTriangles] = Triangle.getTriangle(
                    triangleCenterX,
                    triangleCenterY,
                    mirroring,
                    noteProperties.noteNames[indexOfNote],
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
