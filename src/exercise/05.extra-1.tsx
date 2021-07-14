// DOM Side-Effects
// 💯 Side-effect cleanup
// http://localhost:3000/isolated/exercise/05.tsx

import * as React from 'react'
import VanillaTilt from 'vanilla-tilt'

/**
 * 既存の型に対して、追加のプロパティを設定したい場合には、
 * インターフェースを継承すれば問題なし
 */
interface HTMLVAnillaTiltElement extends HTMLDivElement {
  vanillaTilt: VanillaTilt
}

function Tilt({children}: {children: React.ReactNode}) {
  /**
   * 用途に合わせて、React.useRef で取得した参照に対して、
   * current で取得できる値の型を指定する必要あり
   *
   * 初期値に null を指定することで、後の処理で undefined になって
   * しまうことを防ぐようにしている
   */
  const tiltRef = React.useRef<HTMLVAnillaTiltElement>(null)

  /**
   * このタイミングでは、tiltRef は undefined になってしまう
   * Reactでは実際にDOMが構築されるのは render 関数が実行される
   * タイミングであるため、関数の実行時にはDOMは構築されていないためである
   */
  console.log(tiltRef.current)

  /**
   * DOMに対してアクセスしたい場合には、DOMの構築が終了した後で実行される
   * ライブイベント内で処理を実行する必要がある
   */
  React.useEffect(() => {
    /**
     * tiltRef.current のようなアクセス方法は、以下のようにそれぞれの
     * キー名と値で取得することができる
     */
    const {current: tiltNode} = tiltRef
    /**
     * tiltNode は null の可能性もあるため、型ガードをしておく必要あり
     */
    if (tiltNode === null) return
    const vanillaTiltOptions = {
      max: 25,
      speed: 400,
      glare: true,
      'max-glare': 0.5,
    }
    VanillaTilt.init(tiltNode, vanillaTiltOptions)

    /**
     * useEffect の引数で指定したコールバック関数の中で、
     * 返り値に指定した関数は、クリーンアップ処理時、つまり
     * DOMが削除される前に呼び出されるメソッドになる
     */
    return () => {
      tiltNode.vanillaTilt.destroy()
    }
    /**
     * tiltNode のライフサイクルの中で変更しないので、最初の1回のみ
     * 処理を実行するように設定している
     */
  }, [])

  return (
    <div ref={tiltRef} className="tilt-root">
      <div className="tilt-child">{children}</div>
    </div>
  )
}

function App() {
  return (
    <Tilt>
      <div className="totally-centered">vanilla-tilt.js</div>
    </Tilt>
  )
}

export {App}

/*
eslint
  @typescript-eslint/no-unused-vars: "off",
*/
