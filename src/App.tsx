import { useState, ReactElement } from 'react'

function App(): ReactElement {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>My first FileTree Explorer app</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}

export default App