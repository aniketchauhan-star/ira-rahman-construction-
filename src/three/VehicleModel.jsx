import { Component, Suspense, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import ConstructionVehicle from './ConstructionVehicle'

const MODEL_URL = '/assets/models/construction-vehicle.glb'

/**
 * OPTIONAL GLB
 * ---------------------------------------------------------------
 * If /assets/models/construction-vehicle.glb is present it is used;
 * otherwise the procedural Three.js excavator is rendered instead.
 *
 * Three layers of safety, because the site must never break on a
 * missing or malformed model:
 *   1. a HEAD request before the loader is ever mounted
 *   2. Suspense, so a slow model never blocks the first paint
 *   3. an error boundary, in case the file exists but fails to parse
 */

class ModelBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.warn('[irha] GLB vehicle failed to load — using the procedural model.', error?.message)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

function GLTFVehicle({ scale = 1 }) {
  const { scene } = useGLTF(MODEL_URL)
  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = false
        o.receiveShadow = false
      }
    })
  }, [scene])
  return <primitive object={scene} scale={scale} />
}

export default function VehicleModel({ quality = 'high' }) {
  const [hasModel, setHasModel] = useState(false)
  const fallback = <ConstructionVehicle quality={quality} />

  useEffect(() => {
    let cancelled = false
    fetch(MODEL_URL, { method: 'HEAD' })
      .then((res) => {
        const type = res.headers.get('content-type') || ''
        // A dev server happily returns index.html for a missing file,
        // so an HTML response counts as "no model".
        if (!cancelled && res.ok && !type.includes('text/html')) setHasModel(true)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!hasModel) return fallback

  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GLTFVehicle />
      </Suspense>
    </ModelBoundary>
  )
}
