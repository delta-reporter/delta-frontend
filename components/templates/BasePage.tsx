import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  CssBaseline,
  AppBar,
  Typography,
  Link,
  Toolbar } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  toolbarDark: {
    paddingLeft: "40px",
    backgroundColor: theme.palette.secondary.dark,
  },
  toolbarLight: {
    paddingLeft: "40px",
  },
  spaceAfterNavBar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  deltaTitleDark: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1em",
    padding: theme.spacing(1),
    color: theme.palette.secondary.light,
  },
  deltaTitleLight: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1em",
    padding: theme.spacing(1),
    color: "black",
  },
}))

type Props = {
  children: React.ReactNode
  className?: string
  darkMode: boolean
}

export const BasePage = function(props: Props) {
  const { children, className, darkMode } = props
  const classes = useStyles(props)
  
  return (
    <div className={`${classes.root} ${className}`}>
        {/* top nav bar with Delta name */}
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar className={darkMode ? classes.toolbarDark : classes.toolbarLight}>
          <Typography
            variant="h5"
            style={{ fontWeight: 400, margin: "5px", fontSize: "25px"}}
          >
            <Link
              underline="none"
              href="/"
              className={darkMode ? classes.deltaTitleDark : classes.deltaTitleLight}
            >
              Δ Delta Reporter
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.spaceAfterNavBar} />
          {/* all the main body */}
        <section>{children}</section>
      </main>
    </div>
  )
}
