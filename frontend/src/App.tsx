import { useState } from 'react'
import { Box, Button, Collapse, Container, List, ListItem, ListItemButton, ListItemText, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
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
                    <Button variant='contained' type="submit" loading={isLoading} disabled={!inputUrl || (privateRepo && !token)}>
                        Submit
                    </Button>
                </Box>


                {data ? <DisplayResponse data={data}></DisplayResponse> : (<Box>No data yet</Box>)}


            </Stack>
        </Container>
    )
}



function DisplayResponse({ data }: { data: any }) {
    if (!data.all_results) {
        return <div>{data}</div>
    }

    return (
        <Box sx={{ width: '80%' }}>
            <Box>
                <Typography variant='h4'>
                    LLM analysis
                </Typography>
                <Typography variant='h6'>
                    {JSON.stringify(data.llm_analysis.message)}
                </Typography>
                <Typography variant='h5'>
                    Summary
                </Typography>
                <Typography>
                    {
                        Object.entries(data.summary).map(([key, value]: [string, any]) => (
                            <Typography>{key}: {value}</Typography>

                        ))


                        //JSON.stringify(data.summary)

                    }
                </Typography>
            </Box>
            <List>
                {
                    data.findings.map((finding: any, index: any) => (
                        <ResultRow key={index} finding={finding}></ResultRow>
                    ))

                }
            </List>
        </Box>
    )
}


function ResultRow({ finding }: { finding: any }) {
    const [open, setOpen] = useState(false)

    const handleClick = () => (
        setOpen(!open)
    )

    const detectorEntries = Object.entries(finding.detectors)

    return (
        <>
            <ListItemButton onClick={handleClick} divider>
                <ListItemText primary={finding.filename.split('/').pop()} secondary={finding.filename}></ListItemText>
            </ListItemButton>
            <Collapse in={open} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ pl: 4 }}>
                    {
                        detectorEntries.map(([detectorName, details]: [string, any]) => (
                            <DetectorMatchesList key={detectorName} detectorName={detectorName} details={details}></DetectorMatchesList>
                        ))
                    }
                </List>
            </Collapse>
        </>
    )
}

function DetectorMatchesList({ detectorName, details }: { detectorName: string, details: any }) {
    const [open, setOpen] = useState(false)

    const handleClick = () => (
        setOpen(!open)
    )

    return (

        details.matches_count > 0 ?
            <>
                <ListItemButton onClick={handleClick} sx={{ color: 'error' }}>
                    <ListItemText
                        primary={`${detectorName}: ${details.passed ? 'Passed' : 'Failed'}`}
                        secondary={`Matches: ${details.matches_count}`}
                        sx={{ color: 'error.main' }} >
                    </ListItemText>
                </ListItemButton>
                <Collapse in={open} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding sx={{ pl: 4 }}>
                        {
                            details.matches.map((match: any) => (
                                <ListItemText key={match}
                                    primary={match.string}
                                    secondary={`Entropy: ${match.entropy}`}
                                    sx={{ color: 'error.main' }} >
                                </ListItemText>
                            ))
                        }
                    </List>
                </Collapse>
            </>
            :
            <ListItem>
                <ListItemText
                    primary={`${detectorName}: ${details.passed ? 'Passed' : 'Failed'}`}
                    secondary={details.matches_count > 0 ? `Matches found: ${details.matches_count}` : null}
                    sx={{ color: details.matches_count > 0 ? 'red' : undefined }}
                >
                </ListItemText>
            </ListItem>

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


export default App

