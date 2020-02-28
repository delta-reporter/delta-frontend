import green from "@material-ui/core/colors/green"
import { createMuiTheme } from "@material-ui/core/styles"

/**
 * material-ui theme color pallete
 * @see https://material-ui.com/style/color/
 */
export const MuiTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#cfcfcf",
      main: "#707070",
      dark: "#bdb9b7",
      contrastText: "#000000",
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
})
