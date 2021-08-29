export default class Triangle {

    constructor(centerX, centerY, mirroring, noteName, color, pitch, countOfTris, edgeOfTriangle) {
        this.x = Math.round(centerX)
        this.y = Math.round(centerY)
        this.edge = Math.round(edgeOfTriangle)
        this.position = mirroring
        this.noteName = noteName
        this.color = color
        this.pitch = pitch
        this.serNumOfTri = countOfTris
        this.triangle = {}
        this.triangle.x1 = Math.round(centerX - edgeOfTriangle / 2)
        this.triangle.x2 = Math.round(centerX)
        this.triangle.x3 = Math.round(centerX + edgeOfTriangle / 2)
        let height = Math.round((edgeOfTriangle * Math.sqrt(3)) / 2)
        this.triangle.y1 = Math.round(centerY + (mirroring * height) / 2)
        this.triangle.y2 = Math.round(centerY - (mirroring * height) / 2)
        this.triangle.y3 = this.triangle.y1
        this.drawTriangle()
    }

    drawTriangle = (color = this.color) => {
        ctx.beginPath()
        ctx.moveTo(this.triangle.x1, this.triangle.y1)
        ctx.lineTo(this.triangle.x2, this.triangle.y2)
        ctx.lineTo(this.triangle.x3, this.triangle.y3)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.stroke()
        ctx.font = (this.triangle.x2 - this.triangle.x1) * 0.4 + 'px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.lineWidth = 1
        let shift = (this.position * (this.triangle.x2 - this.triangle.x1)) / 5
        ctx.strokeText(
            this.noteName + ((this.pitch - (this.pitch % 12)) / 12 - 1),
            this.x,
            this.y + shift
        )
        ctx.fillStyle = color
        ctx.fillText(this.noteName + ((this.pitch - (this.pitch % 12)) / 12 - 1), this.x, this.y + shift)
    }
    drawTriangleSign = () => {
        let color
        if (this.color != 'gray') {
            color = this.color == 'white' ? '#ffcccc' : '#660000'
            this.drawTriangle(color)
        }
    }

    isPointInTriangle = (pointerX, pointerY) => {
        ctx.beginPath()
        ctx.moveTo(this.triangle.x1, this.triangle.y1)
        ctx.lineTo(this.triangle.x2, this.triangle.y2)
        ctx.lineTo(this.triangle.x3, this.triangle.y3)
        ctx.closePath()
        if (ctx.isPointInPath(pointerX, pointerY)) {
            return true
        }
        return false
    }

    getCurrentTriangle = (x, y) => {
        if (
            this.isPointInTriangle(x, y)
        ) {
            return this.serNumOfTri
        }
        return -1
    }

    getSound = () => {
        return this.pitch
    }

    setSignOn = () => {
        this.drawTriangleSign()
    }

    setSignOff = () => {
        this.drawTriangle()
    }
}
