import { Box, Stack } from "@mui/material"
import { DisplayLLMResponse } from "./DisplayLlmResponse"
import { DisplaySummary } from "./DisplaySummary"
import { DisplayAllData } from "./DisplayAllData"
import type { ScanResponse } from "./types"

export const DisplayResponse = ({ data }: { data: ScanResponse }) => {

    return (
        <Stack sx={{ width: '80%', gap: 2 }}>
            <DisplayLLMResponse data={data}></DisplayLLMResponse>

            <DisplaySummary data={data}></DisplaySummary>

            <DisplayAllData data={data}></DisplayAllData>

            <Box sx={{ height: '20vh' }}></Box>
        </Stack>
    )
}
