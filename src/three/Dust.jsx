import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '../lib/scrollStore'

const COUNT_HIGH = 44
const COUNT_LOW = 16

/**
 * Track dust.
 * Particles are only spawned while the page is actually scrolling —
 * when the visitor stops, emission stops and the remaining dust
 * settles out. Nothing here is a physics simulation; it is a small
 * deterministic particle pool, which keeps it free on the GPU.
 */
export default function Dust({ quality = 'high' }) {
  const pointsRef = useRef(null)
  const count = quality === 'low' ? COUNT_LOW : COUNT_HIGH

  const { positions, geometry, material, parts } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const parts = Array.from({ length: count }, () => ({
      life: 0,
      max: 0.7 + Math.random() * 0.7,
      vx: 0,
      vy: 0,
      vz: 0,
    }))

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: '#c8bda6',
      size: 0.085,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })

    // Park every particle off-screen until it is first spawned.
    for (let i = 0; i < count; i++) positions[i * 3 + 1] = -50

    return { positions, geometry, material, parts }
  }, [count])

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta)
    const speed = Math.min(1, Math.abs(scrollState.velocity) * 13)
    const dir = Math.sign(scrollState.velocity) || 1

    // Fade the whole cloud with travel speed.
    material.opacity += (speed * 0.5 - material.opacity) * Math.min(1, dt * 6)

    let spawnBudget = speed > 0.05 ? 2 : 0

    for (let i = 0; i < count; i++) {
      const p = parts[i]
      const o = i * 3

      if (p.life <= 0) {
        if (spawnBudget > 0) {
          spawnBudget--
          p.life = p.max
          positions[o] = -0.72 - Math.random() * 0.12
          positions[o + 1] = 0.06
          positions[o + 2] = (Math.random() - 0.5) * 0.72
          p.vx = -dir * (0.35 + Math.random() * 0.5)
          p.vy = 0.16 + Math.random() * 0.26
          p.vz = (Math.random() - 0.5) * 0.2
        } else {
          positions[o + 1] = -50
        }
        continue
      }

      p.life -= dt
      positions[o] += p.vx * dt
      positions[o + 1] += p.vy * dt
      positions[o + 2] += p.vz * dt
      p.vy *= 0.965
      p.vx *= 0.975
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
