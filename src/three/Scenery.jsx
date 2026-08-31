import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C } from './palette'
import { ROAD_LENGTH, ROAD_WIDTH, ZONES, roadY, roadZ } from './roadPath'
import { scrollState } from '../lib/scrollStore'

const SIDE = ROAD_WIDTH / 2 + 1.15

function useSceneryMaterials() {
  return useMemo(() => {
    const make = (color, o = {}) =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness: 0.08, ...o })
    return {
      concrete: make('#8a8e94'),
      concreteDark: make('#65696f'),
      graphite: make(C.graphite, { roughness: 0.6, metalness: 0.2 }),
      orange: make(C.accent, { roughness: 0.55 }),
      bronze: make(C.steelLight, { roughness: 0.4, metalness: 0.5 }),
      offwhite: make(C.offwhite),
      steel: make(C.steel, { roughness: 0.35, metalness: 0.65 }),
      stone: make('#6b7076', { roughness: 0.95 }),
      sand: make(C.sand, { roughness: 1 }),
      gravel: make('#868c93', { roughness: 1 }),
      glass: make('#33474f', { roughness: 0.18, metalness: 0.45 }),
    }
  }, [])
}

/* ---------- Site entrance gate ---------- */
function SiteGate({ m }) {
  return (
    <group>
      {[-SIDE, SIDE].map((z) => (
        <mesh key={z} position={[0, 0.85, z]} material={m.graphite}>
          <boxGeometry args={[0.16, 1.7, 0.16]} />
        </mesh>
      ))}
      <mesh position={[0, 1.72, 0]} material={m.orange}>
        <boxGeometry args={[0.14, 0.16, SIDE * 2]} />
      </mesh>
      <mesh position={[0, 1.46, 0]} material={m.graphite}>
        <boxGeometry args={[0.1, 0.34, 2.2]} />
      </mesh>
      <mesh position={[0.06, 1.52, 0]} material={m.bronze}>
        <boxGeometry args={[0.02, 0.05, 2.0]} />
      </mesh>
    </group>
  )
}

/* ---------- Company sign board ---------- */
function CompanySign({ m }) {
  return (
    <group position={[0, 0, -SIDE - 0.3]}>
      <mesh position={[-0.5, 0.55, 0]} material={m.steel}>
        <boxGeometry args={[0.09, 1.1, 0.09]} />
      </mesh>
      <mesh position={[0.5, 0.55, 0]} material={m.steel}>
        <boxGeometry args={[0.09, 1.1, 0.09]} />
      </mesh>
      <mesh position={[0, 1.34, 0]} material={m.offwhite}>
        <boxGeometry args={[1.7, 0.9, 0.07]} />
      </mesh>
      <mesh position={[0, 1.34, 0.041]} material={m.graphite}>
        <boxGeometry args={[1.56, 0.76, 0.01]} />
      </mesh>
      <mesh position={[0, 1.52, 0.05]} material={m.orange}>
        <boxGeometry args={[1.1, 0.13, 0.01]} />
      </mesh>
      <mesh position={[-0.18, 1.28, 0.05]} material={m.bronze}>
        <boxGeometry args={[0.74, 0.07, 0.01]} />
      </mesh>
      <mesh position={[-0.3, 1.13, 0.05]} material={m.bronze}>
        <boxGeometry args={[0.5, 0.05, 0.01]} />
      </mesh>
    </group>
  )
}

/* ---------- Parked machinery ---------- */
function MachineryRow({ m }) {
  return (
    <group position={[0, 0, -SIDE - 0.6]}>
      {/* tipper truck */}
      <group position={[-1.7, 0, 0]}>
        <mesh position={[0.55, 0.42, 0]} material={m.orange}>
          <boxGeometry args={[1.1, 0.5, 0.78]} />
        </mesh>
        <mesh position={[-0.28, 0.4, 0]} material={m.graphite}>
          <boxGeometry args={[0.6, 0.46, 0.72]} />
        </mesh>
        <mesh position={[-0.28, 0.6, 0]} material={m.glass}>
          <boxGeometry args={[0.5, 0.24, 0.68]} />
        </mesh>
        {[-0.4, 0.35, 0.75].map((x) =>
          [0.37, -0.37].map((z) => (
            <mesh
              key={`${x}-${z}`}
              position={[x, 0.16, z]}
              rotation={[Math.PI / 2, 0, 0]}
              material={m.graphite}
            >
              <cylinderGeometry args={[0.16, 0.16, 0.12, 10]} />
            </mesh>
          ))
        )}
      </group>

      {/* transit mixer */}
      <group position={[0.9, 0, 0]}>
        <mesh position={[0.5, 0.62, 0]} rotation={[0, 0, 0.24]} material={m.offwhite}>
          <cylinderGeometry args={[0.28, 0.36, 1.1, 12]} />
        </mesh>
        <mesh position={[-0.32, 0.4, 0]} material={m.graphite}>
          <boxGeometry args={[0.56, 0.44, 0.7]} />
        </mesh>
        <mesh position={[0.5, 0.62, 0]} rotation={[0, 0, 0.24]} material={m.orange}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 12]} />
        </mesh>
        {[-0.4, 0.3, 0.7].map((x) =>
          [0.32, -0.32].map((z) => (
            <mesh
              key={`${x}-${z}`}
              position={[x, 0.15, z]}
              rotation={[Math.PI / 2, 0, 0]}
              material={m.graphite}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.11, 10]} />
            </mesh>
          ))
        )}
      </group>
    </group>
  )
}

/* ---------- Boom barrier that lifts as the vehicle arrives ---------- */
function LiftBarrier({ m, worldD }) {
  const boomRef = useRef(null)

  useFrame((_, delta) => {
    if (!boomRef.current) return
    const vehicleD = scrollState.journey * ROAD_LENGTH
    const near = Math.abs(vehicleD - worldD) < 11
    const target = near ? -Math.PI / 2.15 : 0
    boomRef.current.rotation.x += (target - boomRef.current.rotation.x) * Math.min(1, delta * 3.4)
  })

  return (
    <group position={[0, 0, SIDE - 0.5]}>
      <mesh position={[0, 0.06, 0]} material={m.graphite}>
        <boxGeometry args={[0.34, 0.12, 0.34]} />
      </mesh>
      <mesh position={[0, 0.42, 0]} material={m.orange}>
        <boxGeometry args={[0.2, 0.62, 0.2]} />
      </mesh>
      <group ref={boomRef} position={[0, 0.72, 0]}>
        <mesh position={[0, 0, -1.55]} material={m.offwhite}>
          <boxGeometry args={[0.09, 0.09, 3.1]} />
        </mesh>
        {[-0.5, -1.2, -1.9, -2.6].map((z) => (
          <mesh key={z} position={[0.001, 0.001, z]} material={m.orange}>
            <boxGeometry args={[0.095, 0.095, 0.34]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ---------- Structures under construction ---------- */
function Structures({ m }) {
  const cols = [0, 1.05, 2.1]
  return (
    <group position={[0, 0, -SIDE - 1.5]}>
      {[0, 1, 2].map((floor) => (
        <mesh key={floor} position={[1.05, 0.8 + floor * 0.78, 0]} material={m.concrete}>
          <boxGeometry args={[2.5, 0.12, 1.7]} />
        </mesh>
      ))}
      {cols.map((x) =>
        [0.7, -0.7].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.28, z]} material={m.concreteDark}>
            <boxGeometry args={[0.16, 2.55, 0.16]} />
          </mesh>
        ))
      )}
      {/* scaffold */}
      <group position={[2.5, 0, 0.85]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 0.35 + i * 0.72, 0]} material={m.steel}>
            <boxGeometry args={[1.4, 0.04, 0.04]} />
          </mesh>
        ))}
        {[-0.65, 0.65].map((x) => (
          <mesh key={x} position={[x, 1.45, 0]} material={m.steel}>
            <boxGeometry args={[0.05, 2.9, 0.05]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/* ---------- Aggregate / material yard ---------- */
function MaterialYard({ m }) {
  const piles = [
    { x: -1.4, r: 0.72, h: 0.62, mat: m.stone },
    { x: 0.1, r: 0.62, h: 0.52, mat: m.gravel },
    { x: 1.45, r: 0.68, h: 0.58, mat: m.sand },
  ]
  return (
    <group position={[0, 0, -SIDE - 0.9]}>
      {piles.map((p) => (
        <mesh key={p.x} position={[p.x, p.h / 2, 0]} material={p.mat}>
          <coneGeometry args={[p.r, p.h, 10]} />
        </mesh>
      ))}
      {/* stacked stone blocks */}
      <group position={[2.7, 0, 0.3]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.02, 0.16 + i * 0.3, 0]} material={m.stone}>
            <boxGeometry args={[0.62, 0.3, 0.5]} />
          </mesh>
        ))}
      </group>
      {/* yard marker */}
      <mesh position={[-2.6, 0.4, 0.4]} material={m.orange}>
        <boxGeometry args={[0.07, 0.8, 0.07]} />
      </mesh>
    </group>
  )
}

/* ---------- Tower crane ---------- */
function TowerCrane({ m, height = 3.4 }) {
  const hookRef = useRef(null)
  const t = useRef(0)

  useFrame((_, delta) => {
    t.current += delta * 0.5
    if (hookRef.current) hookRef.current.position.y = -1.25 + Math.sin(t.current) * 0.28
  })

  return (
    <group position={[0, 0, -SIDE - 2.6]}>
      {/* base */}
      <mesh position={[0, 0.12, 0]} material={m.concreteDark}>
        <boxGeometry args={[0.9, 0.24, 0.9]} />
      </mesh>
      {/* mast */}
      <mesh position={[0, height / 2, 0]} material={m.orange}>
        <boxGeometry args={[0.26, height, 0.26]} />
      </mesh>
      {/* mast lattice hint */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[0, 0.6 + i * (height / 8), 0]} material={m.orange}>
          <boxGeometry args={[0.34, 0.035, 0.34]} />
        </mesh>
      ))}
      {/* jib */}
      <group position={[0, height, 0]}>
        <mesh position={[1.4, 0, 0]} material={m.orange}>
          <boxGeometry args={[3.4, 0.14, 0.14]} />
        </mesh>
        <mesh position={[-0.8, 0, 0]} material={m.orange}>
          <boxGeometry args={[1.3, 0.14, 0.14]} />
        </mesh>
        <mesh position={[-1.5, 0.16, 0]} material={m.graphite}>
          <boxGeometry args={[0.5, 0.3, 0.34]} />
        </mesh>
        <mesh position={[0, 0.55, 0]} material={m.graphite}>
          <boxGeometry args={[0.2, 0.9, 0.2]} />
        </mesh>
        {/* cable + hook */}
        <group position={[2.1, 0, 0]}>
          <mesh position={[0, -0.62, 0]} material={m.steel}>
            <boxGeometry args={[0.02, 1.24, 0.02]} />
          </mesh>
          <mesh ref={hookRef} position={[0, -1.5, 0]} material={m.graphite}>
            <boxGeometry args={[0.14, 0.2, 0.14]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

/* ---------- Completed building ---------- */
function FinishedBuilding({ m }) {
  return (
    <group position={[0, 0, -SIDE - 1.6]}>
      <mesh position={[0, 1.45, 0]} material={m.offwhite}>
        <boxGeometry args={[2.6, 2.9, 2.0]} />
      </mesh>
      <mesh position={[0, 2.96, 0]} material={m.graphite}>
        <boxGeometry args={[2.75, 0.12, 2.15]} />
      </mesh>
      {[0.7, 1.4, 2.1, 2.6].map((y) => (
        <mesh key={y} position={[0, y, 1.005]} material={m.glass}>
          <boxGeometry args={[2.2, 0.42, 0.02]} />
        </mesh>
      ))}
      <mesh position={[0, 0.28, 1.01]} material={m.bronze}>
        <boxGeometry args={[0.62, 0.56, 0.03]} />
      </mesh>
      <mesh position={[-1.31, 1.45, 0]} material={m.orange}>
        <boxGeometry args={[0.03, 2.9, 0.12]} />
      </mesh>
      {/* landscaped forecourt */}
      <mesh position={[0, 0.02, 1.6]} material={m.concreteDark}>
        <boxGeometry args={[3.0, 0.04, 1.1]} />
      </mesh>
    </group>
  )
}

/* ---------- Road-end marker ---------- */
function RoadEnd({ m }) {
  return (
    <group>
      <mesh position={[0, 0.35, 0]} material={m.offwhite}>
        <boxGeometry args={[0.12, 0.1, ROAD_WIDTH - 0.2]} />
      </mesh>
      {[-0.9, 0, 0.9].map((z) => (
        <mesh key={z} position={[0, 0.18, z]} material={m.orange}>
          <boxGeometry args={[0.14, 0.36, 0.14]} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------------------------------------------------------------
   Scenery placed along the journey.
   Each zone sits at the scroll position of the matching section,
   so what passes the window matches what is being read:
   entrance → company sign → machinery → barrier → structures →
   material yard → crane → completed project.
--------------------------------------------------------------- */
export default function Scenery({ quality = 'high' }) {
  const m = useSceneryMaterials()
  const low = quality === 'low'

  const placed = useMemo(() => ZONES.map((zone) => ({ ...zone, d: zone.at * ROAD_LENGTH })), [])

  return (
    <group>
      {placed.map((zone) => {
        const pos = [zone.d, roadY(zone.d), roadZ(zone.d)]
        let content = null

        switch (zone.kind) {
          case 'gate':
            content = <SiteGate m={m} />
            break
          case 'sign':
            content = <CompanySign m={m} />
            break
          case 'machinery':
            content = <MachineryRow m={m} />
            break
          case 'barrier':
            content = <LiftBarrier m={m} worldD={zone.d} />
            break
          case 'structures':
            content = <Structures m={m} />
            break
          case 'yard':
            content = <MaterialYard m={m} />
            break
          case 'crane':
            content = <TowerCrane m={m} height={low ? 2.9 : 3.4} />
            break
          case 'finished':
            content = <FinishedBuilding m={m} />
            break
          default:
            content = null
        }

        return (
          <group key={zone.id} position={pos}>
            {content}
          </group>
        )
      })}

      {/* the road terminates just past the final zone */}
      <group position={[ROAD_LENGTH + 2, roadY(ROAD_LENGTH + 2), roadZ(ROAD_LENGTH + 2)]}>
        <RoadEnd m={m} />
      </group>

    </group>
  )
}
