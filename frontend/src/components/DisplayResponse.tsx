import { Box, Collapse, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material"
import { useState } from "react"
//import type { Match, DetectorDetails, Finding, Summary, ScanResponse } from "../types"
import type { DetectorDetails, Finding, Match, ScanResponse } from "../types"

export const DisplayFindings = ({ data }: { data: ScanResponse }) => {
    return (
        <Stack sx={{ width: '80%', pl: 2 }}>
            <Box>
                <Typography variant='h4'>
                    LLM analysis
                </Typography>
                <Typography variant='h6'>
                    {data.llm_analysis.message || data.llm_analysis.error}
                </Typography>
                <Typography variant='h4'>
                    Summary
                </Typography>
                <Box sx={{ pl: 4 }}>
                    <Typography>Files with errors: {data.summary.files_with_errors}</Typography>
                    <Typography>Files with secrets: {data.summary.files_with_secrets}</Typography>
                    <Typography>Total files scanned: {data.summary.total_files_scanned}</Typography>
                </Box>
            </Box>
            <List component='div' disablePadding sx={{ width: { xs: '100%', sm: '80%', md: '60%' } }}>
                {
                    data.findings.map((finding: Finding, index: number) => (
                        <ResultRow key={index} finding={finding}></ResultRow>
                    ))
                }
            </List>
        </Stack>
    )
}

export const DisplayAll = ({ data }: { data: ScanResponse }) => {
    const [open, setOpen] = useState(false)

    const handleClick = () => (
        setOpen(!open)
    )

    return (
        <Box sx={{ width: '80%' }}>
            <ListItemButton onClick={handleClick}>
                <Typography variant='h4' >All results</Typography>
            </ListItemButton>
            <Collapse in={open} timeout='auto' unmountOnExit>
                <List component='div' disablePadding sx={{ width: { xs: '100%', sm: '80%', md: '60%' } }}>
                    {
                        data.all_results.map((finding: Finding, index: number) => (
                            <ResultRow key={index} finding={finding}></ResultRow>
                        ))
                    }
                </List>
            </Collapse>
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
            <ListItemButton onClick={handleClick}>
                <ListItemText
                    primary={finding.filename.split('/').pop()}
                    secondary={finding.filename}
                    sx={{
                        '& .MuiListItemText-primary': { color: finding.has_secrets ? 'error.main' : 'success.main' }
                    }}
                >
                </ListItemText>
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

