import { useState } from 'react'
import { Box, Button, Container, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import './App.css'

function App() {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [inputUrl, setInputUrl] = useState("")
    const [token, setToken] = useState("")
    const [privateRepo, setPrivateRepo] = useState(false)

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
                    repo_url: inputUrl,
                    token: privateRepo ? token : ''
                }),
            })

            /*
            const response = await fetch('/api/scan-local', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: '/repos/repo1'
                }),
            })
            */

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

    function handleRepoChange(value: boolean) {
        setPrivateRepo(value)
    }

    return (
        <Container sx={{ height: '100vh', pt: 10 }}>
            <Stack spacing={4} alignItems='center' justifyContent='center'>
                <Typography variant='h2' sx={{ textAlign: 'center' }}>Secrets Scanner</Typography>
                <Typography variant='h5'>Enter the url of github repo you want to scan</Typography>

                <RepoButton privateRepo={privateRepo} onChange={handleRepoChange}></RepoButton>

                <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <TextField sx={{ width: { xs: '90%', sm: '60%', md: '40%' } }} label='URL' variant='outlined' value={inputUrl} disabled={isLoading} onChange={(e) => setInputUrl(e.target.value)}></TextField>
                    {
                        privateRepo && <TextField sx={{ width: { xs: '90%', sm: '60%', md: '40%' } }} label='TOKEN' variant='outlined' value={token} disabled={isLoading} onChange={(e) => setToken(e.target.value)}></TextField>
                    }
                    <Button variant='contained' type="submit" loading={isLoading} disabled={!inputUrl}>
                        Submit
                    </Button>
                </Box>


                <div>
                    {data ? <ParsedData data={data}></ParsedData> : (<div>No data yet</div>)}
                </div>
            </Stack>
        </Container>
    )
}

function RepoButton({ privateRepo, onChange }: { privateRepo: boolean, onChange: Function }) {

    const handleState = (_: React.MouseEvent<HTMLElement>, newState: boolean | null) => {
        if (newState !== null) {
            onChange(newState)
        }
    }

    return (
        <ToggleButtonGroup
            value={privateRepo}
            exclusive
            onChange={handleState}
        >
            <ToggleButton value={false} disableRipple>Public</ToggleButton>
            <ToggleButton value={true} disableRipple>Private</ToggleButton>
        </ToggleButtonGroup>
    )
}

function ParsedData({ data }: { data: any }) {

    if (!data.all_results) {
        return <div>{data}</div>
    }


    const secretResoults = data.all_results.filter((fileResoult: any) => fileResoult.has_secrets)

    return (
        <div>
            {
                secretResoults.length === 0 ? <div>No secrets found</div> :
                    secretResoults.map((fileResult: any) => (
                        <div key={fileResult.filename}>
                            <p>{fileResult.has_secrets ? 'FOUND SECRETS' : 'No secrets found'}</p>
                            <p>in file: {fileResult.filename}</p>
                            {
                                Object.entries(fileResult.detectors)
                                    .filter(([_, details]: [string, any]) => !details.passed)
                                    .map(([detectorName, details]: [string, any]) => (
                                        <div key={fileResult.filename + detectorName} style={{ color: details.passed ? undefined : 'red' }}>


                                            <div>Detector: {detectorName}</div>
                                            <div><pre>Matches: {JSON.stringify(details.matches, null, 2)}</pre></div>
                                            <div>Matches_count: {details.matches_count}</div>
                                            <div>passed: {details.passed ? 1 : 0}</div>

                                            <br></br>

                                        </div>
                                    ))
                            }
                        </div>
                    ))
            }
        </div>
    )
}

export default App

