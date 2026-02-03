import { useState } from 'react'
import './App.css'

function App() {
  const [health, setHealth] = useState<any>(null)

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setHealth(data)
    } catch (err) {
      console.error(err)
      setHealth({ error: 'Failed to fetch' })
    }
  }

  return (
    <>
      <div className="card">
        <button onClick={checkHealth}>
          Check Health
        </button>
      </div>

      <div>
        {health ? (<pre>{JSON.stringify(health, null, 2)}</pre>) : (<p>No health data yet</p>)}
      </div>
    </>
  )
}

export default App

