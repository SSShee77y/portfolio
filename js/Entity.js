// Entity, Seeker, Evader classes

class Entity {
    constructor(pos, vel, col) {
        this.pos = pos;
        this.vel = vel;
        this.col = col;
        this.size = 20;
    }

    display() {
        this.drawTriangle(this.pos, this.vel);
    }

    update() {
        this.pos = vecAdd(this.pos, this.vel);
        this.wrapAround();
    }

    wrapAround() {
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }

    hits(otherEntity) {
        let d = dist(this.pos.x, this.pos.y, otherEntity.pos.x, otherEntity.pos.y);
        return d < this.size;
    }

    // Draw an isosceles triangle for the entity
    drawTriangle(pos, vel) {
        const velMag = Math.sqrt(Math.pow(vel.x, 2) + Math.pow(vel.y, 2));
        const dir = vecMul(vel, this.size/velMag);
        const v1 = vecAdd(pos, dir);
        const v2 = vecAdd({x: pos.x - dir.y * 0.65, y: pos.y + dir.x * 0.65}, vecNeg(vecMul(dir, 0.7)));
        const v3 = vecAdd({x: pos.x + dir.y * 0.65, y: pos.y - dir.x * 0.65}, vecNeg(vecMul(dir, 0.7)));

        stroke(this.col);
        noFill();
        triangle(v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
        line(pos.x, pos.y, v1.x, v1.y);
    }
}

class Seeker extends Entity {
    constructor(pos, vel) {
        super(pos, vel, color("#00e0e0"));
    }
}

class Evader extends Entity {
    constructor(pos, vel) {
        super(pos, vel, color(255));
    }
}