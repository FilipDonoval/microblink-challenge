import { colors, createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: colors.indigo[500],
        },
        secondary: {
            main: colors.cyan[500],
        },
        background: {
            default: colors.grey[50],
        }
    },
})
