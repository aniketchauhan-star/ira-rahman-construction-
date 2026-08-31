import { useMemo } from 'react'
import * as THREE from 'three'
import { C } from './palette'
import { ROAD_LENGTH, ROAD_PAD, ROAD_WIDTH, roadY, roadZ } from './roadPath'

/**
 * Builds a ribbon that follows the road centreline. Used for the
 * asphalt, the shoulders and the painted edge lines so everything
 * stays perfectly registered with the surface the vehicle drives on.
 */
function buildRibbon(width, yOffset, segments) {
  const pos = new Float32Array((segments + 1) * 2 * 3)
  const uv = new Float32Array((segments + 1) * 2 * 2)
  const idx = []
  const total = ROAD_LENGTH + ROAD_PAD * 2
  const step = total / segments

  for (let i = 0; i <= segments; i++) {
    const d = -ROAD_PAD + i * step
    const z = roadZ(d)
    const y = roadY(d) + yOffset
    const o = i * 6
    pos[o] = d
    pos[o + 1] = y
    pos[o + 2] = z - width / 2
    pos[o + 3] = d
    pos[o + 4] = y
    pos[o + 5] = z + width / 2

    // v = 0 on the far side of the ribbon, 1 on the near side.
    const uo = i * 4
    uv[uo] = i / segments
    uv[uo + 1] = 0
    uv[uo + 2] = i / segments
    uv[uo + 3] = 1

    if (i < segments) {
      const a = i * 2
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/**
 * A one-pixel-wide alpha ramp used to dissolve the far edge of the
 * compacted ground into the page, so the band never ends on a hard
 * horizontal line across a light section.
 */
function buildGroundAlpha() {
  const c = document.createElement('canvas')
  c.width = 1
  c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 64)
  g.addColorStop(0, '#000000') // far edge — fully transparent
  g.addColorStop(0.42, '#6b6b6b')
  g.addColorStop(0.68, '#ffffff')
  g.addColorStop(1, '#ffffff') // near edge — solid
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 1, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.ClampToEdgeWrapping
  // The ribbon's v runs far → near, so the ramp must not be flipped.
  tex.flipY = false
  return tex
}

/** Deterministic pseudo-random so the layout is identical every load. */
function rand(seed) {
  const x = Math.sin(seed * 127.1) * 43758.5453
  return x - Math.floor(x)
}

export default function ConstructionRoad({ quality = 'high' }) {
  const segments = quality === 'low' ? 90 : 200

  const geos = useMemo(
    () => ({
      ground: buildRibbon(ROAD_WIDTH + 8.6, -0.03, Math.round(segments / 2)),
      asphalt: buildRibbon(ROAD_WIDTH, 0, segments),
      edgeL: buildRibbon(0.075, 0.006, segments),
      edgeR: buildRibbon(0.075, 0.006, segments),
    }),
    [segments]
  )

  const materials = useMemo(
    () => ({
      ground: new THREE.MeshStandardMaterial({
        color: '#22262a',
        roughness: 1,
        metalness: 0,
        transparent: true,
        alphaMap: buildGroundAlpha(),
        depthWrite: false,
      }),
      asphalt: new THREE.MeshStandardMaterial({ color: C.asphalt, roughness: 0.95, metalness: 0.04 }),
      edge: new THREE.MeshStandardMaterial({ color: C.accent, roughness: 0.7 }),
      dash: new THREE.MeshStandardMaterial({ color: '#dfe3e8', roughness: 0.8 }),
      cone: new THREE.MeshStandardMaterial({ color: C.accent, roughness: 0.65 }),
      coneBase: new THREE.MeshStandardMaterial({ color: '#1a1c1e', roughness: 0.9 }),
      barrier: new THREE.MeshStandardMaterial({ color: C.offwhite, roughness: 0.8 }),
      barrierStripe: new THREE.MeshStandardMaterial({ color: C.accent, roughness: 0.7 }),
      kerb: new THREE.MeshStandardMaterial({ color: C.concrete, roughness: 0.92 }),
    }),
    []
  )

  // ---- Dashed centre markings -------------------------------------
  const dashes = useMemo(() => {
    const step = 4.2
    const count = Math.floor((ROAD_LENGTH + ROAD_PAD * 2) / step)
    const arr = []
    for (let i = 0; i < count; i++) {
      const d = -ROAD_PAD + i * step + 1
      arr.push([d, roadY(d) + 0.008, roadZ(d)])
    }
    return arr
  }, [])

  // ---- Cones + barriers, sparse and deterministic -----------------
  const cones = useMemo(() => {
    const arr = []
    const n = quality === 'low' ? 14 : 30
    for (let i = 0; i < n; i++) {
      const d = (i / n) * ROAD_LENGTH + rand(i) * 6
      const side = rand(i + 40) > 0.5 ? 1 : -1
      arr.push([d, roadY(d), roadZ(d) + side * (ROAD_WIDTH / 2 - 0.22)])
    }
    return arr
  }, [quality])

  const barriers = useMemo(() => {
    const arr = []
    const n = quality === 'low' ? 5 : 11
    for (let i = 0; i < n; i++) {
      const d = 6 + (i / n) * ROAD_LENGTH + rand(i + 7) * 10
      const side = rand(i + 91) > 0.45 ? 1 : -1
      arr.push([d, roadY(d), roadZ(d) + side * (ROAD_WIDTH / 2 + 0.55)])
    }
    return arr
  }, [quality])

  return (
    <group>
      {/* compacted ground / shoulder — fades out at the far edge */}
      <mesh geometry={geos.ground} material={materials.ground} renderOrder={-1} />

      {/* asphalt */}
      <mesh geometry={geos.asphalt} material={materials.asphalt} />

      {/* construction-orange edge details */}
      <group position={[0, 0, ROAD_WIDTH / 2 - 0.05]}>
        <mesh geometry={geos.edgeL} material={materials.edge} />
      </group>
      <group position={[0, 0, -(ROAD_WIDTH / 2 - 0.05)]}>
        <mesh geometry={geos.edgeR} material={materials.edge} />
      </group>

      {/* dashed centre line */}
      {dashes.map((p, i) => (
        <mesh key={i} position={p} rotation={[-Math.PI / 2, 0, 0]} material={materials.dash}>
          <planeGeometry args={[1.5, 0.1]} />
        </mesh>
      ))}

      {/* cones */}
      {cones.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.02, 0]} material={materials.coneBase}>
            <boxGeometry args={[0.17, 0.035, 0.17]} />
          </mesh>
          <mesh position={[0, 0.14, 0]} material={materials.cone}>
            <coneGeometry args={[0.075, 0.22, 8]} />
          </mesh>
        </group>
      ))}

      {/* temporary barriers */}
      {barriers.map((p, i) => (
        <group key={i} position={p}>
          <mesh position={[0, 0.13, 0]} material={materials.barrier}>
            <boxGeometry args={[1.05, 0.055, 0.055]} />
          </mesh>
          <mesh position={[0, 0.13, 0.002]} material={materials.barrierStripe}>
            <boxGeometry args={[0.3, 0.056, 0.056]} />
          </mesh>
          <mesh position={[-0.42, 0.065, 0]} material={materials.kerb}>
            <boxGeometry args={[0.05, 0.13, 0.05]} />
          </mesh>
          <mesh position={[0.42, 0.065, 0]} material={materials.kerb}>
            <boxGeometry args={[0.05, 0.13, 0.05]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
