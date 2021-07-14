// Real World Review: Tic Tac Toe
// http://localhost:3000/isolated/exercise/04.tsx

import * as React from 'react'
import {
  calculateStatus,
  calculateNextValue,
  calculateWinner,
} from '../tic-tac-toe-utils'
import type {Squares} from '../tic-tac-toe-utils'

function Board() {
  /**
   * Lazy Initialization を行う
   * そのまま指定すると、再レンダリングのたびに初期化されてしまうため
   */
  const [squares, setSquares] = React.useState<Squares>(() => {
    let localStorageValue
    try {
      localStorageValue = JSON.parse(
        window.localStorage.getItem('squares') ?? 'null',
      )
    } catch (error: unknown) {
      // try something
    }

    if (localStorageValue) {
      return localStorageValue
    } else {
      return Array(9).fill(null)
    }
  })

  React.useEffect(() => {
    window.localStorage.setItem('squares', JSON.stringify(squares))
  }, [squares])

  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(index: number) {
    // 🐨 first, if there's already winner or there's already a value at the
    // given square index (like someone clicked a square that's already been
    // clicked), then return early so we don't make any state changes
    if (winner || squares[index]) {
      return
    }

    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    //
    // 🐨 call setSquares, accept the "previousSquares", and do this:
    //   🐨 make a copy of the squares array
    //   💰 `[...previousSquares]` will do it!
    //
    //   🐨 set the value of the square that was selected
    //   💰 `squaresCopy[index] = nextValue`
    //
    //   🐨 return your copy of the squares
    setSquares(previousSquares => {
      const squaresCopy = [...previousSquares]
      squaresCopy[index] = nextValue
      return squaresCopy
    })
  }

  function restart() {
    // 🐨 reset the squares
    // 💰 `Array(9).fill(null)` will do it!
    setSquares(Array(9).fill(null))
  }

  function renderSquare(i: number) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function App() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

export {App}

/*
eslint
  @typescript-eslint/no-unused-vars: "off",
*/
