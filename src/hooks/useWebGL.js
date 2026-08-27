import { useEffect, useState } from 'react'

let cached = null

function detect() {
  if (cached !== null) return cached
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    cached = Boolean(gl)
    if (gl && gl.getExtension) gl.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    cached = false
  }
  return cached
}

/**
 * WebGL capability check. Every 3D surface on the site falls back
 * to a styled CSS equivalent when this returns false, so the site
 * never breaks on unsupported or blocked GPUs.
 */
export function useWebGL() {
  const [supported, setSupported] = useState(true)
  useEffect(() => setSupported(detect()), [])
  return supported
}

export default useWebGL
