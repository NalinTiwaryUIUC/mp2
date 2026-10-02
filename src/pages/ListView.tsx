import { Link, useSearchParams } from 'react-router-dom'
import type { Pokemon } from '../types/pokemon'
import {
  detailUrl,
  displayName,
  filterAndSortPokemon,
  pokemonNumber,
} from '../utils/pokemon'

interface ListViewProps {
  pokemon: Pokemon[]
}

export default function ListView({ pokemon }: ListViewProps) {
  const [params, setParams] = useSearchParams()
  const results = filterAndSortPokemon(pokemon, params)

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    setParams(next, { replace: true })
  }

  return (
    <section className="browse-page">
      <div className="page-heading">
        <p className="eyebrow">Original 151</p>
        <h1>Pokédex</h1>
        <p>Search by name or number, then select a Pokémon to learn more.</p>
      </div>

      <div className="toolbar">
        <div className="search-control">
          <label htmlFor="pokemon-search">Search Pokémon</label>
          <input
            id="pokemon-search"
            type="search"
            placeholder="Try Pikachu or 025"
            value={params.get('q') ?? ''}
            onChange={(event) => updateParam('q', event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sort-property">Sort by</label>
          <select
            id="sort-property"
            value={params.get('sort') ?? 'number'}
            onChange={(event) => updateParam('sort', event.target.value)}
          >
            <option value="number">Pokédex number</option>
            <option value="name">Name</option>
            <option value="weight">Weight</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-order">Order</label>
          <select
            id="sort-order"
            value={params.get('order') ?? 'asc'}
            onChange={(event) => updateParam('order', event.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <button type="button" onClick={() => setParams({})}>
          Reset
        </button>
      </div>

      <p className="result-count" role="status">
        {results.length} of {pokemon.length} Pokémon
      </p>

      {results.length === 0 ? (
        <div className="empty-state">
          <h2>No Pokémon found</h2>
          <p>Try a different name or number, or reset your search.</p>
        </div>
      ) : (
        <ul className="pokemon-list">
          {results.map((item) => (
            <li key={item.id}>
              <Link
                className="pokemon-row"
                to={detailUrl(item.id, params, 'list')}
              >
                <span className="pokemon-number">
                  {pokemonNumber(item.id)}
                </span>

                <h2>{displayName(item.name)}</h2>

                <span className="type-badges">
                  {item.types.map((type) => (
                    <span className={`type-badge type-${type}`} key={type}>
                      {displayName(type)}
                    </span>
                  ))}
                </span>

                <span className="row-weight">{item.weight} kg</span>
                <span className="row-arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}