import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  CssBaseline,
  AppBar,
  Typography,
  Link,
  Toolbar,
  Paper } from "@material-ui/core"

import { useSelector } from "react-redux"
import { selectedPageSelector } from "../../store/page"
import { Page } from "../../constants"

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, 
  },
  spaceAfterNavBar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",

  },
  pageDescription: {
    padding: theme.spacing(2),
  },
  headerContainer: {
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(5),
    textAlign: "center",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3em",
    padding: theme.spacing(1),
  },
}))

type Props = {
  children: React.ReactNode
  className?: string
}

export const BasePage = function(props: Props) {
  const { children, className } = props
  const classes = useStyles(props)
  const selectedPage = useSelector(selectedPageSelector)
  
  return (
    <div className={`${classes.root} ${className}`}>
      <CssBaseline />
      <AppBar position="absolute">
        {/* top nav bar with Delta name */}
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ fontWeight: 400, margin: "5px", fontSize: "25px" }}
            className={classes.title}
          >
            <Link
              underline="none"
              color="secondary"
              href="/"
              style={{ paddingLeft: "20px" }}
            >
              Δ Delta Reporter
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.spaceAfterNavBar} />
          {/* show blue wide header on projects page */}
          <div>
          {selectedPage === Page.TOP ? (
            <div className={classes.root}>
              <h1> </h1>{" "}
            </div>
          ) : (
            <Paper square={true} className={classes.headerContainer}>
              <Typography variant="h1" color="inherit" className={classes.title}>
                {selectedPage.pageTitle}
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
              >
                {selectedPage.pageDescription}
              </Typography>
            </Paper>
          )}
        </div>
        <section className={classes.pageDescription}>{children}</section>
      </main>
    </div>
  )
}
