import { useState } from 'react'
import './App.css'

function App() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [inputUrl, setInputUrl] = useState("")

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch('/api/scan-repo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    repo_url: inputUrl
                }),
            })

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`)
            }

            const responseData = await response.json()
            setData(responseData)
        } catch (error) {
            setData((error as Error).message);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input style={{width: '50vw'}} type="text" value={inputUrl} disabled={isLoading} onChange={(e) => setInputUrl(e.target.value)}/>

                <button type="submit" disabled={isLoading || !inputUrl}>
                    {isLoading ? <div className="spinner"></div> : 'Submit'}
                </button>
            </form>

            <div>
                {data ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : (<p>No data yet</p>)}
            </div>
<style>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

        </>
    )
}

export default App

