import React from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { Test } from "../index"
import { BasePage, TestsBlock } from "../../components/templates"
import {
  Grid,
  Paper,
  Container,
  Typography,
  Link,
  Breadcrumbs,
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
}))

type Props = {
  test_history: Test[]
  test_history_failed: Test[]
}

function Tests(props: Props) {
  const classes = useStyles(props)

  return (
    <BasePage className={classes.root}>
      <title>Δ | Tests</title>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Delta Reporter
        </Link>
        <Link color="inherit" href={`/`}>
          Projects
        </Link>
        <Link color="inherit" href={`/launches/1`}>
          Launches
        </Link>
        <Link color="inherit" href={`/testruns/1`}>
          Test Runs
        </Link>
        <Typography color="textPrimary">Tests</Typography>
      </Breadcrumbs>
      <Container maxWidth="lg" className={classes.container}>
        {props.test_history[0] ? ( // checking if props exist (if there are tests for this run)
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Test suites for {props.test_history[0].test_type} run{" "}
                  </Typography>

                  <TestsBlock>{props.test_history}</TestsBlock>
                </Paper>
              </Grid>
            </Grid>{" "}
          </div>
        ) : (
          <h1>No suites were found for this run! </h1>
        )}
      </Container>
    </BasePage>
  )
}

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

  const failedTestsOnlyByTestRunIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/tests_history/test_status/1/test_run/${testsByRunId}`,
    {
      method: "GET",
    }
  )
  const failedTestsOnly = await failedTestsOnlyByTestRunIdReq.json()

  return {
    test_history: tests,
    test_history_failed: failedTestsOnly,
  }
}

export default Tests
