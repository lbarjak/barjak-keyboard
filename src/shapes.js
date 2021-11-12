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
        this.poly.data('sn', this.serNumOfTri)
        this.poly.fill(color)
        this.poly.attr({
            stroke: color == 'gray' ? '#999999' : '#808080',
            'stroke-width': 2
        })

        /*         ctx.font = this.edge / 5 + 'px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.lineWidth = 1
        let shift = (this.position * this.edge) / 10
        ctx.strokeText(
            this.noteName + ((this.pitch - (this.pitch % 12)) / 12 - 1),
            this.x,
            this.y + shift
        )
        ctx.fillStyle = color
        ctx.fillText(
            this.noteName + ((this.pitch - (this.pitch % 12)) / 12 - 1),
            this.x,
            this.y + shift
        ) */

        //this.onlyDevelopDrawShape()
    }

    onlyDevelopDrawShape = () => {
        this.shapes[this.shape]()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'red'
        ctx.stroke()
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

    // drawCircle = () => {
    //     let radiusMax = parseInt(heightOfTriangle / 3)
    //     let heightOfTriangle = parseInt((this.edge * Math.sqrt(3)) / 2)
    //     let differenceOfCenterOfTriangle =
    //         this.position * (heightOfTriangle / 2 - radiusMax)
    //     ctx.beginPath()
    //     ctx.arc(
    //         this.x,
    //         this.y + differenceOfCenterOfTriangle,
    //         0.98 * radiusMax,
    //         0,
    //         2 * Math.PI,
    //         false
    //     )
    //     ctx.closePath()
    // }

    // drawHexagon = () => {
    //     let edge = this.edge * 0.98
    //     let diff = ((Math.sqrt(3) / 2) * (this.position * this.edge)) / 6
    //     let side = 0
    //     let size = edge / 3
    //     let y = this.y + diff
    //     ctx.moveTo(this.x - size, y + size)
    //     ctx.beginPath()
    //     for (side; side <= 6; side++) {
    //         ctx.lineTo(
    //             this.x + size * Math.cos((side * 2 * Math.PI) / 6),
    //             y + size * Math.sin((side * 2 * Math.PI) / 6)
    //         )
    //     }
    //     ctx.closePath()
    // }

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
