import React from "react"
import fetch from "../../node_modules/isomorphic-unfetch"
import { makeStyles } from "../../node_modules/@material-ui/core/styles"
import { TestSuite, Test } from "../index"
import { BasePage } from "../../components/templates/BasePage"
import {
  Container,
  Grid,
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ExpansionPanelDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 3500,
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

  const handleExpandCollapseEvent = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false)
  }

  const [state, setState] = React.useState({
    right: false,
  })

  const expandSuite = open => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }
    setState({ ...state, ["right"]: open })
  }

  const testsTab = test => (
    <div
      className={classes.list}
      role="presentation"
      onClick={expandSuite(false)}
      onKeyDown={expandSuite(false)}
    >
      {" "}
      <Paper className={classes.paper}>
        <Typography component="h2">This is the test name:</Typography>
        {test.name}
      </Paper>
      <Paper className={classes.paper}>
        {" "}
        <Typography component="h2">This is the test result:</Typography>
        {test.test_status}
      </Paper>
    </div>
  )

  return (
    <BasePage className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Test suites for (TODO:) run
              </Typography>
              {props.test_suites[0] ? ( // checking if props exist
                <div>
                  {props.test_suites.map(suite => (
                    <ExpansionPanel
                      expanded={expanded === suite.name}
                      onChange={handleExpandCollapseEvent(suite.name)}
                    >
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                      >
                        <Typography className={classes.heading}>
                          {suite.name}
                        </Typography>

                        <Typography className={classes.secondaryHeading}>
                          {suite.test_suite_status}
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        {/* Expanded tests list for each suite */}
                        <List className={classes.root}>
                          {props.tests.map(test => (
                            <div>
                              <ListItem
                                className={classes.root}
                                button
                                onClick={expandSuite(true)}
                              >
                                {test.name}
                                <ListItemSecondaryAction>
                                  <Typography align="right">
                                    {test.test_status}
                                  </Typography>
                                </ListItemSecondaryAction>
                              </ListItem>
                              <Divider />
                              <Drawer
                                anchor="right"
                                open={state.right}
                                onClose={expandSuite(false)}
                              >
                                {testsTab(test)}
                              </Drawer>
                            </div>
                          ))}
                        </List>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  ))}
                </div>
              ) : (
                // if props don't exist
                <h1>No suites were found for this run! </h1>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BasePage>
  )
}

Tests.getInitialProps = async (context): Promise<Props> => {
  const { id } = context.query

  // Suites
  const suitesByTestRunIdReq = await fetch(
    `http://delta_core_service:5000/api/v1/tests_suite_history/test_run/${id}`,
    {
      method: "GET",
    }
  )
  const suites = await suitesByTestRunIdReq.json()

  // Tests
  const testsBySuiteIdReq = await fetch(
    `http://delta_core_service:5000/api/v1/tests_history/test_suite/1`,
    {
      method: "GET",
    }
  )
  const tests = await testsBySuiteIdReq.json()

  return {
    tests: tests,
    test_suites: suites,
  }
}

export default Tests
