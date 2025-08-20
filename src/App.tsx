import { appRouter } from './app.router'
import './App.css'

import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <div className="app">
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
