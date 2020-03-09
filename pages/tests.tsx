import {
  Paper,
  Link,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  // ListItemText,
  Divider,
  Drawer,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { BasePage, SpacingPaper } from "../components/templates"
import { Test, TestSuite } from "."
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  counter: {
    margin: 10,
  },
  title: {
    fontSize: "2em",
  },
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
  seeMore: {
    marginTop: theme.spacing(3),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  list: {
    width: 700,
    padding: theme.spacing(2),
  },
}))

type Props = {
  test_suites: TestSuite[]
  tests: Test[]
}

function Tests(props: Props) {
  const classes = useStyles(props)
  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleChange = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false)
  }

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
      <SpacingPaper>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Test suites for{" "}
          <Link underline="always" href="/testruns">
            Testrun X
          </Link>{" "}
          test run
        </Typography>{" "}
        {/* Expandable Suites list */}
        {props.test_suites.map(suite => (
          <ExpansionPanel
            expanded={expanded === suite.name}
            onChange={handleChange(suite.name)}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
            >
              <Typography className={classes.heading}>{suite.name}</Typography>

              <Typography className={classes.secondaryHeading}>
                {suite.test_suite_status}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {/* Expanded tests list for each suite */}
              <List>
                {props.tests.map(test => (
                  <div>
                    <ListItem
                      className={classes.root}
                      button
                      onClick={toggleDrawer("right", true)}
                    >
                      {test.name}
                    </ListItem>
                    <Divider />

                    <Drawer
                      anchor="right"
                      open={state.right}
                      onClose={toggleDrawer("right", false)}
                    >
                      {sideList("right", test)}
                    </Drawer>
                  </div>
                ))}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </SpacingPaper>
    </BasePage>
  )
}

/**
 * Server side rendering
 */
Tests.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx

  // Suites
  const suitesReq = await fetch(
    "http://delta_core_service:5000/get_test_suites",
    {
      method: "GET",
    }
  )
  const suites = await suitesReq.json()

  // Tests
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
    test_suites: suites,
  }
}
export default Tests
