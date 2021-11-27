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
            triangle: '',
            hexagon: this.drawHexagon
        }
        this.shape = 'hexagon'
        if (/Android|webOS|iPhone|iPod/i.test(navigator.userAgent))
            this.shape = 'hexagon'
        this.triangle
        this.hexagon
        this.text
        this.drawing = drawing
        this.draw()
    }

    draw = (color = this.color) => {
        this.drawTriangle()
        this.triangle.data('serNum', this.serNumOfTri)
        this.triangle.data('type', 'triangle')
        this.triangle.fill(color)
        this.triangle.attr({
            stroke: color === 'gray' ? '#999999' : '#808080',
            'stroke-width': 2
        })
        this.text()
        this.shapes[this.shape]()
        this.hexagon.data('serNum', this.serNumOfTri)
    }

    isPointInShape = (pointerX, pointerY) => {
        let inside = false
        inside = this.triangle.inside(pointerX, pointerY)
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
        let pointsOfTriangle = () => [
            [x1, y1],
            [x2, y2],
            [x3, y3]
        ]
        this.triangle = this.drawing.polygon(pointsOfTriangle())
    }

    drawHexagon = () => {
        let edge = this.edge * 0.98
        let diff = ((Math.sqrt(3) / 2) * (this.position * this.edge)) / 6
        let side = 0
        let size = edge / 3
        let y = this.y + diff
        let points = [this.x - size, y + size]
        for (side; side <= 6; side++) {
            points.push(this.x + size * Math.cos((side * 2 * Math.PI) / 6))
            points.push(y + size * Math.sin((side * 2 * Math.PI) / 6))
        }
        this.hexagon = this.drawing.polygon(points).fill('gray').opacity(0.2)
        this.hexagon.data('type', 'hexagon')
    }

    text = () => {
        let color = this.color
        let shift = (this.position * this.edge) / 10
        this.text = this.drawing
            .text(this.noteName + ((this.pitch - (this.pitch % 12)) / 12 - 1))
            .x(this.x)
            .y(this.y + shift - 600 / this.edge)
            .fill('none')
            .font({
                family: 'Arial',
                size: this.edge / 5,
                anchor: 'middle',
                stroke: color == 'gray' ? '#999999' : '#808080',
                'stroke-width': 0.5
            })
        if (this.pitch === 69) {
            this.text.stroke('red')
        }
    }

    getSound = () => {
        return this.pitch
    }

    setSignOn = () => {
        let color
        if (this.color != 'gray') {
            color = this.color == 'white' ? '#ffcccc' : '#660000'
            this.triangle.fill(color)
        }
    }

    setSignOff = () => {
        this.triangle.fill(this.color)
    }
}
