"use strict";

import Triangle from "./triangle.js";
import BufferPlayer from "./bufferplayer.js";

export default class DrawTriangles {

    static startNote = BufferPlayer.startNote;
    static numberOfHorizontalTris;

    constructor(numberOfVerticalTris, triangles) {
        this.numberOfVerticalTris = numberOfVerticalTris;
        this.triangles = triangles;
    }

    drawTriangles() {
        const noteOffsetAlwaysSix = 6;
        let edgeOfTrinagle = window.innerHeight / this.numberOfVerticalTris / Math.sqrt(3) * 2;
        let heightOfTriangle = edgeOfTrinagle * Math.sqrt(3) / 2;
        DrawTriangles.numberOfHorizontalTris = 2 + 2 * Math.round(canvas.width / edgeOfTrinagle);
        BufferPlayer.countOfSounds = DrawTriangles.numberOfHorizontalTris + noteOffsetAlwaysSix * (this.numberOfVerticalTris - 1);
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
                mirroring = 2 * ((column % 2) ^ (row % 2)) - 1;
                if (BufferPlayer.instrument == "harpsichord2")
                    color = pitch < BufferPlayer.harpsichord2Min || pitch > BufferPlayer.harpsichord2Max ?
                        "gray" : noteColors[indexOfNote];
                if (BufferPlayer.instrument == "harpsichord")
                    color = pitch < BufferPlayer.harpsichordMin || pitch > BufferPlayer.harpsichordMax ?
                        "gray" : noteColors[indexOfNote];
                if (BufferPlayer.instrument == "piano" || BufferPlayer.instrument == "midi")
                    color = pitch < BufferPlayer.pianoMin || pitch > BufferPlayer.pianoMax ?
                        "gray" : noteColors[indexOfNote];
                this.triangles[countOfTriangles] = (
                    new Triangle(
                        triangleCenterX, triangleCenterY, edgeOfTrinagle,
                        mirroring, noteNames[indexOfNote], color, pitch, countOfTriangles++));
                pitch++;
            }
        }
    }
}