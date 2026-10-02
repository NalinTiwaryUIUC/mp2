import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import PokemonArtwork from '../components/PokemonArtwork'
import type { Pokemon } from '../types/pokemon'
import {
  detailUrl,
  displayName,
  filterAndSortPokemon,
  pokemonNumber,
} from '../utils/pokemon'

interface DetailViewProps {
  pokemon: Pokemon[]
}

export default function DetailView({ pokemon }: DetailViewProps) {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const selected = pokemon.find((item) => item.id === Number(id))
  const view = params.get('view') === 'gallery' ? 'gallery' : 'list'

  const backParams = new URLSearchParams(params)
  backParams.delete('view')
  const backUrl = `/${view}?${backParams.toString()}`

  if (!selected) {
    return (
      <section className="empty-state">
        <h1>Pokémon not found</h1>
        <p>This Pokédex contains Pokémon numbered 1 through 151.</p>
        <Link to="/list">Return to the list</Link>
      </section>
    )
  }

  const filtered = filterAndSortPokemon(pokemon, params)
  const sequence = filtered.some((item) => item.id === selected.id)
    ? filtered
    : pokemon
  const index = sequence.findIndex((item) => item.id === selected.id)

  function move(direction: number) {
    const nextIndex =
      (index + direction + sequence.length) % sequence.length
    const nextPokemon = sequence[nextIndex]

    if (nextPokemon) {
      navigate(detailUrl(nextPokemon.id, params, view))
    }
  }

  return (
    <section className="detail-page">
      <Link className="back-link" to={backUrl}>
        ← Back to {view}
      </Link>

      <div className="detail-layout">
        <div className="detail-art">
          <PokemonArtwork
            key={selected.id}
            src={selected.image}
            alt={displayName(selected.name)}
            loading="eager"
          />
        </div>

        <div className="detail-information">
          <p className="eyebrow">{pokemonNumber(selected.id)}</p>
          <h1>{displayName(selected.name)}</h1>

          <div className="type-badges">
            {selected.types.map((type) => (
              <span
                className={`type-badge type-${type}`}
                key={type}
              >
                {displayName(type)}
              </span>
            ))}
          </div>

          <dl className="pokemon-facts">
            <div>
              <dt>Height</dt>
              <dd>{selected.height} m</dd>
            </div>

            <div>
              <dt>Weight</dt>
              <dd>{selected.weight} kg</dd>
            </div>

            <div>
              <dt>Abilities</dt>
              <dd>
                {selected.abilities.map(displayName).join(', ')}
              </dd>
            </div>
          </dl>

          <h2>Base stats</h2>

          <ul className="stat-list">
            {selected.stats.map((stat) => (
              <li key={stat.name}>
                <span>{displayName(stat.name)}</span>

                <progress
                  value={stat.value}
                  max={255}
                  aria-label={`${displayName(stat.name)}: ${stat.value}`}
                />

                <strong>{stat.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <nav className="detail-navigation" aria-label="Browse Pokémon">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={sequence.length <= 1}
        >
          ← Previous
        </button>

        <span>
          {index + 1} of {sequence.length}
        </span>

        <button
          type="button"
          onClick={() => move(1)}
          disabled={sequence.length <= 1}
        >
          Next →
        </button>
      </nav>
    </section>
  )
}