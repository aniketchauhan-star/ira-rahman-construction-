import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Lights from './Lights'
import ConstructionRoad from './ConstructionRoad'
import Scenery from './Scenery'
import Dust from './Dust'
import VehicleModel from './VehicleModel'
import StaticRoad from './StaticRoad'
import { ROAD_LENGTH, roadPitch, roadY, roadYaw, roadZ } from './roadPath'
import { damp, scrollState } from '../lib/scrollStore'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useIsMobile } from '../hooks/useMediaQuery'
import { useWebGL } from '../hooks/useWebGL'
import './RoadJourney.css'
import ChromeEnvironment from './ChromeEnvironment'

/* ---------------------------------------------------------------
   Camera
   Orthographic, at a gentle three-quarter angle. Orthographic keeps
   the very wide, short band free of the extreme edge distortion a
   perspective camera would produce at this aspect ratio.
--------------------------------------------------------------- */
function BandCamera({ viewHeight = 4.8, groundLine = 0.22 }) {
  const { size, set } = useThree()
  const camRef = useRef(null)

  useEffect(() => {
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 160)
    camRef.current = cam
    set({ camera: cam })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const cam = camRef.current
    if (!cam) return

    // Place the road surface `groundLine` of the way up the band so
    // the machine sits low in frame and tall scenery has headroom.
    const targetY = viewHeight * (0.5 - groundLine)
    const target = new THREE.Vector3(0, targetY, 0)

    // A shallow 16° elevation, square to the road. Any sideways
    // component here would tilt the whole road across the band, so
    // the three-quarter read comes from the road's own curve and the
    // depth of the scenery instead.
    cam.position.copy(target).add(new THREE.Vector3(0, 0.28, 1).normalize().multiplyScalar(50))
    cam.lookAt(target)

    const zoom = size.height / viewHeight
    cam.left = -size.width / 2 / zoom
    cam.right = size.width / 2 / zoom
    cam.top = size.height / 2 / zoom
    cam.bottom = -size.height / 2 / zoom
    cam.updateProjectionMatrix()
  }, [size, viewHeight, groundLine])

  return null
}

/* ---------------------------------------------------------------
   The journey rig
   The world slides beneath a vehicle that stays in frame, which is
   what lets the road run for the entire length of the site without
   the camera ever losing the machine.
--------------------------------------------------------------- */
function JourneyRig({ quality }) {
  const worldRef = useRef(null)
  const vehicleRef = useRef(null)
  const smooth = useRef(0)

  useFrame((_, delta) => {
    const dt = Math.min(0.05, delta)

    // Interpolate toward the scroll position rather than snapping —
    // scrolling up runs the whole rig backwards, naturally.
    smooth.current = damp(smooth.current, scrollState.journey, 6.5, dt)
    scrollState.smoothProgress = smooth.current

    const d = smooth.current * ROAD_LENGTH

    if (worldRef.current) worldRef.current.position.x = -d

    const v = vehicleRef.current
    if (v) {
      v.position.set(0, roadY(d), roadZ(d))
      v.rotation.set(0, roadYaw(d), roadPitch(d))
    }
  })

  return (
    <>
      <group ref={worldRef}>
        <ConstructionRoad quality={quality} />
        <Scenery quality={quality} />
      </group>

      <group ref={vehicleRef}>
        <Suspense fallback={null}>
          <VehicleModel quality={quality} />
        </Suspense>
        <Dust quality={quality} />

        {/* Cheap contact shadow — far less costly than a shadow map. */}
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.3, 1.2]} />
          <meshBasicMaterial color="#0b0c0d" transparent opacity={0.38} depthWrite={false} />
        </mesh>
      </group>
    </>
  )
}

/* ---------------------------------------------------------------
   Fixed band
--------------------------------------------------------------- */
export default function RoadJourney() {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const hasWebGL = useWebGL()
  const [hidden, setHidden] = useState(false)

  // The road terminates at the CTA — it should not run under the footer.
  useEffect(() => {
    const footer = document.getElementById('footer')
    if (!footer || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), {
      rootMargin: '0px 0px -8% 0px',
    })
    io.observe(footer)
    return () => io.disconnect()
  }, [])

  if (reduced || !hasWebGL) {
    return <StaticRoad hidden={hidden} reason={reduced ? 'reduced-motion' : 'no-webgl'} />
  }

  const quality = isMobile ? 'low' : 'high'

  return (
    <div
      className={`road-band ${hidden ? 'road-band--hidden' : ''}`}
      aria-hidden="true"
      data-quality={quality}
    >
      <Canvas
        frameloop={hidden ? 'never' : 'always'}
        dpr={isMobile ? [1, 1.4] : [1, 1.9]}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0)
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
        shadows={false}
      >
        <BandCamera viewHeight={isMobile ? 4.3 : 4.9} groundLine={0.22} />
        <ChromeEnvironment resolution={128} />
        <Lights intensity={0.88} />
        <fog attach="fog" args={['#15181a', 46, 90]} />
        <JourneyRig quality={quality} />
      </Canvas>
    </div>
  )
}
