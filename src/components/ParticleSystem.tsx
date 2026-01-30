import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { generateShapePositions } from '../utils/shapes'

const PARTICLE_COUNT = 2000

const vertexShader = `
  uniform float uSize;
  uniform float uTime;
  attribute float aScale;
  varying vec3 vColor;
  varying float vDepth;
  
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_PointSize = uSize * aScale * (150.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform float uGlowStrength;
  varying vec3 vColor;
  varying float vDepth;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    // Simple glow effect
    float glow = 1.0 - (dist * 2.0);
    glow = pow(glow, 1.5) * uGlowStrength;
    
    // Depth-based brightness (closer = brighter)
    float depthFactor = clamp(12.0 / vDepth, 0.6, 1.2);
    
    vec3 finalColor = vColor * glow * depthFactor;
    gl_FragColor = vec4(finalColor, glow);
  }
`

export function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  const { 
    color, 
    particleSize, 
    glowStrength, 
    currentShape,
    pinchProgress,
    isOpen,
    handPosition
  } = useStore()

  const targetPositionsRef = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3))
  const originalPositionsRef = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3))
  const velocitiesRef = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3))

  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const scales = new Float32Array(PARTICLE_COUNT)

    const initialPositions = generateShapePositions('sphere', PARTICLE_COUNT)
    positions.set(initialPositions)
    originalPositionsRef.current.set(initialPositions)
    targetPositionsRef.current.set(initialPositions)

    const baseColor = new THREE.Color(color)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorVariation = 0.1
      colors[i * 3] = baseColor.r + (Math.random() - 0.5) * colorVariation
      colors[i * 3 + 1] = baseColor.g + (Math.random() - 0.5) * colorVariation
      colors[i * 3 + 2] = baseColor.b + (Math.random() - 0.5) * colorVariation
      scales[i] = 0.5 + Math.random() * 0.5
    }

    return { positions, colors, scales }
  }, [])

  useEffect(() => {
    const newPositions = generateShapePositions(currentShape, PARTICLE_COUNT)
    targetPositionsRef.current.set(newPositions)
    originalPositionsRef.current.set(newPositions)
  }, [currentShape])

  useEffect(() => {
    if (!pointsRef.current) return
    const geometry = pointsRef.current.geometry
    const colorAttr = geometry.getAttribute('color') as THREE.BufferAttribute
    
    const baseColor = new THREE.Color(color)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const colorVariation = 0.1
      colorAttr.setXYZ(
        i,
        baseColor.r + (Math.random() - 0.5) * colorVariation,
        baseColor.g + (Math.random() - 0.5) * colorVariation,
        baseColor.b + (Math.random() - 0.5) * colorVariation
      )
    }
    colorAttr.needsUpdate = true
  }, [color])

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return

    const geometry = pointsRef.current.geometry
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute
    const positions = positionAttr.array as Float32Array

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    materialRef.current.uniforms.uSize.value = particleSize * 4
    materialRef.current.uniforms.uGlowStrength.value = glowStrength

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      let targetX = originalPositionsRef.current[i3]
      let targetY = originalPositionsRef.current[i3 + 1]
      let targetZ = originalPositionsRef.current[i3 + 2]

      if (pinchProgress > 0.3) {
        const contractFactor = pinchProgress * 0.8
        targetX *= (1 - contractFactor)
        targetY *= (1 - contractFactor)
        targetZ *= (1 - contractFactor)
      }

      if (isOpen) {
        const explosionFactor = 2.5
        targetX *= explosionFactor
        targetY *= explosionFactor
        targetZ *= explosionFactor
      }

      if (handPosition) {
        const dx = positions[i3] - handPosition.x
        const dy = positions[i3 + 1] - handPosition.y
        const dz = positions[i3 + 2] - handPosition.z
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        if (dist < 3) {
          const force = (3 - dist) / 3
          const repelStrength = 0.5
          velocitiesRef.current[i3] += (dx / dist) * force * repelStrength
          velocitiesRef.current[i3 + 1] += (dy / dist) * force * repelStrength
          velocitiesRef.current[i3 + 2] += (dz / dist) * force * repelStrength
        }
      }

      velocitiesRef.current[i3] *= 0.92
      velocitiesRef.current[i3 + 1] *= 0.92
      velocitiesRef.current[i3 + 2] *= 0.92

      const lerpFactor = 0.05
      positions[i3] += (targetX - positions[i3]) * lerpFactor + velocitiesRef.current[i3] * delta * 60
      positions[i3 + 1] += (targetY - positions[i3 + 1]) * lerpFactor + velocitiesRef.current[i3 + 1] * delta * 60
      positions[i3 + 2] += (targetZ - positions[i3 + 2]) * lerpFactor + velocitiesRef.current[i3 + 2] * delta * 60
    }

    positionAttr.needsUpdate = true
    pointsRef.current.rotation.y += delta * 0.05
  })

  const uniforms = useMemo(() => ({
    uSize: { value: particleSize * 4 },
    uTime: { value: 0 },
    uGlowStrength: { value: glowStrength }
  }), [])

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          count={PARTICLE_COUNT}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  )
}
