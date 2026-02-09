import { Card, CardContent, Stack, Typography } from "@mui/material"
import ResponseTreeView from "./ResponseTreeView"
import type { ScanResponse } from "./types"

export const DisplayAllData = ({ data }: { data: ScanResponse }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant='h4' gutterBottom>
                    All results
                </Typography>

            </CardContent>

            <Stack sx={{ width: '90%', mx: 'auto' }}>
                <ResponseTreeView data={data.all_results}></ResponseTreeView>
            </Stack>
        </Card>
    )
}
