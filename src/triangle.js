export default class Triangle {
    constructor(triangleParams) {
        this.x = Math.round(triangleParams.triangleCenterX)
        this.y = Math.round(triangleParams.triangleCenterY)
        this.edge = Math.round(triangleParams.edgeOfTriangle)
        this.position = triangleParams.mirroring
        this.noteName = triangleParams.noteName
        this.color = triangleParams.color
        this.pitch = triangleParams.pitch
        this.serNumOfTri = triangleParams.countOfTriangles
        this.triangle = {}
        this.triangle.x1 = Math.round(
            triangleParams.triangleCenterX - triangleParams.edgeOfTriangle / 2
        )
        this.triangle.x2 = this.x
        this.triangle.x3 = Math.round(
            triangleParams.triangleCenterX + triangleParams.edgeOfTriangle / 2
        )
        let height = Math.round(
            (triangleParams.edgeOfTriangle * Math.sqrt(3)) / 2
        )
        this.triangle.y1 = Math.round(
            triangleParams.triangleCenterY +
                (triangleParams.mirroring * height) / 2
        )
        this.triangle.y2 = Math.round(
            triangleParams.triangleCenterY -
                (triangleParams.mirroring * height) / 2
        )
        this.triangle.y3 = this.triangle.y1
        this.shapes = {
            triangle: this.drawTriangle,
            circle: this.drawCircle,
            hexagon: this.drawHexagon
        }
        this.shape = 'hexagon'
        console.log(this.triangle.x2 - this.triangle.x1)
        console.log(this.edge)
        this.draw()
    }

    draw = (color = this.color) => {
        this.drawTriangle()
        ctx.fillStyle = color
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = color == 'gray' ? '#999999' : '#808080'
        ctx.stroke()

        ctx.font = this.edge / 5 + 'px Arial'
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
        )
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
            this.draw(color)
        }
    }

    isPointInShape = (pointerX, pointerY) => {
        this.shapes[this.shape]()
        if (ctx.isPointInPath(pointerX, pointerY)) {
            return true
        }
        return false
    }

    drawTriangle = () => {
        ctx.beginPath()
        ctx.moveTo(this.triangle.x1, this.triangle.y1)
        ctx.lineTo(this.triangle.x2, this.triangle.y2)
        ctx.lineTo(this.triangle.x3, this.triangle.y3)
        ctx.closePath()
    }

    drawCircle = () => {
        let reducer = 0.98
        let heightOfTriangle = parseInt((this.edge * Math.sqrt(3)) / 2)
        let radiusMax = parseInt(heightOfTriangle / 3)
        let differenceOfCenterOfTriangle =
            this.position * (heightOfTriangle / 2 - radiusMax)
        let radius = radiusMax * reducer
        ctx.beginPath()
        ctx.arc(
            this.x,
            this.y + differenceOfCenterOfTriangle,
            radius,
            0,
            2 * Math.PI,
            false
        )
        ctx.closePath()
    }

    drawHexagon = () => {
        let edge = this.edge * 0.98
        let diff = ((Math.sqrt(3) / 2) * (this.position * this.edge)) / 6
        let side = 0
        let size = edge / 3
        let y = this.y + diff
        ctx.moveTo(this.x - size, y + size)
        ctx.beginPath()
        for (side; side <= 6; side++) {
            ctx.lineTo(
                this.x + size * Math.cos((side * 2 * Math.PI) / 6),
                y + size * Math.sin((side * 2 * Math.PI) / 6)
            )
        }
        ctx.closePath()
    }

    getCurrentTriangle = (x, y) => {
        if (this.isPointInShape(x, y)) {
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
        this.draw()
    }
}
