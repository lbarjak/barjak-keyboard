export default class Shapes {
    constructor(triangleParams, drawing) {
        this.x = Math.round(triangleParams.triangleCenterX)
        this.y = Math.round(triangleParams.triangleCenterY)
        this.edge = Math.round(triangleParams.edgeOfTriangle)
        this.position = triangleParams.mirroring
        this.noteName = triangleParams.noteName
        this.color = triangleParams.color
        this.pitch = triangleParams.pitch
        this.serNumOfTri = triangleParams.serNumOfTri
        this.shapes = {
            triangle: this.drawTriangle,
            circle: this.drawCircle,
            hexagon: this.drawHexagon
        }
        this.shape = 'triangle'
        if (/Android|webOS|iPhone|iPod/i.test(navigator.userAgent))
            this.shape = 'triangle'
        this.poly
        this.drawing = drawing
        this.draw()
    }

    draw = (color = this.color) => {
        this.drawTriangle()
        this.poly.data('serNum', this.serNumOfTri)
        this.poly.data('noteName', this.noteName)
        this.poly.fill(color)
        this.poly.attr({
            stroke: color == 'gray' ? '#999999' : '#808080',
            'stroke-width': 2
        })
    }

    drawTriangleSign = () => {
        let color
        if (this.color != 'gray') {
            color = this.color == 'white' ? '#ffcccc' : '#660000'
            this.poly.fill(color)
        }
    }

    isPointInShape = (pointerX, pointerY) => {
        let inside = false
        inside = this.poly.inside(pointerX, pointerY)
        if (inside) return true
        return false
    }

    drawTriangle = () => {
        let x1 = Math.round(this.x - this.edge / 2)
        let x2 = this.x
        let x3 = Math.round(this.x + this.edge / 2)
        let height = Math.round((this.edge * Math.sqrt(3)) / 2)
        let y1 = Math.round(this.y + (this.position * height) / 2)
        let y2 = Math.round(this.y - (this.position * height) / 2)
        let y3 = y1
        let triangle = () => [
            [x1, y1],
            [x2, y2],
            [x3, y3]
        ]
        this.poly = this.drawing.polygon(triangle())
    }

    // getCurrentTriangle = (x, y) => {
    //     if (this.isPointInShape(x, y)) {
    //         return this.serNumOfTri
    //     }
    //     return -1
    // }

    getSound = () => {
        return this.pitch
    }

    setSignOn = () => {
        this.drawTriangleSign()
    }

    setSignOff = () => {
        this.poly.fill(this.color)
    }
}
