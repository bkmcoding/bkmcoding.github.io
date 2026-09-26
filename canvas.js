let c = document.querySelector("canvas");
const ctx = c.getContext("2d");

let width = c.width;
let height = c.height;

// let dx = width / 5;
// let dy = height / 5;
// Checkerboard
// for (let i = 0; i < 5; i++) {
//     for (let j = 0; j < 5; j++) {
//         ctx.fillStyle = 'black';
//         ctx.fillRect((j-(2*i))*dx, j*dy, dx, dy);
//         ctx.fillRect((j+(2*i))*dx, j*dy, dx, dy);
//         ctx.fillStyle = 'white';
//         ctx.fillRect((j+(2*i) + 1)*dx, j*dy, dx, dy);
//         ctx.fillRect((j-(2*i) + 1)*dx, j*dy, dx, dy);
//         // ctx.fillRect(j*dx, j*dy, dx, dy)
//     }
// }

let n = 25;
let N = 2*n;
let r = 50;
let points = Array.from({ length: N }, () => [0.0, 0.0]);
let origin = [width / 2, height / 2];
ctx.fillRect(origin[0], origin[1], 1, 1)

function circle(t, r = 1, h=0, k=0) {
    return [h + r * Math.cos(t), k + r * Math.sin(t)];
}

for (let i = 0; i < N; i++) {
    t = i * (2 *Math.PI / (N - 1));
    let p = circle(t, r, origin[0], origin[1]);
    points[i] = p;
    ctx.fillRect(p[0], p[1], 1, 1)
}

for (let i = 0; i < n; i++) {
    let from = points[i];
    let to = points[2*i];
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.lineWidth = 1;
    ctx.stroke();
}

for (let i = n; i < N; i++) {
    console.log(n)
    let from = points[n];
    let to = points[2*i];
    ctx.beginPath();
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
    ctx.lineWidth = 1;
    ctx.stroke();
}