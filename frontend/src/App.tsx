import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import TestPage from './pages/TestPage'
import { HomePage } from './pages/HomePage'
import { BrowserRouter, Router } from 'react-router-dom'
import AppRouter from './routes/AppRouter'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=' w-full h-full'>
      <BrowserRouter>
      <AppRouter/>
      </BrowserRouter>
    </div>
  )
}

export default App
