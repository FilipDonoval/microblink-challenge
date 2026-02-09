import { Card, CardContent, Typography } from "@mui/material"
import type { ScanResponse } from "./types"

export const DisplayLLMResponse = ({ data }: { data: ScanResponse }) => {
    return (

        <Card>
            <CardContent>
                <Typography variant='h4' gutterBottom>
                    LLM analysis
                </Typography>

                <Typography variant='body2' color='text.secondary'>
                    {
                        data.llm_analysis.message ?
                            data.llm_analysis.message
                            : data.llm_analysis.error ?
                                `LLM has a problem: ${data.llm_analysis.error}`
                                : 'No analysis avaliable'
                    }
                </Typography>
            </CardContent>
        </Card>
    )
}
