import React from "react"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import {
  Drawer,
  CssBaseline,
  Badge,
  AppBar,
  List,
  Typography,
  Divider,
  IconButton,
  Link,
  Toolbar,
} from "@material-ui/core"
import { Search, Info, AccountBox } from "@material-ui/icons"
import { SideBarMainItems, SideBarSecondaryItems } from "./Sidebar"
import { PageHeader } from "./PageHeader"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import MenuIcon from "@material-ui/icons/Menu"

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  pageDescription: {
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
  const [open, setOpen] = React.useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={`${classes.root} ${className}`}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            className={classes.title}
          >
            <Link underline="none" color="secondary" href="/">
              Δ Delta Reporter
            </Link>
          </Typography>
          <IconButton color="inherit" disabled>
            <Badge color="secondary">
              <Search />
            </Badge>
          </IconButton>
          <IconButton color="inherit" disabled>
            <Badge color="secondary">
              <AccountBox />{" "}
            </Badge>
          </IconButton>
          <IconButton color="inherit" href="/about">
            <Badge color="secondary">
              <Info />{" "}
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{SideBarMainItems}</List>
        <Divider />
        <List>{SideBarSecondaryItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <PageHeader />
        <section className={classes.pageDescription}>{children}</section>
      </main>
    </div>
  )
}
