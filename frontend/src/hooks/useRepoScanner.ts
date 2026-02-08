import { useState } from "react"
import type { ScanResponse } from "../types"

export const useRepoScanner = () => {
    const [data, setData] = useState<ScanResponse | null>(null)
    const [responseError, setResponseError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const scan = async (repoUrl: string, token?: string) => {
        setIsLoading(true)
        setData(null)
        setResponseError(null)

        try {
            const response = await fetch('/api/scan-repo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    repo_url: repoUrl,
                    token: token ?? ''
                }),
            })


            if (!response.ok) {
                console.log(response)
                throw new Error(`Server responded with ${response.status}`)
            }

            const responseData: ScanResponse = await response.json()
            setData(responseData)
        } catch (error: unknown) {
            if (error instanceof Error) {
                setResponseError(error.message)
            } else {
                setResponseError("An unexpected error occured")
            }
        } finally {
            setIsLoading(false);
        }
    }

    return {
        data,
        responseError,
        isLoading,
        scan
    }
}
