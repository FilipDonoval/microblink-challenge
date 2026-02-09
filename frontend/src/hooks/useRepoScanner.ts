import { useState } from "react"
import type { ScanResponse } from "../components/display/types";

interface UserRepoScannerReturn {
    data: ScanResponse | null;
    responseError: { message: string; timestamp: number } | null,
    isLoading: boolean;
    scan: (repoUrl: string, token?: string) => Promise<void>;
}

export const useRepoScanner = (): UserRepoScannerReturn => {
    const [data, setData] = useState<ScanResponse | null>(null)
    const [responseError, setResponseError] = useState<{ message: string, timestamp: number } | null>(null)
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
                throw new Error(`Server responded with ${response.status}`)
            }

            const responseData: ScanResponse = await response.json()

            setData(responseData)
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred";
            setResponseError({ message, timestamp: Date.now() });
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
