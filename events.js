export default class Events {

    constructor(triangles, sampler) {

        this.triangles = triangles;
        this.sampler = sampler;
        this.init();
    }
    init() {
        let triangles = this.triangles;
        let sampler = this.sampler;

        let isMouseDown = false;
        let previousTriangle = 0;
        let currentTriangle;
        canvas.addEventListener('mouseout', function (e) {
            if (previousTriangle != null) {
                sampler.stop(triangles[previousTriangle].getSound(), previousTriangle);
                triangles[previousTriangle].setSignOff();
                isMouseDown = false;
            }
        });
        canvas.addEventListener('mousedown', function (e) {
            previousTriangle = getCurrentTriangle(e.clientX, e.clientY);
            sampler.play(triangles[previousTriangle].getSound(), previousTriangle);
            triangles[previousTriangle].setSignOn();
            isMouseDown = true;
        });
        canvas.addEventListener('mousemove', function (e) {
            if (isMouseDown) {
                currentTriangle = getCurrentTriangle(e.clientX, e.clientY);
                if (currentTriangle != previousTriangle) {
                    sampler.stop(triangles[previousTriangle].getSound(), previousTriangle);
                    triangles[previousTriangle].setSignOff();
                    sampler.play(triangles[currentTriangle].getSound(), currentTriangle);
                    triangles[currentTriangle].setSignOn(), currentTriangle;
                    previousTriangle = currentTriangle;
                }
            }
        });
        canvas.addEventListener('mouseup', function (e) {
            sampler.stop(triangles[previousTriangle].getSound(), previousTriangle);
            triangles[previousTriangle].setSignOff();
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
                        sampler.play(triangles[currentTriangleSn].getSound(), currentTriangleSn);
                        triangles[currentTriangleSn].setSignOn();
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
                sampler.stop(triangles[oldTriangles[sn]].getSound(), oldTriangles[sn]);
                triangles[oldTriangles[sn]].setSignOff();
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
