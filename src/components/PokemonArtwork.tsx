import { useState } from 'react'

interface PokemonArtworkProps {
  src: string | null
  alt: string
  loading?: 'lazy' | 'eager'
}

export default function PokemonArtwork({
  src,
  alt,
  loading = 'lazy',
}: PokemonArtworkProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className="artwork-placeholder" role="img" aria-label={alt}>
        Artwork unavailable
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}