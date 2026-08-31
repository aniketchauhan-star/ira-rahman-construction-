import { useEffect, useRef, useState } from 'react'
import './SmartImage.css'
import { content } from '../data/content'

/**
 * Image with a designed fallback.
 *
 * If the file has not been added to /public/assets/ yet, the site
 * shows a graphite/cream placeholder naming the exact folder the
 * photograph belongs in — instead of a broken-image icon.
 */
export default function SmartImage({
  src,
  alt,
  folderLabel = '/assets/',
  kindLabel = 'IMAGE',
  className = '',
  imgClassName = '',
  eager = false,
  onLoaded,
}) {
  const [status, setStatus] = useState('loading') // loading | ready | missing
  const imgRef = useRef(null)

  useEffect(() => {
    setStatus('loading')
  }, [src])

  // Catch images restored from cache that fire `load` before hydration.
  useEffect(() => {
    const el = imgRef.current
    if (el && el.complete && el.naturalWidth > 0) {
      setStatus('ready')
      onLoaded?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src])

  if (status === 'missing') {
    return (
      <div className={`smart-image smart-image--missing ${className}`} role="img" aria-label={alt}>
        <div className="smart-image__ph">
          <span className="smart-image__ph-grid" aria-hidden="true" />
          <span className="smart-image__ph-kind">{kindLabel}</span>
          <span className="smart-image__ph-hint">{content.placeholders.hint}</span>
          <span className="smart-image__ph-path">{folderLabel}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`smart-image ${className}`} data-status={status}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`smart-image__img ${imgClassName}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : 'auto'}
        onLoad={() => {
          setStatus('ready')
          onLoaded?.()
        }}
        onError={() => setStatus('missing')}
      />
    </div>
  )
}
