import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Lights from './Lights'
import { C } from './palette'
import { clamp, damp, scrollState } from '../lib/scrollStore'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useWebGL } from '../hooks/useWebGL'
import './MaterialsScene.css'
import ChromeEnvironment from './ChromeEnvironment'

/**
 * RAW MATERIAL → STRONG FOUNDATION
 * ---------------------------------------------------------------
 * Scattered stone and aggregate blocks converge into a clean, level
 * foundation platform as the visitor scrolls through the Materials
 * section. One InstancedMesh, no physics — the whole effect is a
 * per-instance interpolation between a scattered pose and a
 * structured one.
 */

const GRID_X = 9
const GRID_Z = 4
const COUNT = GRID_X * GRID_Z
const BLOCK = 0.46

function pseudo(i, salt) {
  const s = Math.sin((i + 1) * (12.9898 + salt) + salt * 78.233) * 43758.5453
  return s - Math.floor(s)
}

function Foundation({ quality }) {
  const meshRef = useRef(null)
  const slabRef = useRef(null)
  const smooth = useRef(0)
  const coloured = useRef(false)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const layout = useMemo(() => {
    const arr = []
    for (let i = 0; i < COUNT; i++) {
      const gx = i % GRID_X
      const gz = Math.floor(i / GRID_X)

      // Structured target: a level, coursed platform.
      const to = {
        x: (gx - (GRID_X - 1) / 2) * (BLOCK + 0.035),
        y: BLOCK / 2 + (gz % 2 === 0 ? 0 : 0.005),
        z: (gz - (GRID_Z - 1) / 2) * (BLOCK + 0.035),
        rx: 0,
        ry: 0,
        rz: 0,
        s: 1,
      }

      // Scattered source: raw material dropped on the ground.
      const from = {
        x: to.x + (pseudo(i, 1) - 0.5) * 5.4,
        y: 0.2 + pseudo(i, 2) * 2.6,
        z: to.z + (pseudo(i, 3) - 0.5) * 3.2,
        rx: pseudo(i, 4) * Math.PI,
        ry: pseudo(i, 5) * Math.PI,
        rz: pseudo(i, 6) * Math.PI,
        s: 0.55 + pseudo(i, 7) * 0.6,
      }

      arr.push({ from, to, delay: pseudo(i, 8) * 0.32 })
    }
    return arr
  }, [])

  const geometry = useMemo(() => new THREE.BoxGeometry(BLOCK, BLOCK * 0.62, BLOCK), [])

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.92,
        metalness: 0.05,
      }),
    []
  )

  // Per-instance material tones — stone, gravel, aggregate, sand.
  const tones = useMemo(
    () => ['#6b7076', '#868c93', '#5a5f65', '#9aa0a8', '#72767e'].map((h) => new THREE.Color(h)),
    []
  )

  useFrame((_, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    if (!coloured.current) {
      for (let i = 0; i < COUNT; i++) mesh.setColorAt(i, tones[i % tones.length])
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      coloured.current = true
    }

    smooth.current = damp(smooth.current, scrollState.materials, 5, Math.min(0.05, delta))
    const p = smooth.current

    for (let i = 0; i < COUNT; i++) {
      const { from, to, delay } = layout[i]
      const t = clamp((p - delay) / (1 - delay))
      // ease-in-out so the blocks settle rather than snap
      const e = t * t * (3 - 2 * t)

      dummy.position.set(
        THREE.MathUtils.lerp(from.x, to.x, e),
        THREE.MathUtils.lerp(from.y, to.y, e),
        THREE.MathUtils.lerp(from.z, to.z, e)
      )
      dummy.rotation.set(
        THREE.MathUtils.lerp(from.rx, to.rx, e),
        THREE.MathUtils.lerp(from.ry, to.ry, e),
        THREE.MathUtils.lerp(from.rz, to.rz, e)
      )
      const s = THREE.MathUtils.lerp(from.s, to.s, e)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true

    // The platform slab rises out of the assembled blocks.
    if (slabRef.current) {
      const slabT = clamp((p - 0.7) / 0.3)
      slabRef.current.scale.set(1, Math.max(0.001, slabT), 1)
      slabRef.current.material.opacity = slabT
    }
  })

  return (
    <group rotation={[0, quality === 'low' ? 0 : -0.24, 0]}>
      <instancedMesh ref={meshRef} args={[geometry, material, COUNT]} frustumCulled={false} />

      {/* the finished foundation slab */}
      <mesh ref={slabRef} position={[0, 0.52, 0]} scale={[1, 0.001, 1]}>
        <boxGeometry args={[GRID_X * (BLOCK + 0.035) + 0.24, 0.14, GRID_Z * (BLOCK + 0.035) + 0.24]} />
        <meshStandardMaterial color="#94989e" roughness={0.86} transparent opacity={0} />
      </mesh>

      {/* setting-out line */}
      <mesh position={[0, 0.601, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GRID_X * (BLOCK + 0.035) + 0.24, 0.03]} />
        <meshBasicMaterial color={C.accent} transparent opacity={0.85} />
      </mesh>

      {/* ground */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={false}>
        <planeGeometry args={[26, 16]} />
        <meshStandardMaterial color="#26282a" roughness={1} />
      </mesh>
    </group>
  )
}

export default function MaterialsScene({ active = true }) {
  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const hasWebGL = useWebGL()

  if (!hasWebGL || reduced) {
    return <div className="mat-scene mat-scene--fallback" aria-hidden="true" />
  }

  return (
    <div className="mat-scene" aria-hidden="true">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={mobile ? [1, 1.3] : [1, 1.7]}
        camera={{ fov: 34, position: [0, 2.5, 7.4], near: 0.1, far: 60 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          camera.lookAt(0, 0.4, 0)
        }}
      >
        <fog attach="fog" args={['#14171a', 9, 22]} />
        <ChromeEnvironment resolution={64} />
        <Lights intensity={0.95} />
        <Foundation quality={mobile ? 'low' : 'high'} />
      </Canvas>
    </div>
  )
}
