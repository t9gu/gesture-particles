import type { ShapeType } from '../store/useStore'

export function generateShapePositions(shape: ShapeType, count: number): Float32Array {
  const positions = new Float32Array(count * 3)
  
  switch (shape) {
    case 'sphere':
      generateSphere(positions, count)
      break
    case 'cube':
      generateCube(positions, count)
      break
    case 'heart':
      generateHeart(positions, count)
      break
    case 'spiral':
      generateSpiral(positions, count)
      break
    case 'galaxy':
      generateGalaxy(positions, count)
      break
    case 'firework':
      generateFirework(positions, count)
      break
    case 'bubble':
      generateBubble(positions, count)
      break
    case 'saturn':
      generateSaturn(positions, count)
      break
  }
  
  return positions
}

function generateSphere(positions: Float32Array, count: number) {
  const radius = 3
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius * Math.cbrt(Math.random())
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
}

function generateCube(positions: Float32Array, count: number) {
  const size = 4
  for (let i = 0; i < count; i++) {
    const face = Math.floor(Math.random() * 6)
    const u = (Math.random() - 0.5) * size
    const v = (Math.random() - 0.5) * size
    const half = size / 2
    
    switch (face) {
      case 0: positions[i * 3] = half; positions[i * 3 + 1] = u; positions[i * 3 + 2] = v; break
      case 1: positions[i * 3] = -half; positions[i * 3 + 1] = u; positions[i * 3 + 2] = v; break
      case 2: positions[i * 3] = u; positions[i * 3 + 1] = half; positions[i * 3 + 2] = v; break
      case 3: positions[i * 3] = u; positions[i * 3 + 1] = -half; positions[i * 3 + 2] = v; break
      case 4: positions[i * 3] = u; positions[i * 3 + 1] = v; positions[i * 3 + 2] = half; break
      case 5: positions[i * 3] = u; positions[i * 3 + 1] = v; positions[i * 3 + 2] = -half; break
    }
  }
}

function generateHeart(positions: Float32Array, count: number) {
  const scale = 0.15
  const arrowCount = Math.floor(count * 0.1)
  const heartCount = count - arrowCount
  
  for (let i = 0; i < heartCount; i++) {
    const t = (i / heartCount) * Math.PI * 2
    const noise = (Math.random() - 0.5) * 0.3
    
    const x = 16 * Math.pow(Math.sin(t), 3)
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    const z = (Math.random() - 0.5) * 2
    
    positions[i * 3] = (x + noise) * scale
    positions[i * 3 + 1] = (y + noise) * scale
    positions[i * 3 + 2] = z
  }
  
  for (let i = heartCount; i < count; i++) {
    const t = ((i - heartCount) / arrowCount) - 0.5
    const arrowLength = 6
    
    positions[i * 3] = t * arrowLength + 1.5
    positions[i * 3 + 1] = -t * 0.5 - 0.5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3
    
    if (t > 0.35) {
      const tipOffset = (t - 0.35) * 8
      positions[i * 3 + 1] += (Math.random() - 0.5) * tipOffset
      positions[i * 3 + 2] += (Math.random() - 0.5) * tipOffset * 0.5
    }
  }
}

function generateSpiral(positions: Float32Array, count: number) {
  const turns = 5
  const height = 6
  const radius = 2.5
  
  for (let i = 0; i < count; i++) {
    const t = i / count
    const angle = t * Math.PI * 2 * turns
    const y = (t - 0.5) * height
    const r = radius * (0.3 + t * 0.7)
    const noise = (Math.random() - 0.5) * 0.2
    
    positions[i * 3] = Math.cos(angle) * r + noise
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(angle) * r + noise
  }
}

function generateGalaxy(positions: Float32Array, count: number) {
  const arms = 3
  const armSpread = 0.3
  const radius = 4
  
  for (let i = 0; i < count; i++) {
    const arm = i % arms
    const armAngle = (arm / arms) * Math.PI * 2
    const t = Math.random()
    const distance = t * radius
    const spiralAngle = distance * 1.5
    const angle = armAngle + spiralAngle
    const spread = armSpread * t
    
    const x = Math.cos(angle) * distance + (Math.random() - 0.5) * spread * distance
    const z = Math.sin(angle) * distance + (Math.random() - 0.5) * spread * distance
    const y = (Math.random() - 0.5) * 0.3 * (1 - t * 0.5)
    
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
  }
}

function generateFirework(positions: Float32Array, count: number) {
  const bursts = 5
  const burstSize = Math.floor(count / bursts)
  
  for (let b = 0; b < bursts; b++) {
    const centerX = (Math.random() - 0.5) * 4
    const centerY = (Math.random() - 0.5) * 4
    const centerZ = (Math.random() - 0.5) * 4
    const burstRadius = 1 + Math.random() * 1.5
    
    for (let i = 0; i < burstSize; i++) {
      const idx = b * burstSize + i
      if (idx >= count) break
      
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = burstRadius * Math.random()
      
      positions[idx * 3] = centerX + r * Math.sin(phi) * Math.cos(theta)
      positions[idx * 3 + 1] = centerY + r * Math.sin(phi) * Math.sin(theta)
      positions[idx * 3 + 2] = centerZ + r * Math.cos(phi)
    }
  }
}

function generateBubble(positions: Float32Array, count: number) {
  const radius = 3
  const thickness = 0.1
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = radius + (Math.random() - 0.5) * thickness
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
}

function generateSaturn(positions: Float32Array, count: number) {
  const planetCount = Math.floor(count * 0.6)
  const ringCount = count - planetCount
  const planetRadius = 1.5
  const ringInner = 2.2
  const ringOuter = 3.5
  
  for (let i = 0; i < planetCount; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = planetRadius * Math.cbrt(Math.random())
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  
  for (let i = planetCount; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = ringInner + Math.random() * (ringOuter - ringInner)
    const tilt = 0.3
    
    positions[i * 3] = Math.cos(angle) * r
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.1 + Math.sin(angle) * r * Math.sin(tilt)
    positions[i * 3 + 2] = Math.sin(angle) * r * Math.cos(tilt)
  }
}

export function lerpPositions(
  current: Float32Array,
  target: Float32Array,
  factor: number
): void {
  for (let i = 0; i < current.length; i++) {
    current[i] += (target[i] - current[i]) * factor
  }
}
