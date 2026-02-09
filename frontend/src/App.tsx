import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { DisplayResponse } from './components/display/DisplayResponse'
import { DisplayError } from './components/DisplayError'
import { useRepoScanner } from './hooks/useRepoScanner'
import { RepoTypeSelector } from './components/selector/RepoTypeSelector'

function App() {
    const [inputUrl, setInputUrl] = useState("")
    const [token, setToken] = useState("")
    const [privateRepo, setPrivateRepo] = useState(false)

    const { data, responseError, isLoading, scan } = useRepoScanner();


    const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault()
        await scan(inputUrl, privateRepo ? token : '')
    }

    const handleRepoChange = (value: boolean) => {
        setPrivateRepo(value)
    }


    return (
        <Container sx={{ height: '100vh', pt: 10 }}>

            <Stack spacing={4} alignItems='center' justifyContent='center'>
                <Typography variant='h2' sx={{ textAlign: 'center' }}>Secrets Scanner</Typography>
                <Typography variant='h5' sx={{ textAlign: 'center' }}>Enter the url of github repo you want to scan</Typography>

                <RepoTypeSelector privateRepo={privateRepo} onChange={handleRepoChange}></RepoTypeSelector>

                <Box component='form' onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <TextField sx={{ width: { xs: '90%', sm: '60%', md: '45%' } }}
                        label='URL'
                        variant='outlined'
                        value={inputUrl}
                        disabled={isLoading}
                        onChange={(e) => setInputUrl(e.target.value)}
                    ></TextField>
                    {
                        privateRepo &&
                        <TextField
                            sx={{ width: { xs: '90%', sm: '60%', md: '45%' } }}
                            label='TOKEN'
                            variant='outlined'
                            value={token}
                            disabled={isLoading}
                            onChange={(e) => setToken(e.target.value)}
                        ></TextField>
                    }

                    <Button variant='contained' type="submit" loading={isLoading} disabled={!inputUrl || (privateRepo && !token)}>
                        Submit
                    </Button>
                </Box>

                {data &&
                    <DisplayResponse data={data}></DisplayResponse>
                }

                <DisplayError error={responseError}></DisplayError>


            </Stack>
        </Container>
    )
}



export default App

