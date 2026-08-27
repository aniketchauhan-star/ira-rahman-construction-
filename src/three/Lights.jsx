/**
 * Industrial daylight rig — warm low sun, soft sky fill and a
 * small orange bounce that echoes the brand highlight.
 * No coloured RGB, no neon.
 */
export default function Lights({ shadows = false, intensity = 1 }) {
  return (
    <>
      <ambientLight intensity={0.55 * intensity} color="#e9e3d6" />

      {/* Warm directional sun */}
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.45 * intensity}
        color="#ffe9c9"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0008}
      />

      {/* Cool sky fill from behind keeps the graphite from going flat */}
      <directionalLight position={[-7, 5, -6]} intensity={0.42 * intensity} color="#c9d3da" />

      {/* Low warm bounce off the ground */}
      <hemisphereLight args={['#f2e6cf', '#2a2724', 0.5 * intensity]} />

      {/* Subtle construction-orange rim */}
      <pointLight position={[-2.4, 1.2, 2.6]} intensity={2.2 * intensity} distance={7} color="#e86a00" />
    </>
  )
}
