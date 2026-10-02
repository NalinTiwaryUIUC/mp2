import { Link, useSearchParams } from 'react-router-dom'
import PokemonArtwork from '../components/PokemonArtwork'
import type { Pokemon } from '../types/pokemon'
import {
  detailUrl,
  displayName,
  filterAndSortPokemon,
  pokemonNumber,
} from '../utils/pokemon'

interface GalleryViewProps {
  pokemon: Pokemon[]
}

export default function GalleryView({ pokemon }: GalleryViewProps) {
  const [params, setParams] = useSearchParams()
  const results = filterAndSortPokemon(pokemon, params)
  const availableTypes = [
    ...new Set(pokemon.flatMap((item) => item.types)),
  ].sort()
  const selectedTypes = (params.get('types') ?? '')
    .split(',')
    .filter(Boolean)

  function toggleType(type: string) {
    const next = new URLSearchParams(params)
    const types = selectedTypes.includes(type)
      ? selectedTypes.filter((selected) => selected !== type)
      : [...selectedTypes, type]

    if (types.length > 0) {
      next.set('types', types.join(','))
    } else {
      next.delete('types')
    }

    setParams(next, { replace: true })
  }

  function updateSearch(value: string) {
    const next = new URLSearchParams(params)

    if (value) {
      next.set('q', value)
    } else {
      next.delete('q')
    }

    setParams(next, { replace: true })
  }

  return (
    <section className="browse-page">
      <div className="page-heading">
        <p className="eyebrow">Original 151</p>
        <h1>Pokémon gallery</h1>
        <p>Browse the artwork and select a Pokémon for its details.</p>
      </div>

      <div className="toolbar gallery-toolbar">
        <div className="search-control">
          <label htmlFor="gallery-search">Search Pokémon</label>
          <input
            id="gallery-search"
            type="search"
            placeholder="Search by name or number"
            value={params.get('q') ?? ''}
            onChange={(event) => updateSearch(event.target.value)}
          />
        </div>

        <button type="button" onClick={() => setParams({})}>
          Reset filters
        </button>
      </div>

      <fieldset className="type-filters">
        <legend>Filter by type</legend>
        <p>Select one or more types. Results match any selected type.</p>

        <div className="filter-buttons">
          {availableTypes.map((type) => (
            <button
              className="filter-button"
              type="button"
              key={type}
              aria-pressed={selectedTypes.includes(type)}
              onClick={() => toggleType(type)}
            >
              {displayName(type)}
            </button>
          ))}
        </div>
      </fieldset>

      <p className="result-count" role="status">
        {results.length} of {pokemon.length} Pokémon
      </p>

      {results.length === 0 ? (
        <div className="empty-state">
          <h2>No Pokémon found</h2>
          <p>Try another search or reset your filters.</p>
        </div>
      ) : (
        <ul className="pokemon-gallery">
          {results.map((item) => (
            <li key={item.id}>
              <Link
                className="pokemon-card"
                to={detailUrl(item.id, params, 'gallery')}
              >
                <div className="card-topline">
                  <span className="pokemon-number">
                    {pokemonNumber(item.id)}
                  </span>
                  <span aria-hidden="true">↗</span>
                </div>

                <div className="card-art">
                  <PokemonArtwork
                    src={item.image}
                    alt={displayName(item.name)}
                  />
                </div>

                <h2>{displayName(item.name)}</h2>

                <div className="type-badges">
                  {item.types.map((type) => (
                    <span className={`type-badge type-${type}`} key={type}>
                      {displayName(type)}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}