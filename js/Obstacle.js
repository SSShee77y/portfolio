// Obstacle class

class Obstacle {
    constructor(x, y, radius) {
        this.pos = {x: x, y: y};
        this.radius = radius;
    }

    display() {
        stroke(255);
        noFill();
        ellipse(this.pos.x, this.pos.y, this.radius * 2);
    }
}