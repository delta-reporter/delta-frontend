import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  CssBaseline,
  AppBar,
  Typography,
  Link,
  Toolbar,
} from "@material-ui/core"
import { PageHeader } from "."


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  title: {
    flexGrow: 1,
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
}))

type Props = {
  children: React.ReactNode
  className?: string
}

export const BasePage = function(props: Props) {
  const { children, className } = props
  const classes = useStyles(props)

  return (
    <div className={`${classes.root} ${className}`}>
      <CssBaseline />
      <AppBar position="absolute">
        {/* top navigation bar with Delta name */}
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ fontWeight: 400, margin: "5px" }}
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
        <PageHeader />
        <section className={classes.pageDescription}>{children}</section>
      </main>
    </div>
  )
}
