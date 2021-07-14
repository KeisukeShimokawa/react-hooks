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

type ErrorBoundaryProps = {
  FallbackComponent: React.FC<{error: Error}>
}

type ErrorBoundaryState = {
  error: null | Error
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {error: null}

  static getDerivedStateFromError(error: Error) {
    return {error}
  }

  render() {
    console.log('ErrorBoudary', this.state.error)

    const {error} = this.state
    if (error != null) {
      return <this.props.FallbackComponent error={error} />
    }

    return this.props.children
  }
}

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

  switch (state.status) {
    case 'idle':
      return <span>Submit a pokemon</span>
    case 'pending':
      return <PokemonInfoFallback name={pokemonName} />
    case 'rejected':
      throw state.error
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert">
      There was an error: {''}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
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
        {/* 
          key 引数を指定することで、指定したポケモン名が異なる場合には、
          異なる状態でレンダリングするようにして、Error Boundaryに含まれている
          error 状態変数を初期化するようにしている
        */}
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export {App}
