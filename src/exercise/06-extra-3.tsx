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

/**
 * 状態に応じて異なる属性を有するオブジェクトを型と指定する
 * こちらはより柔軟である
 */
type PokemonInfoState =
  | {status: 'idle'}
  | {status: 'pending'}
  | {status: 'rejected'; error: Error}
  | {status: 'resolved'; pokemon: PokemonData}

function PokemonInfo({pokemonName}: {pokemonName: string}) {
  const [state, setState] = React.useState<PokemonInfoState>({
    status: 'idle',
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    /**
     * JSX で表示する内容の分岐は専用の status に関する変数に依存させる
     */
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemon => {
        setState({
          status: 'resolved',
          pokemon,
        })
      },
      error => {
        setState({
          status: 'rejected',
          error,
        })
      },
    )
  }, [pokemonName])

  /**
   * 以下の分岐では、型ガードも含めて null を除外するように指定する必要あり
   *
   * また状態オブジェクトを使用しているため、付随情報を取得できる点も便利である
   */
  switch (state.status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      return (
        <div>
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
        </div>
      )
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    default:
      throw new Error('This should be impossible')
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
