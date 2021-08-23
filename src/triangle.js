export default class Triangle {
    static drawTriangle(triangle, color, noteName, pitch, x,  y, pos) {
        ctx.beginPath()
        ctx.moveTo(triangle.x1, triangle.y1)
        ctx.lineTo(triangle.x2, triangle.y2)
        ctx.lineTo(triangle.x3, triangle.y3)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.stroke()
        ctx.font = (triangle.x2 - triangle.x1) * 0.4 + 'px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.lineWidth = 1
        let shift = (pos * (triangle.x2 - triangle.x1)) / 5
        ctx.strokeText(
            noteName + ((pitch - (pitch % 12)) / 12 - 1),
            x,
            y + shift
        )
        ctx.fillStyle = color
        ctx.fillText(noteName + ((pitch - (pitch % 12)) / 12 - 1), x, y + shift)
    }
    static drawTriangleSign(triangle, color, noteName, n, x, y, pos) {
        if (color != 'gray') {
            color = color == 'white' ? '#ffcccc' : '#660000'
            Triangle.drawTriangle(triangle, color, noteName, n, x, y, pos)
        }
    }
    static isPointInTriangle(triangle, pointerX, pointerY) {
        ctx.beginPath()
        ctx.moveTo(triangle.x1, triangle.y1)
        ctx.lineTo(triangle.x2, triangle.y2)
        ctx.lineTo(triangle.x3, triangle.y3)
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
        this.triangle = {}
        this.triangle.x1 = Math.round(centerX - Triangle.edgeOfTriangle / 2)
        this.triangle.x2 = Math.round(centerX)
        this.triangle.x3 = Math.round(centerX + Triangle.edgeOfTriangle / 2)
        let height = Math.round((Triangle.edgeOfTriangle * Math.sqrt(3)) / 2)
        this.triangle.y1 = Math.round(centerY + (mirroring * height) / 2)
        this.triangle.y2 = Math.round(centerY - (mirroring * height) / 2)
        this.triangle.y3 = this.triangle.y1
        Triangle.drawTriangle(this.triangle, this.color, this.noteName, this.pitch, this.x, this.y, this.position)
    }

    getCurrentTriangle(x, y) {
        if (
            Triangle.isPointInTriangle(this.triangle, x, y)
        ) {
            return this.serNumOfTri
        }
        return -1
    }

    getSound() {
        return this.pitch
    }

    setSignOn() {
        Triangle.drawTriangleSign(this.triangle, this.color, this.noteName, this.pitch, this.x, this.y, this.position)
    }

    setSignOff() {
        Triangle.drawTriangle(this.triangle, this.color, this.noteName, this.pitch, this.x, this.y, this.position)
    }
}
