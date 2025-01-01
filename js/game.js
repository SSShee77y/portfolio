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

    evaderVelocityFactor = Math.min(2.5, width/1200 + 3);
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

// On window resize
function windowResized() {
    resizeCanvas(windowWidth, homeDiv.offsetHeight + navDiv.offsetHeight);
    
    evaderVelocityFactor = Math.min(10, width/1200 + 3);
    evaderDetectionRange = Math.min(500, width * height / 11000 + 100);
}

// Mouse reticle
const reticle = document.getElementById("reticle");
let reticleHover = false;

document.addEventListener('mousemove', (e) => {
    if (window.scrollY > gameCanvasHeight + evaderDetectionRange / 2) {
        return;
    }

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    reticle.style.transform = `translate(${mouseX - evaderDetectionRange/2}px, ${mouseY - evaderDetectionRange/2 + window.scrollY}px)` + (reticleHover ? ` scale(.93)` : ``);
    
    reticle.style.width = `${evaderDetectionRange}px`;
    reticle.style.height = `${evaderDetectionRange}px`;
});

// Blur effect needed for nav links
const navLinks = document.querySelectorAll('#nav-links a');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        canvasElement.classList.add('blur');
        reticle.classList.add('glow');
        reticleHover = true;
    });

    link.addEventListener('mouseleave', () => {
        canvasElement.classList.remove('blur');
        reticle.classList.remove('glow');
        reticleHover = false;
    });
});

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
}

function mouseSteering() {
    // Evader steering and collision
    let mousePos = createVector(mouseX, mouseY);
    for (let i = evaders.length - 1; i >= 0; i--) {
        // Calculate direction of nearest mousePos
        let evader = evaders[i];
        let distance = p5.Vector.dist(evader.pos, mousePos);
        let dirVec = p5.Vector.sub(evader.pos, mousePos).normalize();
        
        angleMode(DEGREES);

        let detectionRange = evaderDetectionRange - 30;

        if (distance > detectionRange) {
            // Random steering
            evader.vel.rotate(radians(random(-evaderSteeringFactor, evaderSteeringFactor)));
            evader.panic = false;
        } else {
            // Calculate degree difference -> steering direction
            let diff = degreeDifference(evader.vel, dirVec);
            let steering = Math.max(Math.min(diff, evaderSteeringFactor), -evaderSteeringFactor);
    
            // Steer away from mouse
            evader.panic = true;
            evader.panicFac = (detectionRange - distance)/detectionRange;
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