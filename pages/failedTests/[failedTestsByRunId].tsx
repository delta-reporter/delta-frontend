import React from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { Test, SuiteAndTest } from "../index"
import {
  BasePage,
  TestsList,
  SuitesAndTestsList,
} from "../../components/templates"
import {
  Grid,
  Paper,
  Container,
  Typography,
  Link,
  Breadcrumbs,
  List,
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
}))

type Props = {
  test_history: SuiteAndTest[]
}

function Tests(props: Props) {
  const classes = useStyles(props)

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
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Failed tests for
                    <Link underline="always">
                      {" "}
                      {props.test_history[0].test_type}
                    </Link>{" "}
                    run
                  </Typography>
                  <Link
                    underline="always"
                    className={classes.padding}
                    href={`/tests/${props.test_history[0].test_run_id}`}
                  >
                    Show All Tests
                  </Link>
                  {props.test_history.map(testRun => (
                    <div key={testRun.test_run_id}>
                      {testRun.test_suites.map(suite => (
                        <List
                          key={suite.test_suite_history_id}
                          className={classes.root}
                          dense
                        >
                          <TestsList>{suite.tests}</TestsList>
                        </List>
                      ))}
                    </div>
                  ))}
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
