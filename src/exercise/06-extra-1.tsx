// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.tsx

import * as React from 'react'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'
import {PokemonData} from '../types'

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const [pokemon, setPokemon] = React.useState<PokemonData | null>(null)
  const [error, setError] = React.useState<null | Error>()

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    /**
     * ここで一旦 null にしておくことで、fetch から値が返ってくるまでは
     * null の条件分岐を発生させて、PokemonInfoFallback を発生させている
     */
    setPokemon(null)
    setError(null)
    /**
     * fetch API では .then の第2引数にエラーハンドリングする関数を指定できる
     */
    fetchPokemon(pokemonName).then(
      pokemon => setPokemon(pokemon),
      error => setError(error),
    )
  }, [pokemonName])

  if (error) {
    return (
      // div タグの role 属性はアクセシビリティを向上するための属性
      // タグで指定している要素の「役割」を定義する
      // alert はウィジェットロールの1つである
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  }

  if (!pokemonName) {
    return <span>Submit a pokemon</span>
  } else if (!pokemon) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName: string) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export {App}
