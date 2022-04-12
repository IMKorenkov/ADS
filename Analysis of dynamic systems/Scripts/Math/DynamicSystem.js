function Point(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
}

function DynamicalSystems(fx, fy, fz) {
    this.name = "";
    this.fx = fx;
    this.fy = fy;
    this.fz = fz;
    this.params = new Object();
    this.CONST_H = 0.001;

    this.getValue = function (p) {
        var newPoint = new Point(p.x, p.y, p.z);
        newPoint.x = this.fx(point.x);
        newPoint.y = this.fx(point.y);
        newPoint.z = this.fx(point.z);
    }

    this.getNextPoint = function (p) {
        var newPoint = new Point(p.x, p.y, p.z);

        var k1x = this.fx(p);
        var k1y = this.fy(p);
        var k1z = this.fz(p);

        var k2x = this.fx(new Point(p.x + this.CONST_H / 2, p.y + (this.CONST_H * k1y) / 2, p.z + (this.CONST_H * k1z) / 2));
        var k2y = this.fy(new Point(p.x + (this.CONST_H * k1x) / 2, p.y + this.CONST_H / 2, p.z + (this.CONST_H * k1z) / 2));
        var k2z = this.fz(new Point(p.x + (this.CONST_H * k1x) / 2, p.y + (this.CONST_H * k1y) / 2, p.z + this.CONST_H / 2));

        var k3x = this.fx(new Point(p.x + this.CONST_H / 2, p.y + (this.CONST_H * k2y) / 2, p.z + (this.CONST_H * k2z) / 2));
        var k3y = this.fy(new Point(p.x + (this.CONST_H * k2x) / 2, p.y + this.CONST_H / 2, p.z + (this.CONST_H * k2z) / 2));
        var k3z = this.fz(new Point(p.x + (this.CONST_H * k2x) / 2, p.y + (this.CONST_H * k2y) / 2, p.z + this.CONST_H / 2));

        var k4x = this.fx(new Point(p.x + this.CONST_H, p.y + (this.CONST_H * k3y), p.z + (this.CONST_H * k3z)));
        var k4y = this.fy(new Point(p.x + (this.CONST_H * k3x), p.y + this.CONST_H, p.z + (this.CONST_H * k3z)));
        var k4z = this.fz(new Point(p.x + (this.CONST_H * k3x), p.y + (this.CONST_H * k3y), p.z + this.CONST_H));

        newPoint.x = p.x + this.CONST_H / 6 * (k1x + 2 * k2x + 2 * k3x + k4x);
        newPoint.y = p.y + this.CONST_H / 6 * (k1y + 2 * k2y + 2 * k3y + k4y);
        newPoint.z = p.z + this.CONST_H / 6 * (k1z + 2 * k2z + 2 * k3z + k4z);

        return newPoint;
    }

    this.getLyapynovExponent = function () {
        let EPSILON = 0.001,
            p = new Point(0.2, 0, 0),
            pc = new Point(0.2, 0 + EPSILON, 0),
            s = 0,
            countPoints = 1000000,
            l = 1;
        for(let i = 0; i < countPoints; i++){
            p = this.getNextPoint(p);
            pc = this.getNextPoint(pc);
            pc.x -= p.x; pc.y -= p.y; pc.z -= p.z;
            l = pc.length();
            s += Math.log(l/EPSILON);
            pc.x = p.x + pc.x/l*EPSILON;
            pc.y = p.y + pc.y/l*EPSILON;
            pc.z = p.z + pc.z/l*EPSILON;
        }
        return s/(countPoints*EPSILON);
    };
}