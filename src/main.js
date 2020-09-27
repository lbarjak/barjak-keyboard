"use strict";

window.addEventListener("orientationchange", function (e) {
    location.reload();
});

import BufferPlayer from './bufferplayer.js';
import Events from './events.js';
import DrawTriangles from "./drawtriangles.js";

const keyboard = document.getElementById("canvas");
window.ctx = keyboard.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "#4d4d4d";
ctx.fillRect(0, 0, canvas.width, canvas.height);

//no right click
canvas.oncontextmenu = function (e) {
    e.preventDefault();
    e.stopPropagation();
}
//no dragging
document.onselectstart = function () {
    return false;
};

let numberOfVerticalTris = 5;

let rows, instrument, startTriangle;
let query = window.location.search.substring(1);
if (query) {
    rows = parse_query_string(query).rows;
    instrument = parse_query_string(query).inst;
}
numberOfVerticalTris = rows > 3 && rows < 11 ? rows : 6;

switch (instrument) {
    case "piano":
        let pianoMin = 24;
        startTriangle = numberOfVerticalTris > 6 ? pianoMin - 1 : pianoMin + 12 - 1;
        break;
    case "harpsichord":
        let harpsichordMin = 36;
        numberOfVerticalTris = numberOfVerticalTris > 6 ? 6 : numberOfVerticalTris;
        startTriangle = harpsichordMin - 1;
        break;
    case "harpsichord2":
        let harpsichord2Min = 29;
        numberOfVerticalTris = numberOfVerticalTris > 7 ? 7 : numberOfVerticalTris;
        startTriangle = harpsichord2Min - 1;
        break;
    case "midi":
        startTriangle = numberOfVerticalTris > 8 ? 11 : 23;
}

let mobile = false;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) {
    mobile = true;
}
if (mobile == true && window.screen.orientation.angle == 0) {
    numberOfVerticalTris = 9;
    startTriangle = 33;
}
if (mobile == true && window.screen.orientation.angle > 0) {
    numberOfVerticalTris = 4;
    startTriangle = 45;
}

let player = new BufferPlayer(instrument);
let drawTriangles = new DrawTriangles(numberOfVerticalTris, instrument, player, startTriangle);

ctx.font = "16px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
let t;
let message;
(function timer() {
    ctx.fillStyle = "#4d4d4d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    message = "Loading sounds " + player.loading
        + " out of " + (player.max - player.min + 1) + "...";
    ctx.fillStyle = "white";
    ctx.fillText(message, canvas.width * 0.5, canvas.height * 0.3);
    t = setTimeout(timer, 10);
    if (player.loading == player.max - player.min + 1) {
        clearTimeout(t);
        start();
    }
})();

function start() {
    let triangles = drawTriangles.drawTriangles();
    new Events(triangles, player, instrument, drawTriangles.numberOfHorizontalTris);
}

function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        if (typeof query_string[key] === "undefined") {
            query_string[key] = decodeURIComponent(value);
        } else if (typeof query_string[key] === "string") {
            var arr = [query_string[key], decodeURIComponent(value)];
            query_string[key] = arr;
        } else {
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
}

