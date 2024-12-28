let chaser;
let evaders = [];
let obstacles = [];
let points = 0;

function setup() {
    createCanvas(windowWidth, windowHeight-60);
    
    // Initialize Chaser
    chaser = new Seeker({x: width / 2, y: height / 2}, {x: 1, y: 1});
    
    // Create some Evaders with random positions and directions
    for (let i = 0; i < 3; i++) {
        let randomPos = {x: random(width), y: random(height)};
        let randomVel = {x: random(-0.7, 0.7), y: random(-0.7, 0.7)};
        evaders.push(new Evader(randomPos, randomVel));
    }
    
    // Create some Obstacles
    // obstacles.push(new Obstacle(300, 300, 50));
    
    // Display font
    textFont('JetBrains Mono', 20);
}

function draw() {
    background("#0D0A08");
    strokeWeight(1);
    
    // Display objects and entities
    chaser.display();

    for (let evader of evaders) {
        evader.display();
    }

    for (let obs of obstacles) {
        obs.display();
    }
    
    // Check if chaser catches any evader
    for (let i = evaders.length - 1; i >= 0; i--) {
        if (chaser.hits(evaders[i])) {
            evaders.splice(i, 1);  // Remove the caught evader
            points++;  // Increase points
        }
    }
    
    // Display points
    fill(210);
    strokeWeight(0);
    text('Points: ' + points, width/2 - 54, 120);
}