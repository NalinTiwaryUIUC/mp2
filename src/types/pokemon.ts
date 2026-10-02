export interface PokemonStat {
  name: string
  value: number
}

export interface Pokemon {
  id: number
  name: string
  image: string | null
  types: string[]
  height: number
  weight: number
  abilities: string[]
  stats: PokemonStat[]
}

export interface PokemonApiResponse {
  id: number
  name: string
  height: number
  weight: number
  types: {
    slot: number
    type: { name: string }
  }[]
  abilities: {
    ability: { name: string }
    is_hidden: boolean
  }[]
  stats: {
    base_stat: number
    stat: { name: string }
  }[]
  sprites: {
    front_default: string | null
    other: {
      'official-artwork': {
        front_default: string | null
      }
    }
  }
}