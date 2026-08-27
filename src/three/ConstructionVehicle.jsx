import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C } from './palette'
import { scrollState } from '../lib/scrollStore'

/* ---------------------------------------------------------------
   Track geometry helper
   Treads ride a stadium-shaped loop, which is what makes the
   tracks read as genuinely rotating rather than sliding.
--------------------------------------------------------------- */
const TREAD_COUNT = 15
const TRACK_LEN = 1.42
const TRACK_R = 0.2

function stadiumPoint(u, out) {
  const straight = TRACK_LEN
  const arc = Math.PI * TRACK_R
  const total = straight * 2 + arc * 2
  let s = ((u % 1) + 1) % 1
  s *= total

  const halfL = straight / 2

  if (s < straight) {
    // bottom, travelling +x
    out.set(-halfL + s, -TRACK_R, 0)
    out.angle = 0
  } else if (s < straight + arc) {
    // front arc
    const a = ((s - straight) / arc) * Math.PI - Math.PI / 2
    out.set(halfL + Math.cos(a) * TRACK_R, Math.sin(a) * TRACK_R, 0)
    out.angle = a + Math.PI / 2
  } else if (s < straight * 2 + arc) {
    // top, travelling -x
    const t = s - (straight + arc)
    out.set(halfL - t, TRACK_R, 0)
    out.angle = Math.PI
  } else {
    // rear arc
    const a = ((s - (straight * 2 + arc)) / arc) * Math.PI + Math.PI / 2
    out.set(-halfL + Math.cos(a) * TRACK_R, Math.sin(a) * TRACK_R, 0)
    out.angle = a + Math.PI / 2
  }
  return out
}

/* ---------------------------------------------------------------
   Undercarriage — two tracks with animated tread plates
--------------------------------------------------------------- */
function Tracks({ materials }) {
  const treadsRef = useRef(null)
  const sprocketsRef = useRef([])
  const offset = useRef(0)

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const point = useMemo(() => {
    const v = new THREE.Vector3()
    v.angle = 0
    return v
  }, [])

  const treadGeo = useMemo(() => new THREE.BoxGeometry(0.1, 0.055, 0.34), [])

  useFrame((_, delta) => {
    const mesh = treadsRef.current
    if (!mesh) return

    // Tracks turn only while the page is scrolling — and reverse
    // when the visitor scrolls back up.
    const v = THREE.MathUtils.clamp(scrollState.velocity * 9, -3.2, 3.2)
    offset.current += v * delta

    for (let side = 0; side < 2; side++) {
      const z = side === 0 ? 0.31 : -0.31
      for (let i = 0; i < TREAD_COUNT; i++) {
        stadiumPoint(i / TREAD_COUNT + offset.current, point)
        dummy.position.set(point.x, point.y, z)
        dummy.rotation.set(0, 0, point.angle)
        dummy.updateMatrix()
        mesh.setMatrixAt(side * TREAD_COUNT + i, dummy.matrix)
      }
    }
    mesh.instanceMatrix.needsUpdate = true

    sprocketsRef.current.forEach((s) => {
      if (s) s.rotation.z += (v * delta) / TRACK_R
    })
  })

  return (
    <group position={[0, 0.235, 0]}>
      <instancedMesh
        ref={treadsRef}
        args={[treadGeo, materials.rubber, TREAD_COUNT * 2]}
        frustumCulled={false}
      />

      {[0.31, -0.31].map((z, si) => (
        <group key={z} position={[0, 0, z]}>
          {/* track frame */}
          <mesh material={materials.graphiteDark}>
            <boxGeometry args={[TRACK_LEN + 0.1, TRACK_R * 1.55, 0.24]} />
          </mesh>

          {/* drive sprockets */}
          {[-TRACK_LEN / 2, TRACK_LEN / 2].map((x, i) => (
            <mesh
              key={x}
              ref={(el) => (sprocketsRef.current[si * 2 + i] = el)}
              position={[x, 0, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.bronze}
            >
              <cylinderGeometry args={[TRACK_R * 0.72, TRACK_R * 0.72, 0.26, 12]} />
            </mesh>
          ))}

          {/* idler rollers */}
          {[-0.34, 0.02, 0.38].map((x) => (
            <mesh
              key={x}
              position={[x, -TRACK_R * 0.5, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              material={materials.steel}
            >
              <cylinderGeometry args={[0.075, 0.075, 0.27, 10]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------------
   Boom · arm · bucket
   Bronze arm and dark bucket, matching the company logo artwork.
--------------------------------------------------------------- */
function Arm({ materials }) {
  const boomRef = useRef(null)
  const armRef = useRef(null)
  const bucketRef = useRef(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    // A slow idle articulation, amplified slightly while moving.
    const active = Math.min(1, Math.abs(scrollState.velocity) * 14)
    t.current += delta * (0.35 + active * 0.5)

    const s = Math.sin(t.current)
    if (boomRef.current) boomRef.current.rotation.z = -0.62 + s * 0.05
    if (armRef.current) armRef.current.rotation.z = 1.28 + Math.sin(t.current * 1.3) * 0.07
    if (bucketRef.current) bucketRef.current.rotation.z = 0.55 + Math.sin(t.current * 0.9) * 0.12
  })

  return (
    <group ref={boomRef} position={[0.34, 0.66, 0]}>
      {/* boom */}
      <mesh position={[0.44, 0, 0]} material={materials.bronze}>
        <boxGeometry args={[0.98, 0.15, 0.15]} />
      </mesh>
      <mesh position={[0.44, 0.085, 0]} material={materials.bronzeDark}>
        <boxGeometry args={[0.98, 0.022, 0.16]} />
      </mesh>

      {/* hydraulic ram */}
      <mesh position={[0.4, -0.13, 0]} rotation={[0, 0, Math.PI / 2 + 0.16]} material={materials.steel}>
        <cylinderGeometry args={[0.035, 0.035, 0.62, 8]} />
      </mesh>

      <group ref={armRef} position={[0.92, 0, 0]}>
        <mesh position={[0.3, 0, 0]} material={materials.bronze}>
          <boxGeometry args={[0.66, 0.12, 0.12]} />
        </mesh>

        <group ref={bucketRef} position={[0.62, 0, 0]}>
          <mesh position={[0.11, -0.06, 0]} material={materials.graphiteDark}>
            <boxGeometry args={[0.26, 0.24, 0.3]} />
          </mesh>
          <mesh position={[0.24, -0.15, 0]} rotation={[0, 0, -0.5]} material={materials.graphiteDark}>
            <boxGeometry args={[0.2, 0.05, 0.3]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ---------------------------------------------------------------
   The vehicle
--------------------------------------------------------------- */
export default function ConstructionVehicle({ quality = 'high' }) {
  const bodyRef = useRef(null)
  const houseRef = useRef(null)
  const beaconRef = useRef(null)
  const bounce = useRef(0)

  const materials = useMemo(() => {
    const make = (color, opts = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.14, ...opts })
    return {
      graphite: make(C.graphite, { roughness: 0.5, metalness: 0.24 }),
      graphiteDark: make('#1a1c1e', { roughness: 0.66, metalness: 0.26 }),
      orange: make(C.orange, { roughness: 0.46, metalness: 0.16 }),
      orangeDeep: make(C.orangeDeep, { roughness: 0.5 }),
      bronze: make(C.bronze, { roughness: 0.38, metalness: 0.55 }),
      bronzeDark: make(C.bronzeDark, { roughness: 0.42, metalness: 0.55 }),
      steel: make(C.steel, { roughness: 0.3, metalness: 0.7 }),
      rubber: make(C.rubber, { roughness: 0.9, metalness: 0.05 }),
      offwhite: make(C.offwhite, { roughness: 0.5, metalness: 0.1 }),
      glass: make('#20323a', { roughness: 0.14, metalness: 0.5, opacity: 0.82, transparent: true }),
      beacon: new THREE.MeshBasicMaterial({ color: C.orange }),
    }
  }, [])

  useFrame((state, delta) => {
    const speed = Math.min(1, Math.abs(scrollState.velocity) * 14)

    // Extremely subtle suspension bounce, only while moving.
    bounce.current += delta * (5 + speed * 12)
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(bounce.current) * 0.008 * speed
      bodyRef.current.rotation.z = Math.sin(bounce.current * 0.7) * 0.012 * speed
    }

    // Upper house eases toward the direction of travel.
    if (houseRef.current) {
      const target = THREE.MathUtils.clamp(-scrollState.velocity * 2.4, -0.2, 0.2)
      houseRef.current.rotation.y += (target - houseRef.current.rotation.y) * Math.min(1, delta * 3)
    }

    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 3.2
    }
  })

  return (
    <group ref={bodyRef}>
      <Tracks materials={materials} />

      {/* undercarriage deck */}
      <mesh position={[0, 0.44, 0]} material={materials.graphiteDark}>
        <boxGeometry args={[1.28, 0.12, 0.74]} />
      </mesh>

      <group ref={houseRef} position={[0, 0.5, 0]}>
        {/* main house */}
        <mesh position={[-0.12, 0.2, 0]} material={materials.orange}>
          <boxGeometry args={[1.02, 0.4, 0.68]} />
        </mesh>

        {/* graphite side panel keeps the orange from dominating */}
        <mesh position={[-0.12, 0.2, 0.345]} material={materials.graphite}>
          <boxGeometry args={[0.68, 0.28, 0.012]} />
        </mesh>
        <mesh position={[-0.12, 0.2, -0.345]} material={materials.graphite}>
          <boxGeometry args={[0.68, 0.28, 0.012]} />
        </mesh>

        {/* counterweight */}
        <mesh position={[-0.62, 0.18, 0]} material={materials.graphite}>
          <boxGeometry args={[0.24, 0.34, 0.62]} />
        </mesh>

        {/* operator cab */}
        <mesh position={[0.28, 0.3, 0.15]} material={materials.graphite}>
          <boxGeometry args={[0.44, 0.56, 0.42]} />
        </mesh>
        <mesh position={[0.5, 0.34, 0.15]} material={materials.glass}>
          <boxGeometry args={[0.02, 0.4, 0.34]} />
        </mesh>
        <mesh position={[0.28, 0.34, 0.361]} material={materials.glass}>
          <boxGeometry args={[0.34, 0.4, 0.02]} />
        </mesh>

        {/* bronze trim line */}
        <mesh position={[-0.12, 0.03, 0]} material={materials.bronze}>
          <boxGeometry args={[1.03, 0.026, 0.69]} />
        </mesh>

        {/* exhaust */}
        <mesh position={[-0.02, 0.48, -0.2]} material={materials.steel}>
          <cylinderGeometry args={[0.028, 0.032, 0.2, 8]} />
        </mesh>

        {/* rotating beacon */}
        <group ref={beaconRef} position={[0.28, 0.62, 0.15]}>
          <mesh material={materials.beacon}>
            <cylinderGeometry args={[0.032, 0.032, 0.055, 8]} />
          </mesh>
        </group>

        {quality !== 'low' && (
          <>
            {/* handrail */}
            <mesh position={[-0.12, 0.44, 0.3]} rotation={[0, 0, Math.PI / 2]} material={materials.bronze}>
              <cylinderGeometry args={[0.012, 0.012, 0.6, 6]} />
            </mesh>
            {/* work light */}
            <mesh position={[0.46, 0.58, 0.15]} material={materials.offwhite}>
              <boxGeometry args={[0.07, 0.05, 0.1]} />
            </mesh>
          </>
        )}

        <Arm materials={materials} />
      </group>
    </group>
  )
}
