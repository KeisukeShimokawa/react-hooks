// Lifting state
// http://localhost:3000/isolated/exercise/03.tsx

import * as React from 'react'

function Name() {
  const [name, setName] = React.useState('')

  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input
        id="name"
        value={name}
        onChange={event => setName(event.currentTarget.value)}
      />
    </div>
  )
}

function FavoriteAnimal({
  animal,
  onAnimalChange,
}: {
  animal: string
  onAnimalChange: (newAnimal: string) => void
}) {
  return (
    <div>
      <label htmlFor="animal">Favorite Animal: </label>
      <input
        id="animal"
        value={animal}
        onChange={event => onAnimalChange(event.currentTarget.value)}
      />
    </div>
  )
}

function Display({animal}: {animal: string}) {
  return <div>{`Your favorite animal is: ${animal}!`}</div>
}

function App() {
  const [animal, setAnimal] = React.useState('')

  /**
   * もしも このコンポーネントから受け取った変更を他のコンポーネントに反映させる必要がない場合
   *
   * 例えば以下ではもともとNameコンポーネントから変更された name 変数を、
   * Display コンポーネントに渡していたが、変更を加えて Display では使用しないようにした
   *
   * この場合 App コンポーネントで name 変数を管理すると、name 変数が変更されるたび、
   * App コンポーネント全体が再レンダリングされてしまい、コストが高くなってっしまう
   *
   * 自己完結するコンポーネントなら、状態は子コンポーネントに持たせてしまってもいい
   * 以下では Name コンポーネントに name 変数の状態を管理するように移譲している
   */
  return (
    <form>
      {/* <Name name={name} onNameChange={setName} /> */}
      <Name />
      <FavoriteAnimal animal={animal} onAnimalChange={setAnimal} />
      <Display animal={animal} />
    </form>
  )
}

export {App}
