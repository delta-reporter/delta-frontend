import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  CssBaseline,
  AppBar,
  Typography,
  Link,
  Toolbar,
  IconButton,
  Menu,
  MenuItem} from "@material-ui/core"
import { useRouter } from "next/router"
import MenuIcon from '@material-ui/icons/Menu'

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
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  };

  const handleMenuClose = () => {
    setAnchorEl(null)
  };
  
  const router = useRouter()

  return (
    <div className={`${classes.root} ${className}`}>
        {/* top nav bar with Delta name */}
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar className={darkMode ? classes.toolbarDark : classes.toolbarLight}>
        <div  style={{ width: "100%"}}>
          <Typography
            variant="h5"
            style={{ fontWeight: 400, margin: "5px", fontSize: "25px", float: "left"}}
          >
            <Link
              underline="none"
              href="/"
              className={darkMode ? classes.deltaTitleDark : classes.deltaTitleLight}
            >
              Δ Delta Reporter
            </Link>
          </Typography>
          <div style={{ float: "right", width: "5%"}}>
            {/* Menu dropdown */}
            <IconButton onClick={handleMenuClick} style={{marginTop:"7%"}}>
              <MenuIcon />
            </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                style={{marginTop:"2%"}}
              >
                <MenuItem onClick={() => router.push(`/charts`)}>Test stats</MenuItem>
                <MenuItem onClick={() => router.push(`https://delta-reporter.github.io/delta-reporter/`)}>Delta Documentation</MenuItem>

              </Menu>
            </div>
            </div>
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
