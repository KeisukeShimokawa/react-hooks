// Lifting state
// http://localhost:3000/isolated/exercise/03.tsx

import * as React from 'react'

function Name({
  name,
  onNameChange,
}: {
  name: string
  onNameChange: (newName: string) => void
}) {
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input
        id="name"
        value={name}
        onChange={event => onNameChange(event.currentTarget.value)}
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

function Display({name, animal}: {name: string; animal: string}) {
  return <div>{`Hey ${name}, your favorite animal is: ${animal}!`}</div>
}

function App() {
  const [name, setName] = React.useState('')

  /**
   * favorite Animal コンポーネント内で状態を管理していた
   * 親のコンポーネントである App コンポーネントで管理し、
   * このコンポーネントは Props を受け取る方式に変更する
   */
  const [animal, setAnimal] = React.useState('')
  return (
    <form>
      <Name name={name} onNameChange={setName} />
      <FavoriteAnimal animal={animal} onAnimalChange={setAnimal} />
      <Display name={name} animal={animal} />
    </form>
  )
}

export {App}
