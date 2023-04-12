import { createTheme, PaletteMode } from "@mui/material"
import { palette } from "./colors";

const mode: PaletteMode = "light";

const themeSettings = () => {
  return {
    palette: {
      mode: mode,
      primary: {
        main: palette.primary[500],
        accent: palette.primary[700]
      },
      secondary: {
        main: palette.secondary[500],
        accent: palette.secondary[700]
      },
      background: {
        default: "#ffffff"
      },
      text: {
        primary: palette.black[900],
        secondary: palette.gray[600]
      }
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '12px 16px'
          },
          contained: {
            boxShadow: 'none !important'
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: '8px !important'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none'
          }
        }
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(even)': {
              background: palette.black[100]
            }
          }
        }
      }
    }
  }
}


export const theme = createTheme(themeSettings());
