import {
  Container,
  Paper,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { BasePage } from "../components/templates"
import { Test } from "."

const useStyles = makeStyles(theme => ({
  root: {},
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  list: {
    width: 700,
    padding: theme.spacing(2),
  },
}))

type Props = {
  tests: Test[]
}

function Tests(props: Props) {
  const classes = useStyles(props)
  const [state, setState] = React.useState({
    right: false,
  })

  const toggleDrawer = (side, open) => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }

    setState({ ...state, [side]: open })
  }

  const sideList = (side, test) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      {" "}
      <Paper className={classes.paper}>
        <Typography component="h2">This is the test name:</Typography>
        {test.name}
      </Paper>
      <Paper className={classes.paper}>
        {" "}
        <Typography component="h2">This is the test result:</Typography>
      </Paper>
      {test.test_status}
    </div>
  )

  return (
    <BasePage className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        <Paper className={classes.paper}>
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Tests for{" "}
            <Link underline="always" href="/testsuites">
              {props.tests[0].test_suite}
            </Link>{" "}
            suite
          </Typography>
          {props.tests.map(test => (
            <div>
              <List>
                <ListItem button onClick={toggleDrawer("right", true)}>
                  <ListItemText primary={test.name} />
                </ListItem>
                <Divider />
              </List>
              <Drawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer("right", false)}
              >
                {sideList("right", test)}
              </Drawer>
            </div>
          ))}
        </Paper>
      </Container>
    </BasePage>
  )
}

/**
 * Server side rendering
 */
Tests.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx

  const testsReq = await fetch("http://delta_core_service:5000/get_tests", {
    method: "GET",
  })
  const tests = await testsReq.json()

  const pagePayload: IPagePayload = {
    selectedPage: Page.TESTS,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    tests: tests,
  }
}
export default Tests
