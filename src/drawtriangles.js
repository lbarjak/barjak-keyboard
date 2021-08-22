import Triangle from './triangle.js'

export default class DrawTriangles {
    constructor(instrument, player) {
        this.instrument = instrument
        this.player = player
        this.triangles = []
        this.startTriangle = 0
        this.edgeOfTriangle = 0
        this.heightOfTriangle = 0
    }

    // precalc() {

    // }

    settings(numberOfVerticalTris = 16) {
        let self = this
        
        this.numberOfVerticalTris = numberOfVerticalTris
        
        this.numberOfHorizontalTris = numberOfHorizontalTris()

        let countOfPitches = countOfPitchesF()
        let soundsOfInst = this.player.max - this.player.min + 1
        if (countOfPitches > (soundsOfInst - 1)) {
            while (countOfPitches > (soundsOfInst - 1)) {
                this.numberOfVerticalTris--
                this.numberOfHorizontalTris = numberOfHorizontalTris()
                countOfPitches = countOfPitchesF()
            }
            this.numberOfVerticalTris++
            this.numberOfHorizontalTris = numberOfHorizontalTris()
        }
        function numberOfHorizontalTris() {
            return 2 + 2 * Math.round(self.numberOfVerticalTris * (Math.sqrt(3) / 2) * (window.innerWidth / window.innerHeight))
        }
        function countOfPitchesF() {
            return self.numberOfHorizontalTris - 1 + (self.numberOfVerticalTris - 1) * 6
        }

        // let mobile = false
        // if (
        //     /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
        //     /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform)
        // ) {
        //     mobile = true
        // }
        // if (mobile && window.screen.orientation.angle == 0) {
        //     this.numberOfVerticalTris = 9
        //     this.startTriangle = 33
        // }
        // if (mobile && window.screen.orientation.angle > 0) {
        //     this.numberOfVerticalTris = 4
        //     this.startTriangle = 45
        // }

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
        console.log(noteProperties.noteColors[6])

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
        console.log("countOfTriangles", countOfTriangles, "pitch", pitch)
        return this.triangles
    }
}
