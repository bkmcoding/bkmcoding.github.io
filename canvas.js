const trailCanvas = document.getElementById('trailCanvas');
const armCanvas = document.getElementById('armCanvas');
const trailCtx = trailCanvas.getContext('2d');
const armCtx = armCanvas.getContext('2d');

const cx = armCanvas.width / 2;
const cy = armCanvas.height / 2;

// Length of both arms
const R = 120; 

// Theta is time/angle
// Speed is measured in radians per millisecond
let theta = 0;
const speed = 0.0018; 

// Starting positions for arms
let lastX = cx + R + R; 
let lastY = cy;

let lastTime = 0;

function draw(timestamp) {
    if (!lastTime) lastTime = timestamp;
    
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear arms
    armCtx.clearRect(0, 0, armCanvas.width, armCanvas.height);

    // angle1 moves at speed theta. angle2 moves at speed Pi * theta.
    let angle1 = theta;
    let angle2 = Math.PI * theta;

    // Find the joint (end of arm 1)
    let jointX = cx + R * Math.cos(angle1);
    let jointY = cy + R * Math.sin(angle1);

    // Find the tip (end of arm 2) relative to the joint
    let tipX = jointX + R * Math.cos(angle2);
    let tipY = jointY + R * Math.sin(angle2);

    // trail
    trailCtx.beginPath();
    trailCtx.moveTo(lastX, lastY);
    trailCtx.lineTo(tipX, tipY);
    trailCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    trailCtx.lineWidth = 1;
    trailCtx.stroke();

    // arms
    armCtx.beginPath();
    armCtx.moveTo(cx, cy);
    armCtx.lineTo(jointX, jointY);
    armCtx.lineTo(tipX, tipY);
    armCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    armCtx.lineWidth = 2;
    armCtx.stroke();

    armCtx.fillStyle = 'white';
    [ {x: cx, y: cy}, {x: jointX, y: jointY}, {x: tipX, y: tipY} ].forEach(point => {
        armCtx.beginPath();
        armCtx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        armCtx.fill();
    });

    // Update
    lastX = tipX;
    lastY = tipY;
    theta += speed * deltaTime;

    requestAnimationFrame(draw);
}

// Start the loop
requestAnimationFrame(draw);