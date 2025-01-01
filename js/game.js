let evaders = [];
let points = 0;

let evaderVelocityFactor = 4.5;
let evaderVelocityVariance = 0.4;
let evaderSteeringFactor = 3;
let evaderDetectionRange = 100;

// Set up requirements
const homeDiv = document.getElementById("home");
const navDiv = document.getElementById("nav");
const gameCanvasHeight = homeDiv.offsetHeight + navDiv.offsetHeight;
let canvasElement = null;

function setup() {

    let gameCanvas = createCanvas(windowWidth, gameCanvasHeight);
    gameCanvas.id('p5-canvas');

    canvasElement = document.getElementById('p5-canvas');

    evaderVelocityFactor = width/1000 + 3;
    evaderDetectionRange = Math.min(500, width * height / 11000 + 100);
        
    // Create some Evaders with random positions and velocity
    let spawnLimit = Math.min(400, width * height / 6000 + 60);
    for (let i = 0; i < spawnLimit; i++) {
        let randomPos = createVector(random(width), random(height));
        let randomVel = p5.Vector.random2D().setMag(evaderVelocityFactor);
        evaders.push(new Evader(randomPos, randomVel));
    }
    
    // Display font
    textFont('JetBrains Mono', 20);
}

// Mouse reticle
const reticle = document.getElementById("reticle");
document.addEventListener('mousemove', (e) => {
    if (window.scrollY > gameCanvasHeight + evaderDetectionRange / 2) {
        return;
    }

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    reticle.style.left = `${mouseX - evaderDetectionRange/2}px`;
    reticle.style.top = `${mouseY - evaderDetectionRange/2 + window.scrollY}px`;
    reticle.style.width = `${evaderDetectionRange}px`;
    reticle.style.height = `${evaderDetectionRange}px`;
});

// Blur effect needed for nav links
const navLinks = document.querySelectorAll('#nav-links a');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        canvasElement.classList.add('blur');
        reticle.classList.remove('hidden');
    });

    link.addEventListener('mouseleave', () => {
        canvasElement.classList.remove('blur');
        reticle.classList.add('hidden');
    });
});

// On window resize
function windowResized() {
    resizeCanvas(windowWidth, homeDiv.offsetHeight + navDiv.offsetHeight);
    
    evaderVelocityFactor = width/1000 + 3;
    evaderDetectionRange = Math.min(500, width * height / 11000 + 100);
}

function draw() {
    if (window.scrollY > gameCanvasHeight + evaderDetectionRange / 2) {
        return;
    }
    
    background("#141213");
    frameRate(60);

    mouseSteering();

    strokeWeight(1);

    // Display evaders
    for (let evader of evaders) {
        evader.update();
        evader.display();
    }

    stroke(60);
    ellipse(mouseX, mouseY, evaderDetectionRange, evaderDetectionRange);
    
    // Light at pointer
    // strokeWeight(0);
    // let radius = evaderDetectionRange + 100;
    // for (let r = radius; r > 0; r -= evaderDetectionRange / radius * 20) {
    //     fill(150, 150, 150, 3);
    //     ellipse(mouseX, mouseY, r, r);
    // }
}

function mouseSteering() {
    // Evader steering and collision
    let mousePos = createVector(mouseX, mouseY);
    for (let i = evaders.length - 1; i >= 0; i--) {
        // Calculate direction of nearest mousePos
        let evader = evaders[i];
        let result = evader.getMousePos(mousePos);
        let dirVec = p5.Vector.sub(evader.pos, result.pos).normalize();
        
        angleMode(DEGREES);

        let detectionRange = evaderDetectionRange + 10;

        if (result.distance > detectionRange) {
            // Random steering
            evader.vel.rotate(radians(random(-evaderSteeringFactor, evaderSteeringFactor)));
            evader.panic = false;
        } else {
            // Calculate degree difference -> steering direction
            let diff = degreeDifference(evader.vel, dirVec);
            let steering = Math.max(Math.min(diff, evaderSteeringFactor), -evaderSteeringFactor);
    
            // Steer away from mouse
            evader.panic = true;
            evader.panicFac = (detectionRange - result.distance)/detectionRange;
            evader.vel.rotate(radians(evader.panicFac * steering * 6));
        }
    }
}

// Degree Difference between two vectors
// Positive for clockwise, negative for counterclockwise
function degreeDifference(vecA, vecB) {
    angleMode(DEGREES);
  
    return vecA.angleBetween(vecB);
}

// Gets wrapped positions
function getWrappedPositions(pos, borderDetection) {
    let positions = [];

    // Get wrapped on x
    if (pos.x > windowWidth - borderDetection) {
        positions.push(createVector(pos.x - windowWidth, pos.y));
        
        // Get wrapped of wrapped-x on y
        if (positions[0].y > windowHeight - borderDetection) {
            positions.push(createVector(positions[0].x, positions[0].y - windowHeight));
        } else if (positions[0].y < borderDetection) {
            positions.push(createVector(positions[0].x, positions[0].y + windowHeight));
        }
    } else if (pos.x < borderDetection) {
        positions.push(createVector(pos.x + windowWidth, pos.y));
        
        // Get wrapped of wrapped-x on y
        if (positions[0].y > windowHeight - borderDetection) {
            positions.push(createVector(positions[0].x, positions[0].y - windowHeight));
        } else if (positions[0].y < borderDetection) {
            positions.push(createVector(positions[0].x, positions[0].y + windowHeight));
        }
    }

    // Get wrapped on y
    if (pos.y > windowHeight - borderDetection) {
        positions.push(createVector(pos.x, pos.y - windowHeight));
    } else if (pos.y < borderDetection) {
        positions.push(createVector(pos.x, pos.y + windowHeight));
    }

    return positions;
}