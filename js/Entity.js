// Entity, Seeker, Evader classes

class Entity {
    constructor(pos, vel, col) {
        this.pos = pos;
        this.vel = vel;
        this.col = col;
        this.size = 20;
        this.panic = false;
        this.panicFac = 0;
    }

    display() {
        this.drawTriangle(this.pos, this.vel);
        // stroke(110);
        // noFill();
        // ellipse(this.pos.x, this.pos.y, evaderDetectionRange);
    }

    update() {
        this.pos.add(p5.Vector.mult(this.vel, (this.panic ? 1 + this.panicFac * 3 : 1)));
        this.wrapAround();
    }

    wrapAround() {
        if (this.pos.x > width + this.size + evaderDetectionRange / 2) this.pos.x = - this.size - evaderDetectionRange / 2;
        if (this.pos.x < 0 - this.size - evaderDetectionRange / 2) this.pos.x = width + this.size + evaderDetectionRange / 2;
        if (this.pos.y > height + this.size + evaderDetectionRange / 2) this.pos.y = - this.size - evaderDetectionRange / 2;
        if (this.pos.y < 0 - this.size - evaderDetectionRange / 2) this.pos.y = height + this.size + evaderDetectionRange / 2;
    }

    // Draw an isosceles triangle for the entity
    drawTriangle(pos, vel) {
        const dir = p5.Vector.normalize(vel).setMag(this.size);
        const pos1 = p5.Vector.add(dir, pos);
        const pos2 = p5.Vector.add(p5.Vector.rotate(dir, -PI*0.78), pos);
        const pos3 = p5.Vector.add(p5.Vector.rotate(dir, PI*0.78), pos);

        stroke(this.col);

        // let angleDegrees = Math.atan2(dir.x, dir.y) * (180 / Math.PI);
        // colorMode(HSB);
        // stroke(Math.abs(angleDegrees) / 1.5, 60, 65);
        colorMode(RGB);

        noFill();
        triangle(pos1.x, pos1.y, pos2.x, pos2.y, pos3.x, pos3.y)
        // line(pos.x, pos.y, v1.x, v1.y);
    }
}

class Chaser extends Entity {
    constructor(pos, vel) {
        super(pos, vel, color("#00efff"));
    }
}

class Evader extends Entity {
    constructor(pos, vel) {
        super(pos, vel, color(60));
    }
}