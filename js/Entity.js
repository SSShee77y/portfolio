// Entity, Seeker, Evader classes

class Entity {
    constructor(pos, vel, col) {
        this.pos = pos;
        this.vel = vel;
        this.col = col;
        this.size = 16;
    }

    display() {
        this.drawTriangle(this.pos, this.vel);
    }

    wrapAround() {
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
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

// Vector Math

function vecAdd(vecA, vecB) {
    return {x: vecA.x + vecB.x, y: vecA.y + vecB.y};
}

function vecNeg(vec) {
    return {x: -vec.x, y: -vec.y};
}

function vecMul(vec, scalar) {
    return {x: vec.x * scalar, y: vec.y * scalar};
}