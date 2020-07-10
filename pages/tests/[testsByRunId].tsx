import React, { useState } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { SuiteAndTest } from "../index"
import {
  BasePage,
  showStatusIcon,
  showTestStats,
  TestExpanded,
} from "../../components/templates"
import {
  Grid,
  Paper,
  Container,
  Typography,
  Link,
  Breadcrumbs,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  Button,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 3500,
  },
  title: {
    fontSize: "2em",
  },
  container: {
    paddingTop: theme.spacing(4),
    maxWidth: 3400,
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  padding: {
    marginBottom: "5px",
    marginLeft: "80%",
    color: "#353690",
  },
  nameOfTestOrSuite: {
    paddingLeft: theme.spacing(4),
    fontSize: "0.875rem",
    textAlign: "left",
    fontFamily: "Roboto",
    fontWeight: 400,
  },
  backgroundGrey: {
    backgroundColor: "#d6d6d6",
  },
  backgroundWhite: {
    backgroundColor: "white",
  },
}))

type Props = {
  test_history: SuiteAndTest[]
}

function Tests(props: Props) {
  const classes = useStyles(props)
  const [testInfoSection, setTestInfoSection] = useState(["No test selected"])
  const [highlightedTest, setHighlightedTest] = useState(0)

  function changeRightSide(value, testId) {
    setTestInfoSection(value)
    setHighlightedTest(testId)
  }

  const [expandedSuite, setExpandedSuite] = React.useState<string | false>(
    false
  )
  const expandCollapseSuite = (suitePanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedSuite(isExpanded ? suitePanel : false)
  }

  return (
    <BasePage className={classes.root}>
      <title>Δ | Tests</title>
      {props.test_history[0] ? ( // checking if props exist (if there are tests for this run)
        <div>
          <Breadcrumbs style={{ paddingLeft: "30px" }}>
            <Link color="inherit" href={`/`}>
              Projects
            </Link>
            <Link
              color="inherit"
              href={`/launches/${props.test_history[0].project_id}`}
            >
              Launches
            </Link>
            <Typography color="textPrimary">Tests</Typography>
          </Breadcrumbs>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography
                    variant="h6"
                    color="secondary"
                    style={{ fontWeight: 400, margin: "5px" }}
                  >
                    Test suites for{" "}
                    <Link
                      style={{ color: "#605959" }}
                      underline="none"
                      color="secondary"
                    >
                      {" "}
                      {props.test_history[0].test_type}
                    </Link>{" "}
                    run
                    <Button
                      variant="text"
                      className={classes.padding}
                      href={`/failedTests/${props.test_history[0].test_run_id}`}
                    >
                      Show only Failed Tests
                    </Button>
                  </Typography>

                  <div>
                    <div
                      style={{
                        float: "left",
                        width: "55%",
                        overflow: "hidden",
                        height: "max-content",
                        paddingRight: "20px",
                        marginTop: "30px",
                      }}
                    >
                      {props.test_history.map(testRun => (
                        <div key={testRun.test_run_id}>
                          {testRun.test_suites.map(suite => (
                            <ExpansionPanel
                              key={suite.test_suite_history_id}
                              expanded={expandedSuite === suite.name}
                              onChange={expandCollapseSuite(suite.name)}
                              TransitionProps={{ unmountOnExit: true }}
                            >
                              <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                              >
                                {showStatusIcon(suite.test_suite_status)}
                                <Typography
                                  className={classes.nameOfTestOrSuite}
                                >
                                  {suite.name}
                                </Typography>
                                {showTestStats(
                                  suite.tests_passed,
                                  suite.tests_failed,
                                  suite.tests_incomplete,
                                  suite.tests_skipped
                                )}
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                {/* Expanded tests list for each suite */}
                                <List key={suite.test_suite_history_id} dense>
                                  {suite.tests.map(test => (
                                    <ListItem
                                      button
                                      key={test.test_history_id}
                                      onClick={() =>
                                        changeRightSide(test, test.test_id)
                                      }
                                      className={
                                        test.test_id === highlightedTest
                                          ? classes.backgroundGrey
                                          : classes.backgroundWhite
                                      }
                                    >
                                      {showStatusIcon(test.status)}
                                      <Typography
                                        className={classes.nameOfTestOrSuite}
                                      >
                                        {test.name}
                                      </Typography>
                                    </ListItem>
                                  ))}
                                </List>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        float: "left",
                        width: "45%",
                        overflow: "hidden",
                      }}
                    >
                      <TestExpanded>{testInfoSection}</TestExpanded>
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </div>
      ) : (
        <h1>No suites were found for this run! </h1>
      )}
    </BasePage>
  )
}

// It runs  on the server-side, making a request before page is loaded.
// The data required to render the page is available at build time ahead of a user’s request
// https://nextjs.org/docs/api-reference/data-fetching/getInitialProps

Tests.getInitialProps = async (context): Promise<Props> => {
  const { testsByRunId } = context.query

  // Suites and tests (inside suites)
  const testsByTestRunIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/tests_history/test_run/${testsByRunId}`,
    {
      method: "GET",
    }
  )
  const tests = await testsByTestRunIdReq.json()

  return {
    test_history: tests,
  }
}

export default Tests
