import React from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { SuiteAndTest } from "../index"
import { BasePage, SuitesAndTestsList } from "../../components/templates"
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
      <title>Δ | Tests</title>
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
                  </Typography>
                  <Link
                    underline="always"
                    className={classes.padding}
                    variant="subtitle1"
                    href={`/failedTests/${props.test_history[0].test_run_id}`}
                    style={{ color: "#353690" }}
                  >
                    Show only Failed Tests
                  </Link>
                  <SuitesAndTestsList>{props.test_history}</SuitesAndTestsList>
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
