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
  const [status, setStatus] = React.useState('idle')
  const [pokemon, setPokemon] = React.useState<PokemonData | null>(null)
  const [error, setError] = React.useState<null | Error>(null)

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    /**
     * JSX で表示する内容の分岐は専用の status に関する変数に依存させる
     */
    setStatus('pending')
    fetchPokemon(pokemonName).then(
      pokemon => {
        /**
         * 課題
         * React では状態を変更した際に再レンダリングが実行される
         * しかしたいていは複数の変更は一括して1回のみ実行されるようになっている
         *
         * しかし非同期な呼び出しの場合には異なり、例えば以下で設定している内容に関して
         * setStatus('resolved') を先に呼びだせば再レンダリングが実行されてしまい
         * pokemon が null の状態になってしまってエラーが発生する
         *
         * 将来的にはこれを useReducer を使用すれば解決できる
         */
        setPokemon(pokemon)
        setStatus('resolved')
      },
      error => {
        setError(error)
        setStatus('rejected')
      },
    )
  }, [pokemonName])

  /**
   * 以下の分岐では、型ガードも含めて null を除外するように指定する必要あり
   */
  if (status === 'idle') {
    return <span>Submit a pokemon</span>
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected' && error !== null) {
    return (
      <div>
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (status === 'resolved' && pokemon !== null) {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
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
