import { ToggleButton, ToggleButtonGroup } from "@mui/material"

export const RepoTypeSelector = ({ privateRepo, onChange }: { privateRepo: boolean, onChange: (value: boolean) => void }) => {
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
