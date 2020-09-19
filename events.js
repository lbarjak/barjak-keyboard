"use strict"

import DrawTriangles from './drawtriangles.js';

export default class Events {

    constructor(triangles, player) {

        this.triangles = triangles;
        this.player = player;
        this.sounds = [];
        this.midiOutput;
        this.init();
        this.midiInit();
    }

    midiInit() {
        let self = this;
        navigator.requestMIDIAccess()
            .then(function (midi) {
                const outputs = midi.outputs.values();
                for (const output of outputs) {
                    self.midiOutput = output;
                }
            });
    }
    midi(onoff, pitch, sn) {
        //this.midiOutput.send([onoff + Math.floor(sn / DrawTriangles.numberOfHorizontalTris), pitch + 12, 127]);
    }
    soundSwitch(onoff, pitch, sn) {
        if (onoff == 1) {
            if (!this.sounds[pitch]) {
                this.sounds[pitch] = {};
                this.sounds[pitch][sn] = false;
            }
            if (!this.sounds[pitch][sn]) {
                this.sounds[pitch][sn] = true;
                this.midi(144, pitch, sn);
                this.player.play(pitch - 12, sn);
                this.triangles[sn].setSignOn();
            }
        }
        if (onoff == 0) {
            if (this.sounds[pitch]) {
                this.midi(128, pitch, sn);
                this.triangles[sn].setSignOff();
                this.player.stop(pitch - 12, sn);
                this.sounds[pitch][sn] = false;
            }
        };
    }

    init() {
        let self = this;
        let triangles = this.triangles;
        let isMouseDown = false;
        let previousTriangle = 0;
        let currentTriangle;
        canvas.addEventListener('mouseout', function (e) {
            if (previousTriangle != null) {
                self.soundSwitch(0, triangles[previousTriangle].getSound(), previousTriangle);
                isMouseDown = false;
            }
        });
        canvas.addEventListener('mousedown', function (e) {
            previousTriangle = getCurrentTriangle(e.clientX, e.clientY);
            console.log("sn:", previousTriangle, "hor.tris:", DrawTriangles.numberOfHorizontalTris,
                "channel:", Math.floor(previousTriangle / DrawTriangles.numberOfHorizontalTris).toString(16));
            self.soundSwitch(1, triangles[previousTriangle].getSound(), previousTriangle);
            isMouseDown = true;
        });
        canvas.addEventListener('mousemove', function (e) {
            if (isMouseDown) {
                currentTriangle = getCurrentTriangle(e.clientX, e.clientY);
                if (currentTriangle != previousTriangle) {
                    self.soundSwitch(0, triangles[previousTriangle].getSound(), previousTriangle);
                    self.soundSwitch(1, triangles[currentTriangle].getSound(), currentTriangle);
                    previousTriangle = currentTriangle;
                }
            }
        });
        canvas.addEventListener('mouseup', function (e) {
            self.soundSwitch(0, triangles[previousTriangle].getSound(), previousTriangle);
            previousTriangle = getCurrentTriangle(e.clientX, e.clientY);
            isMouseDown = false;
        });

        canvas.addEventListener('touchstart', handleTouch, false);
        canvas.addEventListener('touchmove', handleTouch, false);
        canvas.addEventListener('touchend', handleTouch, false);
        canvas.addEventListener('touchcancel', handleTouch, false);
        let oldTriangles = [];
        function handleTouch(e) {
            e.preventDefault();
            let newTriangles = [];
            for (let touch in e.touches) {
                if (!isNaN(touch)) {
                    let currentTriangleSn = getCurrentTriangle(
                        e.touches[touch].clientX, e.touches[touch].clientY);
                    if (currentTriangleSn != null) {
                        self.soundSwitch(1, triangles[currentTriangleSn].getSound(), currentTriangleSn);
                        for (let sn in oldTriangles) {
                            if (oldTriangles[sn] == currentTriangleSn) {
                                oldTriangles.splice(sn, 1);
                            }
                        }
                        newTriangles.push(currentTriangleSn);
                    }
                }
            }
            for (let sn in oldTriangles) {
                self.soundSwitch(0, triangles[oldTriangles[sn]].getSound(), oldTriangles[sn]);
            }
            oldTriangles = newTriangles;
        }

        let serialNumberOfTriangle;
        let len = triangles.length;
        function getCurrentTriangle(x, y) {
            for (let i = 0; i < len; i++) {
                serialNumberOfTriangle = triangles[i].getCurrentTriangle(x, y);
                if (serialNumberOfTriangle > -1) {
                    return serialNumberOfTriangle;
                }
            }
        }
    }
}
