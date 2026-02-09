import { Alert, Snackbar } from "@mui/material"
import { useEffect, useState } from "react"

interface ErrorState {
    message: string;
    timestamp: number;
}

export const DisplayError = ({ error }: { error: ErrorState | null }) => {

    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (error) {
            setOpen(true);
        }
    }, [error])

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        console.log(event)
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)

    }
    return (
        <Snackbar
            autoHideDuration={4000}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Alert elevation={6} severity='error' onClose={handleClose}>{error?.message}</Alert>
        </Snackbar>
    )
}
