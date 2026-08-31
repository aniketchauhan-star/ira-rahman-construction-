import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/**
 * A metal surface can only show what is around it. A metallic
 * material has almost no diffuse response, so with nothing in the
 * scene to reflect it renders close to black — which is exactly what
 * happened when the palette moved to polished steel.
 *
 * This bakes a small studio cubemap from geometry: a graded shell
 * (bright above, dark below, like real sky-over-ground), a broad
 * overhead softbox for the long highlight that reads as brushed
 * metal, and two side cards. No network request, no HDR file, and
 * `frames={1}` renders it once so it costs nothing per frame.
 */
export default function ChromeEnvironment({ resolution = 128, intensity = 1 }) {
  return (
    <Environment resolution={resolution} frames={1} background={false}>
      {/* Upper shell — what the top surfaces reflect. Kept well off
          black so chrome reads as chrome rather than as a silhouette. */}
      <mesh scale={100}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshBasicMaterial side={THREE.BackSide} color="#5c6670" />
      </mesh>

      {/* Lower shell — darker ground half. */}
      <mesh scale={99} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial side={THREE.BackSide} color="#1a1f24" />
      </mesh>

      {/* Overhead softbox — the primary specular streak. */}
      <mesh position={[0, 26, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[70, 26]} />
        <meshBasicMaterial color="#ffffff" opacity={intensity} transparent />
      </mesh>

      {/* Key card, front-left. */}
      <mesh position={[-30, 8, 26]} rotation={[0, Math.PI / 4, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshBasicMaterial color="#e8eef5" opacity={0.85 * intensity} transparent />
      </mesh>

      {/* Cool fill, back-right — the blue cast the logo's chrome has. */}
      <mesh position={[34, 12, -26]} rotation={[0, -Math.PI / 3, 0]}>
        <planeGeometry args={[40, 34]} />
        <meshBasicMaterial color="#93a9c2" opacity={0.7 * intensity} transparent />
      </mesh>
    </Environment>
  )
}
