import React, { useState } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { SuiteAndTest } from "../index"
import {
  BasePage,
  showStatusIcon,
  TestExpanded,
} from "../../components/templates"
import {
  Grid,
  Paper,
  Container,
  Typography,
  Link,
  Breadcrumbs,
  List,
  Button,
  ListItem,
} from "@material-ui/core"

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
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  padding: {
    paddingBottom: theme.spacing(1),
    paddingLeft: "80%",
  },
  nameOfTestOrSuite: {
    paddingLeft: theme.spacing(4),
    fontSize: "0.875rem",
    textAlign: "left",
    fontFamily: "Roboto",
    fontWeight: 400,
  },
}))

type Props = {
  test_history: SuiteAndTest[]
}

function Tests(props: Props) {
  const classes = useStyles(props)

  const [testInfoSection, setTestInfoSection] = useState(["No test selected"])

  function changeRightSide(value) {
    setTestInfoSection(value)
  }

  return (
    <BasePage className={classes.root}>
      <title>Δ | Failed Tests</title>
      {props.test_history[0] ? ( // checking if props exist (if there are tests for this run)
        <div>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href={`/`}>
              Projects
            </Link>
            <Link
              color="inherit"
              href={`/launches/${props.test_history[0].project_id}`}
            >
              Launches
            </Link>
            <Link
              color="inherit"
              href={`/tests/${props.test_history[0].test_run_id}`}
            >
              All Tests
            </Link>
            <Typography color="textPrimary">Failed Tests</Typography>
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
                    Failed tests for{" "}
                    <Link
                      style={{ color: "#605959" }}
                      underline="none"
                      color="secondary"
                    >
                      {" "}
                      {props.test_history[0].test_type}
                    </Link>{" "}
                    run
                  </Typography>
                  <Button
                    variant="text"
                    className={classes.padding}
                    href={`/tests/${props.test_history[0].test_run_id}`}
                  >
                    Show All Tests
                  </Button>
                  <div>
                    <div
                      style={{
                        float: "left",
                        width: "50%",
                        overflow: "hidden",
                        height: "max-content",
                        paddingRight: "20px",
                      }}
                    >
                      {props.test_history.map(testRun => (
                        <div key={testRun.test_run_id}>
                          {testRun.test_suites.map(suite => (
                            <List
                              key={suite.test_suite_history_id}
                              className={classes.root}
                              dense
                            >
                              {suite.tests.map(test => (
                                <ListItem
                                  button
                                  key={test.test_history_id}
                                  className={classes.root}
                                  onClick={() => changeRightSide(test)}
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
        <h1>No failed tests for this run, relax! :) </h1>
      )}
    </BasePage>
  )
}

// It runs  on the server-side, making a request before page is loaded.
// The data required to render the page is available at build time ahead of a user’s request
// https://nextjs.org/docs/api-reference/data-fetching/getInitialProps

Tests.getInitialProps = async (context): Promise<Props> => {
  const { failedTestsByRunId } = context.query

  // Suites and tests (inside suites)
  const testsByTestRunIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/tests_history/test_status/1/test_run/${failedTestsByRunId}`,
    {
      method: "GET",
    }
  )
  const failedTests = await testsByTestRunIdReq.json()

  return {
    test_history: failedTests,
  }
}

export default Tests
