const trailCanvas = document.getElementById('trailCanvas');
const armCanvas = document.getElementById('armCanvas');
const trailCtx = trailCanvas.getContext('2d');
const armCtx = armCanvas.getContext('2d');

const cx = armCanvas.width / 2;
const cy = armCanvas.height / 2;

// R is the length of both arms (the radius of their circles)
const R = 240;

// Theta represents time/angle.
// dTheta is the speed of the animation.
let theta = 0;
let dTheta = 0.03;

// Starting position: both arms pointing exactly to the right
let lastX = cx + R + R;
let lastY = cy;

function draw() {
    // Clear the moving arms canvas every frame
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

    // center dot
    armCtx.fillStyle = 'white';
    [ {x: cx, y: cy}, {x: jointX, y: jointY}, {x: tipX, y: tipY} ].forEach(point => {
        armCtx.beginPath();
        armCtx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        armCtx.fill();
    });

    // update
    lastX = tipX;
    lastY = tipY;
    theta += dTheta;

    requestAnimationFrame(draw);
}

draw();