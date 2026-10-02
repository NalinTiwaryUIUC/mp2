import { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { loadPokemonCollection } from './api/pokemon'
import DetailView from './pages/DetailView'
import GalleryView from './pages/GalleryView'
import ListView from './pages/ListView'
import type { Pokemon } from './types/pokemon'

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  )
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true

    loadPokemonCollection()
      .then((results) => {
        if (active) {
          setPokemon(results)
          setStatus('ready')
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error
              ? reason.message
              : 'Something went wrong while loading Pokémon.',
          )
          setStatus('error')
        }
      })

    return () => {
      active = false
    }
  }, [attempt])

  function retry() {
    setStatus('loading')
    setError('')
    setAttempt((current) => current + 1)
  }

  return (
    <div className="app">
      <header className="site-header">
        <Link className="site-name" to="/list">
          Pokédex
        </Link>

        <span className="site-subtitle">Kanto · 001–151</span>

        <nav className="view-navigation" aria-label="Main navigation">
          <NavLink to="/list">List</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
        </nav>
      </header>

      <main className="content">
        {status === 'loading' && (
          <div className="loading-state" role="status">
            <h1>Loading Pokémon</h1>
            <p>
              Gathering the original 151. The first visit may take a moment.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="empty-state" role="alert">
            <h1>Unable to load Pokémon</h1>
            <p>{error}</p>
            <button type="button" onClick={retry}>
              Try again
            </button>
          </div>
        )}

        {status === 'ready' && (
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/list" replace />}
            />

            <Route
              path="/list"
              element={<ListView pokemon={pokemon} />}
            />

            <Route
              path="/gallery"
              element={<GalleryView pokemon={pokemon} />}
            />

            <Route
              path="/pokemon/:id"
              element={<DetailView pokemon={pokemon} />}
            />

            <Route
              path="*"
              element={
                <section className="empty-state">
                  <h1>Page not found</h1>
                  <Link to="/list">Return to the Pokédex</Link>
                </section>
              }
            />
          </Routes>
        )}
      </main>

      <footer className="site-footer">
        <p>
          Data and artwork provided through{' '}
          <a href="https://pokeapi.co/">PokéAPI</a>.
        </p>
        <p>A student project by Nalin Tiwary.</p>
      </footer>
    </div>
  )
}

export default App