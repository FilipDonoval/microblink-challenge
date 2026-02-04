import { useState } from 'react'
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import './App.css'

function App() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [inputUrl, setInputUrl] = useState("")

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000));

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
        <Container sx={{ height: '100vh' }}>
            <Stack spacing={4} alignItems='center' justifyContent='center'>
                <Typography variant='h2' sx={{ textAlign: 'center' }}>Secrets Scanner</Typography>
                <Typography variant='h5'>Enter the url of github repo you want to scan</Typography>

                <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <TextField sx={{ width: { xs: '90%', sm: '60%', md: '40%' } }} label='URL' variant='outlined' value={inputUrl} disabled={isLoading} onChange={(e) => setInputUrl(e.target.value)}></TextField>
                    <Button variant='contained' type="submit" loading={isLoading} disabled={!inputUrl}>
                        Submit
                    </Button>
                </Box>

                <div>
                    {data ? (<pre>{JSON.stringify(data, null, 2)}</pre>) : (<p>No data yet</p>)}
                </div>
            </Stack>
        </Container>
    )
}

export default App

