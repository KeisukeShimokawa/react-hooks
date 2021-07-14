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
 * クラスコンポーネントのために引数の Props の型を指定する
 *
 * エラー時に表示したいコンポーネントを受け取る
 */
type ErrorBoundaryProps = {
  FallbackComponent: React.FC<{error: Error}>
}

/**
 * クラスコンポーネントのために状態変数 State の型を指定する
 *
 * 子コンポーネントから throw される例外を管理する
 */
type ErrorBoundaryState = {
  error: null | Error
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {error: null}

  /**
   * この関数は、エラーがスローされた後に、フォールバック用の
   * UIをレンダリングするためのライフサイクルメソッドである。
   *
   * 子コンポーネントからスローされたエラーを、パラメータとして
   * 受け取り、状態を更新するための値を返す
   */
  static getDerivedStateFromError(error: Error) {
    return {error}
  }

  render() {
    console.log('ErrorBoudary', this.state.error)

    const {error} = this.state
    if (error != null) {
      return <this.props.FallbackComponent error={error} />
    }

    /**
     * render 関数に以下だけを指定すると、エラーを送出する子コンポーネント
     * をそのまま返してしまうことになり、再度 ErrorBoundary が呼ばれてしまう
     */
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
      /**
       * ここではエラーの場合は JSX を直接指定するのではなく、
       * Error Boundary に到着するように、エラーを送出するようにする
       */
      throw state.error
    case 'resolved':
      return <PokemonDataView pokemon={state.pokemon} />
    default:
      throw new Error('This should be impossible')
  }
}

/**
 * もともと switch 文で分岐させていた JSX をエラー表示専用の
 * コンポーネントとして配置する。
 *
 * これで他の箇所でも使いまわすことが可能となる。
 */
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
          エラーを送出する子コンポーネントをラッピングするように指定する

          あまりにも上位にすると、それ以下のコンポーネントを全て書き換えてしまうため注意
        */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export {App}
