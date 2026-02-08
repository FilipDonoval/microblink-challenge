import { Box, Collapse, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import { useState } from "react"
import type { Match, DetectorDetails, Finding, Summary, ScanResponse } from "../types"

export const DisplayResponse = ({ data }: { data: ScanResponse }) => {
    return (
        <Box sx={{ width: '80%' }}>
            <Box>
                <Typography variant='h4'>
                    LLM analysis
                </Typography>
                <Typography variant='h6'>
                    {data.llm_analysis.message || data.llm_analysis.error}
                </Typography>
                <Typography variant='h5'>
                    Summary
                </Typography>
                <Box>
                    {
                        (Object.entries(data.summary) as [keyof Summary, number][]).map(([key, value]) => (
                            <Typography>{key}: {value}</Typography>

                        ))
                    }
                </Box>
            </Box>
            <List>
                {
                    data.findings.map((finding: Finding, index: number) => (
                        <ResultRow key={index} finding={finding}></ResultRow>
                    ))

                }
            </List>
            <Box sx={{ height: '20vh' }}></Box>
        </Box>
    )
}


const ResultRow = ({ finding }: { finding: Finding }) => {
    const [open, setOpen] = useState(false)

    const handleClick = () => (
        setOpen(!open)
    )

    const detectorEntries = Object.entries(finding.detectors)

    return (
        <>
            <ListItemButton onClick={handleClick} divider>
                <ListItemText
                    primary={finding.filename.split('/').pop()}
                    secondary={finding.filename}></ListItemText
                >
            </ListItemButton>
            <Collapse in={open} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ pl: 4 }}>
                    {
                        detectorEntries.map(([detectorName, details]) => (
                            <DetectorMatchesList key={detectorName} detectorName={detectorName} details={details}></DetectorMatchesList>
                        ))
                    }
                </List>
            </Collapse>
        </>
    )
}

const DetectorMatchesList = ({ detectorName, details }: { detectorName: string, details: DetectorDetails }) => {
    const [open, setOpen] = useState(false)

    const handleClick = () => (
        setOpen(!open)
    )

    const isError = details.matches_count > 0
    const statusColor = isError ? 'error.main' : 'success.main'

    return (

        isError ?
            <>
                <ListItemButton onClick={handleClick} sx={{ color: 'error' }}>
                    <ListItemText
                        primary={`${detectorName}: ${details.passed ? 'Passed' : 'Failed'}`}
                        secondary={`Matches: ${details.matches_count}`}
                        sx={{ color: statusColor }} >
                    </ListItemText>
                </ListItemButton>
                <Collapse in={open} timeout='auto' unmountOnExit>
                    <List component='div' disablePadding sx={{ pl: 4 }}>
                        {
                            details.matches.map((match: Match, index: number) => (
                                <ListItemText key={`${match.string}-${index}`}
                                    primary={match.string}
                                    secondary={`Entropy: ${match.entropy}`}
                                    sx={{ color: statusColor }} >
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
                    sx={{ color: statusColor }}
                >
                </ListItemText>
            </ListItem>

    )
}

