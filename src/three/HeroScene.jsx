import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Lights from './Lights'
import { C } from './palette'
import { damp, scrollState } from '../lib/scrollStore'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useWebGL } from '../hooks/useWebGL'
import './HeroScene.css'
import ChromeEnvironment from './ChromeEnvironment'

/* ---------- Shared materials ---------- */
function useHeroMaterials() {
  return useMemo(() => {
    const make = (color, o = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0.07, ...o })
    return {
      concrete: make('#565b61'),
      concreteDark: make('#33383d'),
      graphite: make(C.graphite, { roughness: 0.6, metalness: 0.22 }),
      orange: make(C.accent, { roughness: 0.55 }),
      bronze: make(C.steelLight, { roughness: 0.4, metalness: 0.5 }),
      steel: make(C.steel, { roughness: 0.34, metalness: 0.62 }),
      far: make('#22262a', { roughness: 1 }),
      asphalt: make(C.asphalt, { roughness: 0.98 }),
    }
  }, [])
}

/* ---------- Concrete frame under construction ---------- */
function ConcreteFrame({ m }) {
  const cols = [-1.1, 0.35, 1.8]
  const rows = [-1.0, 0.5]
  return (
    <group position={[3.4, -1.5, -3.1]}>
      {[0, 1, 2, 3].map((f) => (
        <mesh key={f} position={[0.35, 0.9 + f * 1.25, -0.25]} material={m.concrete}>
          <boxGeometry args={[3.6, 0.16, 2.2]} />
        </mesh>
      ))}
      {cols.map((x) =>
        rows.map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 2.4, z - 0.25]} material={m.concreteDark}>
            <boxGeometry args={[0.22, 4.9, 0.22]} />
          </mesh>
        ))
      )}
      {/* exposed rebar */}
      {cols.map((x) =>
        rows.map((z) => (
          <mesh key={`r-${x}-${z}`} position={[x, 5.1, z - 0.25]} material={m.bronze}>
            <boxGeometry args={[0.035, 0.55, 0.035]} />
          </mesh>
        ))
      )}
    </group>
  )
}

/* ---------- Tower crane ---------- */
function HeroCrane({ m, reduced }) {
  const jibRef = useRef(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    if (reduced) return
    t.current += delta * 0.12
    if (jibRef.current) jibRef.current.rotation.y = 0.42 + Math.sin(t.current) * 0.05
  })

  const H = 8.2

  return (
    <group position={[8.4, -1.6, -8.2]}>
      <mesh position={[0, 0.2, 0]} material={m.concreteDark}>
        <boxGeometry args={[1.3, 0.4, 1.3]} />
      </mesh>
      <mesh position={[0, H / 2, 0]} material={m.orange}>
        <boxGeometry args={[0.34, H, 0.34]} />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[0, 0.9 + i * (H / 11), 0]} material={m.orange}>
          <boxGeometry args={[0.46, 0.05, 0.46]} />
        </mesh>
      ))}

      <group ref={jibRef} position={[0, H, 0]}>
        <mesh position={[3.1, 0, 0]} material={m.orange}>
          <boxGeometry args={[7.4, 0.22, 0.22]} />
        </mesh>
        <mesh position={[-1.5, 0, 0]} material={m.orange}>
          <boxGeometry args={[2.6, 0.22, 0.22]} />
        </mesh>
        <mesh position={[-2.3, 0.2, 0]} material={m.graphite}>
          <boxGeometry args={[0.8, 0.44, 0.5]} />
        </mesh>
        <mesh position={[0, 0.85, 0]} material={m.graphite}>
          <boxGeometry args={[0.24, 1.4, 0.24]} />
        </mesh>
        <mesh position={[4.4, -1.4, 0]} material={m.steel}>
          <boxGeometry args={[0.03, 2.6, 0.03]} />
        </mesh>
        <mesh position={[4.4, -2.85, 0]} material={m.graphite}>
          <boxGeometry args={[0.22, 0.3, 0.22]} />
        </mesh>
      </group>
    </group>
  )
}

/* ---------- Distant structures ---------- */
function Skyline({ m }) {
  const blocks = useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => {
        const s = Math.sin(i * 12.9898) * 43758.5453
        const r = s - Math.floor(s)
        return {
          x: -13 + i * 3.3 + r * 1.4,
          h: 3.2 + r * 4.4,
          w: 2.0 + r * 1.6,
          z: -15 - r * 3.5,
        }
      }),
    []
  )

  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2 - 1.8, b.z]} material={m.far}>
          <boxGeometry args={[b.w, b.h, 1.8]} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Atmospheric dust ---------- */
function Motes({ count = 90 }) {
  const ref = useRef(null)

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26
      pos[i * 3 + 1] = Math.random() * 9 - 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 4
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const material = new THREE.PointsMaterial({
      color: '#ccd3db',
      size: 0.055,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    })
    return { geometry, material }
  }, [count])

  useFrame((_, delta) => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i) + delta * 0.11
      if (y > 7.5) y = -2.4
      p.setY(i, y)
    }
    p.needsUpdate = true
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}

/* ---------- Ground + site road ---------- */
function Ground({ m }) {
  return (
    <group position={[0, -1.82, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={m.concreteDark}>
        <planeGeometry args={[90, 74]} />
      </mesh>
      <mesh position={[0, 0.012, 2.4]} rotation={[-Math.PI / 2, 0, 0.06]} material={m.asphalt}>
        <planeGeometry args={[64, 4.2]} />
      </mesh>
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh
          key={i}
          position={[-26 + i * 3.6, 0.02, 2.4 + (-26 + i * 3.6) * 0.06]}
          rotation={[-Math.PI / 2, 0, 0.06]}
        >
          <planeGeometry args={[1.3, 0.11]} />
          <meshBasicMaterial color="#c2c8d0" />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- Rig: mouse parallax + scroll camera ---------- */
function HeroRig({ children, reduced, mobile }) {
  const groupRef = useRef(null)
  const { camera } = useThree()
  const pointer = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const base = useRef({ z: mobile ? 11.2 : 9.4 })

  // The canvas opts out of pointer events so it never blocks the page,
  // so parallax is tracked from the window instead of r3f's own state.
  useEffect(() => {
    if (reduced || mobile) return
    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, mobile])

  useFrame((_, delta) => {
    // Under reduced motion the scene is composed once and left alone:
    // no parallax, no drifting camera.
    if (reduced) return

    const dt = Math.min(0.05, delta)

    if (!mobile) {
      // Deliberately small: a few pixels of drift, never a tilt.
      pointer.current.x = damp(pointer.current.x, target.current.x, 3, dt)
      pointer.current.y = damp(pointer.current.y, target.current.y, 3, dt)
    }

    if (groupRef.current) {
      groupRef.current.position.x = -pointer.current.x * 0.34
      groupRef.current.position.y = -pointer.current.y * 0.16
    }

    // Camera creeps forward as the hero scrolls away.
    const p = Math.min(1, scrollState.y / Math.max(1, scrollState.vh))
    camera.position.z = damp(camera.position.z, base.current.z - p * 2.6, 4, dt)
    camera.position.y = damp(camera.position.y, 0.55 - p * 0.5, 4, dt)
    camera.lookAt(0, 0.1, -4)
  })

  return <group ref={groupRef}>{children}</group>
}

/* ---------------------------------------------------------------
   Hero background scene
--------------------------------------------------------------- */
export default function HeroScene({ active = true }) {
  const m = useHeroMaterials()
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const hasWebGL = useWebGL()

  if (!hasWebGL) return <div className="hero-scene hero-scene--fallback" aria-hidden="true" />

  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas
        frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
        dpr={mobile ? [1, 1.4] : [1, 1.8]}
        camera={{ fov: 42, position: [0, 0.55, mobile ? 11.2 : 9.4], near: 0.1, far: 90 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.02
          camera.lookAt(0, 0.1, -4)
        }}
      >
        <fog attach="fog" args={['#0a0b0d', 12, 40]} />
        <ChromeEnvironment resolution={128} />
        <Lights intensity={0.92} />

        <HeroRig reduced={reduced} mobile={mobile}>
          <Ground m={m} />
          <Skyline m={m} />
          <ConcreteFrame m={m} />
          <HeroCrane m={m} reduced={reduced} />
          {!mobile && !reduced && <Motes count={80} />}
        </HeroRig>
      </Canvas>
    </div>
  )
}
