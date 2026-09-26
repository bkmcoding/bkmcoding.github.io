;(function () {
  const canvas = document.querySelector('canvas')
  const ctx = canvas.getContext('2d')

  let width, height, cx, cy, dpr
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    // canvas.style.width = width + 'px'
    // canvas.style.height = height + 'px'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    cx = width / 2
    cy = height * 0.47
  }
  window.addEventListener('resize', resize)
  resize()

  const vAdd = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z })
  const vSub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z })
  const vScale = (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s })
  const vCross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x })
  const vDot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z
  const vLen = (a) => Math.sqrt(vDot(a, a))
  const vNorm = (a) => {
    const l = vLen(a) || 1
    return { x: a.x / l, y: a.y / l, z: a.z / l }
  }
  const hash = (i) => {
    const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453
    return s - Math.floor(s)
  }


  const allTriangles = []

  function addTriangle(v0, v1, v2, outwardRef, bucket) {
    let n = vNorm(vCross(vSub(v1, v0), vSub(v2, v0)))
    const centroid = vScale(vAdd(vAdd(v0, v1), v2), 1 / 3)
    const outward = vNorm(vSub(centroid, outwardRef))
    if (vDot(n, outward) < 0) n = vScale(n, -1)
    bucket.push({ v0, v1, v2, normal: n })
  }

  const layerDefs = [
    { count: 5, radius: 6, length: 30, halfWidth: 9, tiltDeg: 12, attachY: 37, curl: 2 },
    { count: 6, radius: 15, length: 43, halfWidth: 13, tiltDeg: 38, attachY: 27, curl: 5 },
    { count: 7, radius: 27, length: 56, halfWidth: 17, tiltDeg: 68, attachY: 15, curl: 9 },
    { count: 9, radius: 41, length: 68, halfWidth: 21, tiltDeg: 98, attachY: 0, curl: 13 },
  ]
  const tSteps = 7,
    wSteps = 3

  layerDefs.forEach((layer, L) => {
    for (let k = 0; k < layer.count; k++) {
      const seed = L * 97 + k * 13
      const angle = (k / layer.count) * Math.PI * 2 + L * 0.35 + (hash(seed) - 0.5) * 0.3
      const attachY = layer.attachY + (hash(seed + 1) - 0.5) * 4
      const radius = layer.radius + (hash(seed + 2) - 0.5) * 3
      const length = layer.length * (0.9 + hash(seed + 3) * 0.2)
      const halfWidth = layer.halfWidth * (0.9 + hash(seed + 4) * 0.2)
      const tilt = ((layer.tiltDeg + (hash(seed + 5) - 0.5) * 10) * Math.PI) / 180
      const curl = layer.curl

      const R = { x: Math.cos(angle), y: 0, z: Math.sin(angle) }
      const T = { x: -Math.sin(angle), y: 0, z: Math.cos(angle) }
      const G = { x: R.x * Math.sin(tilt), y: Math.cos(tilt), z: R.z * Math.sin(tilt) }
      const N = vNorm(vCross(G, T))
      const attach = { x: R.x * radius, y: attachY, z: R.z * radius }

      function surface(t, w) {
        const envW = halfWidth * Math.sin(t * Math.PI)
        const curlAmt = curl * w * w * (0.3 + 0.7 * t) + curl * 1.4 * Math.pow(t, 3)
        return vAdd(vAdd(vAdd(attach, vScale(G, t * length)), vScale(T, envW * w)), vScale(N, curlAmt))
      }

      const grid = []
      for (let s = 0; s <= tSteps; s++) {
        const row = []
        for (let u = 0; u <= wSteps; u++) row.push(surface(s / tSteps, (u / wSteps) * 2 - 1))
        grid.push(row)
      }

      const axisPoint = { x: 0, y: attachY, z: 0 }
      for (let s = 0; s < tSteps; s++) {
        for (let u = 0; u < wSteps; u++) {
          const a = grid[s][u],
            b = grid[s + 1][u],
            c = grid[s + 1][u + 1],
            d = grid[s][u + 1]
          addTriangle(a, b, c, axisPoint, allTriangles)
          addTriangle(a, c, d, axisPoint, allTriangles)
        }
      }
    }
  })

  {
    const steps = 18,
      sides = 6,
      topY = 6,
      bottomY = -128
    const stemCenter = (t) => ({
      x: Math.sin(t * Math.PI * 1.3) * 9,
      y: topY + (bottomY - topY) * t,
      z: Math.cos(t * Math.PI * 1.3) * 5,
    })
    const stemRadius = (t) => 3.4 * (1 - 0.35 * t)

    const rings = []
    for (let s = 0; s <= steps; s++) {
      const t = s / steps,
        c = stemCenter(t),
        r = stemRadius(t),
        ring = []
      for (let j = 0; j < sides; j++) {
        const phi = (j / sides) * Math.PI * 2
        ring.push({ x: c.x + Math.cos(phi) * r, y: c.y, z: c.z + Math.sin(phi) * r })
      }
      rings.push(ring)
    }
    for (let s = 0; s < steps; s++) {
      const c0 = stemCenter(s / steps)
      for (let j = 0; j < sides; j++) {
        const jn = (j + 1) % sides
        const a = rings[s][j],
          b = rings[s + 1][j],
          c = rings[s + 1][jn],
          d = rings[s][jn]
        addTriangle(a, b, c, c0, allTriangles)
        addTriangle(a, c, d, c0, allTriangles)
      }
    }
  }

  // ---------- wireframe cube ----------
  const cubeSize = 1
  const cubeCorners = []
  for (let i = 0; i < 8; i++) {
    cubeCorners.push({
      x: (i & 1 ? 1 : -1) * cubeSize,
      y: (i & 2 ? 1 : -1) * cubeSize,
      z: (i & 4 ? 1 : -1) * cubeSize,
    })
  }
  const cubeEdges = []
  for (let i = 0; i < 8; i++)
    for (let bit = 0; bit < 3; bit++) {
      const j = i ^ (1 << bit)
      if (j > i) cubeEdges.push([i, j])
    }

  // ---------- render ----------
  const cameraZ = 900
  const baseTilt = -0.52 // fixed camera pitch, looking down at the box like the reference
  const mainLight = vNorm({ x: -0.45, y: 0.75, z: 0.55 })
  const fillLight = vNorm({ x: 0.55, y: -0.25, z: -0.6 })

  function transform(p, cosY, sinY, cosX, sinX) {
    const x1 = p.x * cosY + p.z * sinY
    const z1 = -p.x * sinY + p.z * cosY
    const y2 = p.y * cosX - z1 * sinX
    const z2 = p.y * sinX + z1 * cosX
    return { x: x1, y: y2, z: z2 }
  }
  function project(p) {
    const scale = cameraZ / (cameraZ + p.z)
    return { x: cx + p.x * scale, y: cy - p.y * scale }
  }
  function shade(normal) {
    const key = Math.max(vDot(normal, mainLight), 0)
    const fill = Math.max(vDot(normal, fillLight), 0)
    const b = Math.min(1, 0.3 + key * 0.62 + fill * 0.22)
    const v = Math.round(40 + b * 205)
    return `rgb(${v}, ${Math.round(v * 0.985)}, ${Math.round(v * 0.95)})`
  }

  let time = 0

  function animate() {
    const bg = ctx.createLinearGradient(0, 0, 0, height)
    bg.addColorStop(0, '#050505')
    bg.addColorStop(1, '#000000')
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)

    time += 0.0035
    const tiltX = baseTilt + Math.sin(time * 0.6) * 0.03
    const cosY = Math.cos(time),
      sinY = Math.sin(time)
    const cosX = Math.cos(tiltX),
      sinX = Math.sin(tiltX)

    // cube (drawn first: it's larger than the rose, so plain draw order works)
    const projCorners = cubeCorners.map((p) => project(transform(p, cosY, sinY, cosX, sinX)))
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 1
    cubeEdges.forEach(([i, j]) => {
      ctx.beginPath()
      ctx.moveTo(projCorners[i].x, projCorners[i].y)
      ctx.lineTo(projCorners[j].x, projCorners[j].y)
      ctx.stroke()
    })

    const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 150)
    glow.addColorStop(0, 'rgba(255,250,245,0.16)')
    glow.addColorStop(1, 'rgba(255,250,245,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, width, height)

    const drawables = allTriangles.map((tri) => {
      const v0 = transform(tri.v0, cosY, sinY, cosX, sinX)
      const v1 = transform(tri.v1, cosY, sinY, cosX, sinX)
      const v2 = transform(tri.v2, cosY, sinY, cosX, sinX)
      const n = transform(tri.normal, cosY, sinY, cosX, sinX)
      return {
        p0: project(v0),
        p1: project(v1),
        p2: project(v2),
        avgZ: (v0.z + v1.z + v2.z) / 3,
        color: shade(n),
      }
    })
    drawables.sort((a, b) => b.avgZ - a.avgZ) 

    drawables.forEach((d) => {
      ctx.beginPath()
      ctx.moveTo(d.p0.x, d.p0.y)
      ctx.lineTo(d.p1.x, d.p1.y)
      ctx.lineTo(d.p2.x, d.p2.y)
      ctx.closePath()
      ctx.fillStyle = d.color
      ctx.fill()
      ctx.strokeStyle = d.color
      ctx.lineWidth = 1
      ctx.stroke()
    })

    requestAnimationFrame(animate)
  }

  animate()
})()
