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
        ctx.fillText(
            this.noteName + ((this.pitch - (this.pitch % 12)) / 12 - 1),
            this.x,
            this.y + shift
        )
    }
    drawTriangleSign = () => {
        let color
        if (this.color != 'gray') {
            color = this.color == 'white' ? '#ffcccc' : '#660000'
            this.drawTriangle(color)
        }
    }

    isPointInTriangle = (pointerX, pointerY) => {
        this.isPointInCircleInTriangle(pointerX, pointerY)
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

    isPointInCircleInTriangle = (pointerX, pointerY) => {
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
        if (ctx.isPointInPath(pointerX, pointerY)) {
            return true
        }
        return false
    }

    getCurrentTriangle = (x, y) => {
        if (this.isPointInTriangle(x, y)) {
            return this.serNumOfTri
        }
        return -1
    }

    getCurrentTriangleCircle = (x, y) => {
        if (this.isPointInCircleInTriangle(x, y)) {
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
