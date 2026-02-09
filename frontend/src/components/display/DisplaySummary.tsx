import { Alert, Card, CardContent, Stack, Typography } from "@mui/material"
import ResponseTreeView from "./ResponseTreeView"
import type { ScanResponse } from "./types"

export const DisplaySummary = ({ data }: { data: ScanResponse }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant='h4' gutterBottom>
                    Summary
                </Typography>

                <Stack sx={{ gap: 1 }}>
                    <Alert severity='error'>
                        Files with errors: {data.summary.files_with_errors}
                    </Alert>
                    <Alert severity='warning'>
                        Files with secrets: {data.summary.files_with_secrets}
                    </Alert>
                    <Alert severity='success'>
                        Total files scanned: {data.summary.total_files_scanned}
                    </Alert>
                </Stack>
            </CardContent>

            <Stack sx={{ width: '90%', mx: 'auto' }}>
                <ResponseTreeView data={data.findings}></ResponseTreeView>
            </Stack>
        </Card>
    )
}
