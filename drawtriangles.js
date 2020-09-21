"use strict";

import Triangle from "./triangle.js";
import BufferPlayer from "./bufferplayer.js";

export default class DrawTriangles {

    static startNote = 0;
    static numberOfHorizontalTris;

    constructor(numberOfVerticalTris, triangles, instrument, player) {
        this.numberOfVerticalTris = numberOfVerticalTris;
        this.triangles = triangles;
        this.instrument = instrument;
        this.player = player;
    }

    drawTriangles() {
        const noteOffsetAlwaysSix = 6;
        let edgeOfTrinagle = window.innerHeight / this.numberOfVerticalTris / Math.sqrt(3) * 2;
        let heightOfTriangle = edgeOfTrinagle * Math.sqrt(3) / 2;
        DrawTriangles.numberOfHorizontalTris = 2 + 2 * Math.round(canvas.width / edgeOfTrinagle);
        let heightOfKeyboard = Math.round(heightOfTriangle * this.numberOfVerticalTris);
        let color;

        const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const noteColors = ["white", "black", "white", "black", "white", "white", "black",
            "white", "black", "white", "black", "white"];

        let pitch, triangleCenterX, triangleCenterY, indexOfNote, mirroring, countOfTriangles = 0;
        for (let row = 0; row < this.numberOfVerticalTris; row++) {

            pitch = DrawTriangles.startNote + row * noteOffsetAlwaysSix;

            triangleCenterY = heightOfKeyboard - (heightOfTriangle / 2 + row * heightOfTriangle);
            for (let column = 0; column < DrawTriangles.numberOfHorizontalTris; column++) {

                triangleCenterX = (canvas.width - (DrawTriangles.numberOfHorizontalTris / 2 + 0.5) * edgeOfTrinagle) / 2
                    + edgeOfTrinagle / 2 + column * edgeOfTrinagle / 2;

                indexOfNote = pitch % 12;
                color = noteColors[indexOfNote];
                if (this.instrument != "midi" && (pitch < this.player.min || pitch > this.player.max))
                    color = "gray";

                mirroring = 2 * ((column % 2) ^ (row % 2)) - 1;
                this.triangles[countOfTriangles] = (
                    new Triangle(
                        triangleCenterX, triangleCenterY, edgeOfTrinagle,
                        mirroring, noteNames[indexOfNote], color, pitch, countOfTriangles++));
                pitch++;
            }
        }
        console.log(countOfTriangles);
    }
}