import axios from 'axios'
import type { Pokemon, PokemonApiResponse } from '../types/pokemon'

export const POKEMON_COUNT = 151

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  timeout: 20000,
})

const memoryCache = new Map<number, Pokemon>()
let collectionRequest: Promise<Pokemon[]> | null = null

function cacheKey(id: number): string {
  return `mp2-pokemon-v1-${id}`
}

function readCache(id: number): Pokemon | null {
  const existing = memoryCache.get(id)

  if (existing) {
    return existing
  }

  try {
    const stored = localStorage.getItem(cacheKey(id))

    if (!stored) {
      return null
    }

    const pokemon = JSON.parse(stored) as Pokemon

    if (
      pokemon.id !== id ||
      typeof pokemon.name !== 'string' ||
      !Array.isArray(pokemon.types) ||
      !Array.isArray(pokemon.stats) ||
      !Array.isArray(pokemon.abilities)
    ) {
      return null
    }

    memoryCache.set(id, pokemon)
    return pokemon
  } catch {
    return null
  }
}

function saveCache(pokemon: Pokemon): void {
  memoryCache.set(pokemon.id, pokemon)

  try {
    localStorage.setItem(
      cacheKey(pokemon.id),
      JSON.stringify(pokemon),
    )
  } catch {
    // The app still works if browser storage is unavailable.
  }
}

async function loadPokemon(id: number): Promise<Pokemon> {
  const cached = readCache(id)

  if (cached) {
    return cached
  }

  const { data } = await api.get<PokemonApiResponse>(`pokemon/${id}/`)

  const pokemon: Pokemon = {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other['official-artwork'].front_default ??
      data.sprites.front_default,
    types: [...data.types]
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),
    height: data.height / 10,
    weight: data.weight / 10,
    abilities: data.abilities.map((entry) => entry.ability.name),
    stats: data.stats.map((entry) => ({
      name: entry.stat.name,
      value: entry.base_stat,
    })),
  }

  saveCache(pokemon)
  return pokemon
}

async function buildCollection(): Promise<Pokemon[]> {
  const pokemon: Pokemon[] = new Array(POKEMON_COUNT)
  const workerCount = 6

  async function worker(start: number): Promise<void> {
    for (let id = start; id <= POKEMON_COUNT; id += workerCount) {
      pokemon[id - 1] = await loadPokemon(id)
    }
  }

  const results = await Promise.allSettled(
    Array.from(
      { length: workerCount },
      (_, index) => worker(index + 1),
    ),
  )

  const failed = results.find((result) => result.status === 'rejected')

  if (failed) {
    throw new Error(
      'Unable to load all Pokémon. Check your connection and try again.',
    )
  }

  return pokemon
}

export function loadPokemonCollection(): Promise<Pokemon[]> {
  if (collectionRequest) {
    return collectionRequest
  }

  collectionRequest = buildCollection().then(
    (pokemon) => {
      collectionRequest = null
      return pokemon
    },
    (error: unknown) => {
      collectionRequest = null
      throw error
    },
  )

  return collectionRequest
}