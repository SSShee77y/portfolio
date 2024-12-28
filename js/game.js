let chasers = [];
let evaders = [];
let obstacles = [];
let points = 0;

const chaserVelocityFactor = 3;
const chaserVelocityVariance = 1;
const chaserSteeringFactor = 3;

const evaderVelocityFactor = 6.1;
const evaderVelocityVariance = 0;
const evaderSteeringFactor = 5;

function setup() {
    createCanvas(windowWidth, windowHeight-60);
    
    // Create some Chasers with random positions
    for (let i = 0; i < 50; i++) {
        let randomPos = {x: random(width), y: random(height)};
        let randomVel = vecMul(randomUnitVector(), 
                            random(chaserVelocityFactor - chaserVelocityVariance,
                            chaserVelocityFactor + chaserVelocityVariance));
        chasers.push(new Chaser(randomPos, randomVel));
    }
    
    // Create some Evaders with random positions and velocity
    for (let i = 0; i < 1; i++) {
        let randomPos = {x: random(width), y: random(height)};
        let randomVel = vecMul(randomUnitVector(),
                            random(evaderVelocityFactor - evaderVelocityVariance,
                            evaderVelocityFactor + evaderVelocityVariance));
        evaders.push(new Evader(randomPos, randomVel));
    }
    
    // Create some Obstacles
    // obstacles.push(new Obstacle(300, 300, 50));
    
    // Display font
    textFont('JetBrains Mono', 20);
}

function draw() {
    background("#0D0A08");
    frameRate(60);
    strokeWeight(1);

    steering();
    
    // Display chaser
    for (let chaser of chasers) {
        chaser.update();
        chaser.display();
    }

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
    // Evader steering and collision
    for (let i = evaders.length - 1; i >= 0; i--) {
        // Calculate direction of nearest chaser
        let evader = evaders[i];
        let result = evader.getClosestEntity(chasers);
        let dirVec = vecAdd(evader.pos, vecNeg(result.pos));
        let distance = vecMag(dirVec);

        // Check if collided with chaser, if so -> dead
        if (distance < result.entity.size / 2) {
            evaders.splice(i, 1);

            let randomPos = {x: random(width), y: -50};
            let randomVel = vecMul(randomUnitVector(),
                                random(evaderVelocityFactor - evaderVelocityVariance,
                                evaderVelocityFactor + evaderVelocityVariance));
            evaders.push(new Evader(randomPos, randomVel));
            continue;
        } else if (distance > 200) {
            evader.vel = rotateVector(evader.vel, random(-evaderSteeringFactor, evaderSteeringFactor));
            continue
        }
        
        // Calculate degree difference -> steering direction
        let diff = degreeDifference(evader.vel, dirVec);
        let steering = Math.max(Math.min(diff, evaderSteeringFactor), -evaderSteeringFactor);

        evader.vel = rotateVector(evader.vel, steering);
    }

    // Chaser steering and collision
    for (let i = 0; i < chasers.length; i++) {
        // Calculate direction of nearest evader
        let chaser = chasers[i];
        let evaderPos = chaser.getClosestEntity(evaders).pos;
        let dirVec = vecAdd(evaderPos, vecNeg(chaser.pos));
        let distance = vecMag(dirVec);
        if (distance > 200) {

            chaser.vel = rotateVector(chaser.vel, random(-chaserSteeringFactor, chaserSteeringFactor));
        } else {

            // Calculate degree difference -> steering direction
            let diff = degreeDifference(chaser.vel, dirVec);
            let steering = Math.max(Math.min(diff, chaserSteeringFactor), -chaserSteeringFactor);

            chaser.vel = rotateVector(chaser.vel, steering);
        }
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

function vecMag(vec) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
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
