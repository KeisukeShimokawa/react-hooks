// Synchronizing Side-Effects
// http://localhost:3000/isolated/exercise/02.tsx

import * as React from 'react'

type UseLocalStorageOptions<TState = unknown> = {
  serialize?: (data: TState) => string
  deserialize?: (str: string) => TState
}

function useLocalStorageState<TState>(
  key: string,
  defaultValue: TState | (() => TState),
  {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  }: UseLocalStorageOptions<TState> = {},
) {
  const [state, setState] = React.useState(() => {
    const valueInLocalStorage = window.localStorage.getItem(key)
    if (valueInLocalStorage) {
      // 以前にLocalStorageに値が設定されていることを考慮
      // その場合は値を削除する
      try {
        return deserialize(valueInLocalStorage)
      } catch (error) {
        window.localStorage.removeItem(key)
      }
    }

    // もしも初期値に計算量の重い関数からの返り値を指定する場合
    // useLocalStorageState(expensiveFunc()) とすると、
    // 再レンダリングのたびに計算する必要がある
    // そこでuseStateを最初に呼びだした段階で計算しておけばいい
    return defaultValue instanceof Function ? defaultValue() : defaultValue
  })

  // key が変更された場合はまずは以前の参照を取得する
  // これは最初の段階で実行される関数である
  const prevKeyRef = React.useRef(key)

  /**
   * 以下のように何らかの処理でkey名のみ変更する場合を想定している
   * 
   * const [key, setKey] = React.useState('name')
  const [name, setName] = useLocalStorageState(key, initialName)

  function handleClick() {
    if (key === 'name') {
      setKey('firstName')
    } else if (key === 'firstName') {
      setKey('Name')
    } else {
      setKey('name')
    }
  }
   */
  React.useEffect(() => {
    // 下記で key はすでに新しい値が入っている
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, serialize(state))
  }, [key, serialize, state])

  return [state, setState] as const
}

function UsernameForm({
  initialUsername = '',
  onSubmitUsername,
}: {
  initialUsername?: string
  onSubmitUsername: (username: string) => void
}) {
  // localStorage APIを使ったキャッシュの保存をカスタムフック化
  const [username, setUsername] = useLocalStorageState(
    'username',
    initialUsername,
  )
  const [touched, setTouched] = React.useState(false)

  const usernameIsLowerCase = username === username.toLowerCase()
  const usernameIsLongEnough = username.length >= 3
  const usernameIsShortEnough = username.length <= 10
  const formIsValid =
    usernameIsShortEnough && usernameIsLongEnough && usernameIsLowerCase

  const displayErrorMessage = touched && !formIsValid

  let errorMessage = null
  if (!usernameIsLowerCase) {
    errorMessage = 'Username must be lower case'
  } else if (!usernameIsLongEnough) {
    errorMessage = 'Username must be at least 3 characters long'
  } else if (!usernameIsShortEnough) {
    errorMessage = 'Username must be no longer than 10 characters'
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched(true)
    if (!formIsValid) return

    onSubmitUsername(username)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.currentTarget.value)
  }

  function handleBlur() {
    setTouched(true)
  }

  return (
    <form name="usernameForm" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="usernameInput">Username:</label>
        <input
          id="usernameInput"
          type="text"
          value={username}
          onChange={handleChange}
          onBlur={handleBlur}
          pattern="[a-z]{3,10}"
          required
          aria-describedby={displayErrorMessage ? 'error-message' : undefined}
        />
      </div>
      {displayErrorMessage ? (
        <div role="alert" id="error-message">
          {errorMessage}
        </div>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  )
}

function App() {
  const onSubmitUsername = (username: string) =>
    alert(`You entered: ${username}`)
  return (
    <div style={{width: 400}}>
      <UsernameForm onSubmitUsername={onSubmitUsername} />
    </div>
  )
}

export {App}
