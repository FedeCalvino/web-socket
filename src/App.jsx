import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Ordenes } from './Ordenes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Ordenes/>
    </>
  )
}

export default App
