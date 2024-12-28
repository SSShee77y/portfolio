let chaser;
let evaders = [];
let obstacles = [];
let points = 0;

function setup() {
    createCanvas(windowWidth, windowHeight-60);
    
    // Initialize Chaser
    chaser = new Seeker({x: width / 2, y: height / 2}, vecMul(randomUnitVector(), 4));
    
    // Create some Evaders with random positions and directions
    for (let i = 0; i < 10; i++) {
        let randomPos = {x: random(width), y: random(height)};
        let randomVel = vecMul(randomUnitVector(), 4);
        evaders.push(new Evader(randomPos, randomVel));
    }
    
    // Create some Obstacles
    // obstacles.push(new Obstacle(300, 300, 50));
    
    // Display font
    textFont('JetBrains Mono', 20);
}

function draw() {
    background("#0D0A08");
    // frameRate(30);
    strokeWeight(1);

    steering();
    
    // Display chaser
    chaser.update();
    chaser.display();

    // Display fog of war, evaders, and obstacles
    // fow();
    for (let evader of evaders) {
        evader.update();
        evader.display();
    }
    for (let obs of obstacles) {
        obs.display();
    }
    
}


function fow() {
    
}

function steering() {
    // Evader steering
    for (let i = 0; i < evaders.length; i++) {
        let evader = evaders[i];
        let diff = degreeDifference(evader.vel, vecAdd(evader.pos, vecNeg(chaser.pos)));
        let steering = Math.max(Math.min(diff, 2), -2);

        evader.vel = rotateVector(evader.vel, steering);
    }
}

//
// Vector Functions
//

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

// Degree Difference between two vectors
// Positive for clockwise, negative for counterclockwise
function degreeDifference(vecA, vecB) {
    // Calculate dot product and cross product
    const dot = vecA.x * vecB.x + vecA.y * vecB.y;
    const cross = vecA.x * vecB.y - vecA.y * vecB.x;
  
    // Find angle in radians, then convert to degrees
    const angleInRadians = Math.atan2(cross, dot);
    const angleInDegrees = angleInRadians * (180 / Math.PI);
  
    return angleInDegrees;
}

// Rotate a vector by the given degrees
function rotateVector(vec, degrees) {
    const radians = degrees * (Math.PI / 180);
    const cosTheta = Math.cos(radians);
    const sinTheta = Math.sin(radians);
    
    return {
      x: vec.x * cosTheta - vec.y * sinTheta,
      y: vec.x * sinTheta + vec.y * cosTheta
    };
}

// Generates a random unit vector
function randomUnitVector() {
    const angle = Math.random() * 2 * Math.PI;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
}
