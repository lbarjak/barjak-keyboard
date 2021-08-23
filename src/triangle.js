export default class Triangle {
    static drawTriangle(x1, y1, x2, y2, x3, y3, color, noteName, pitch, x,  y, pos) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
        ctx.lineWidth = 2
        // color == 'gray' 
        //     ? ctx.strokeStyle = '#999999' 
        //     : ctx.strokeStyle = '#808080'
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.stroke()
        ctx.font = (x2 - x1) * 0.4 + 'px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // color == 'gray'
        //     ? ctx.strokeStyle = '#999999'
        //     : ctx.strokeStyle = '#808080'
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.lineWidth = 1
        let shift = (pos * (x2 - x1)) / 5
        ctx.strokeText(
            noteName + ((pitch - (pitch % 12)) / 12 - 1),
            x,
            y + shift
        )
        ctx.fillStyle = color
        ctx.fillText(noteName + ((pitch - (pitch % 12)) / 12 - 1), x, y + shift)
    }
    static drawTriangleSign(x1, y1, x2, y2, x3, y3, color, noteName, n, x, y, pos) {
        if (color != 'gray') {
            color = color == 'white' ? '#ffcccc' : '#660000'
            Triangle.drawTriangle(x1, y1, x2, y2, x3, y3, color, noteName, n, x, y, pos)
        }
    }
    static isPointInTriangle(x1, y1, x2, y2, x3, y3, pointerX, pointerY) {
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.closePath()
        if (ctx.isPointInPath(pointerX, pointerY)) {
            return true
        }
        return false
    }
    static edgeOfTriangle

    static getTriangle(triangleCenterX, triangleCenterY, mirroring, noteName, color, pitch, countOfTriangles) {
        return new Triangle(triangleCenterX, triangleCenterY, mirroring, noteName, color, pitch, countOfTriangles)
    }

    constructor(centerX, centerY, mirroring, noteName, color, pitch, countOfTris) {
        this.x = Math.round(centerX)
        this.y = Math.round(centerY)
        this.edge = Math.round(Triangle.edgeOfTriangle)
        this.position = mirroring
        this.noteName = noteName
        this.color = color
        this.pitch = pitch
        this.serNumOfTri = countOfTris
        this.x1 = Math.round(centerX - Triangle.edgeOfTriangle / 2)
        this.x2 = Math.round(centerX)
        this.x3 = Math.round(centerX + Triangle.edgeOfTriangle / 2)
        let height = Math.round((Triangle.edgeOfTriangle * Math.sqrt(3)) / 2)
        this.y1 = Math.round(centerY + (mirroring * height) / 2)
        this.y2 = Math.round(centerY - (mirroring * height) / 2)
        this.y3 = this.y1
        Triangle.drawTriangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.color, this.noteName, this.pitch, this.x, this.y, this.position)
    }

    getCurrentTriangle(x, y) {
        if (
            Triangle.isPointInTriangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, x, y)
        ) {
            return this.serNumOfTri
        }
        return -1
    }

    getSound() {
        return this.pitch
    }

    setSignOn() {
        Triangle.drawTriangleSign(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.color, this.noteName, this.pitch, this.x, this.y, this.position)
    }

    setSignOff() {
        Triangle.drawTriangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.color, this.noteName, this.pitch, this.x, this.y, this.position)
    }
}
