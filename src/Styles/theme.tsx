import { createTheme,type PaletteColorOptions, type PaletteColor } from "@mui/material";
/*
Notes:
*/
declare module '@mui/material/styles' {
    interface Palette {
        otherColor: PaletteColor;
    }
    interface PaletteOptions {
        otherColor?: PaletteColorOptions;
    }
}



export const theme = createTheme({
    palette: {
        primary: {
            main: "#1760a5",
            light: "skyblue"
        },
        secondary: {
            main: '#15c630'
        },
        otherColor: {
            main: '#999'
        }
    }
})