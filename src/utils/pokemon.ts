import type { Pokemon } from '../types/pokemon'

export function displayName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function pokemonNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`
}

export function filterAndSortPokemon(
  pokemon: Pokemon[],
  params: URLSearchParams,
): Pokemon[] {
  const query = (params.get('q') ?? '').trim().toLowerCase()
  const selectedTypes = (params.get('types') ?? '')
    .split(',')
    .filter(Boolean)
  const sort = params.get('sort') ?? 'number'
  const direction = params.get('order') === 'desc' ? -1 : 1

  return pokemon
    .filter((item) => {
      const matchesQuery =
        displayName(item.name).toLowerCase().includes(query) ||
        item.name.includes(query) ||
        pokemonNumber(item.id).includes(query) ||
        String(item.id).includes(query)

      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((type) => item.types.includes(type))

      return matchesQuery && matchesType
    })
    .sort((a, b) => {
      let comparison: number

      if (sort === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sort === 'weight') {
        comparison = a.weight - b.weight
      } else {
        comparison = a.id - b.id
      }

      return direction * (comparison || a.id - b.id)
    })
}

export function detailUrl(
  id: number,
  params: URLSearchParams,
  view: 'list' | 'gallery',
): string {
  const next = new URLSearchParams(params)
  next.set('view', view)

  return `/pokemon/${id}?${next.toString()}`
}