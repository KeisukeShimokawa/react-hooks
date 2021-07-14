// Lifting state
// http://localhost:3000/isolated/exercise/03.tsx

import * as React from 'react'

function Name() {
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" />
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
   * 入力を管理する必要がない場合は、useStateで管理する必要すらなくなってくる
   */
  return (
    <form>
      <Name />
      <FavoriteAnimal animal={animal} onAnimalChange={setAnimal} />
      <Display animal={animal} />
    </form>
  )
}

export {App}
