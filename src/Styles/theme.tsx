import { PaletteMode } from '@mui/material';
import { grey, blue } from '@mui/material/colors';

export const getDesignTokens = (mode: PaletteMode) => ({
    typography: {
        fontFamily: "'Lato', sans-serif",
        h1: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
        },
        h2: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
        },
        h3: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
        },
        h4: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
        },
        h5: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
        },
        h6: {
            fontFamily: "'Playfair Display', serif",
            fontWeight: 500,
        },
        button: {
            fontFamily: "'Lato', sans-serif",
            fontWeight: 700,
            textTransform: 'none' as const, // Standard for modern culinary sites
        }
    },
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Light mode
                primary: {
                    main: '#0D8016', // Deep Green Navbar
                    contrastText: '#ffffff', // Ensure white text on green navbar
                },
                secondary: {
                    main: '#d35400', // Pumpkin/Terracotta for accents
                    light: '#e67e22',
                    dark: '#a04000',
                    contrastText: '#ffffff',
                },
                divider: '#e0e0e0',
                background: {
                    default: '#f8f9fa', // Very light cool grey/white
                    paper: '#ffffff', // White cards
                },
                text: {
                    primary: '#2b2b2b', // Soft black/charcoal
                    secondary: '#595959', // Medium grey
                },
                // Custom accent for headings/highlights
                info: {
                    main: '#2c3e50', // Dark Blue-Grey
                }
            }
            : {
                // Dark mode
                primary: {
                    main: '#1a1a1a', // Keep Dark grey navbar for dark mode
                    contrastText: '#ffffff',
                },
                secondary: {
                    main: '#1565c0', // Darker Blue for dark mode accents
                    light: '#42a5f5',
                    dark: '#0d47a1',
                    contrastText: '#ffffff',
                },
                divider: '#333333',
                background: {
                    default: '#121212', // Deep black
                    paper: '#1e1e1e', // Dark surface
                },
                text: {
                    primary: '#f5f5f5',
                    secondary: '#a0a0a0',
                },
                 info: {
                    main: '#ecf0f1', // Light Grey/White
                }
            }),
    },
});