import React, { useState } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { SuiteAndTest } from "../index"
import { BasePage, ListOfSuites } from "../../components/templates"
import {
  Grid,
  Paper,
  Container,
  Typography,
  Link,
  Breadcrumbs,
  Button,
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
  passedSelected: {
    backgroundColor: "#c6e1d4",
  },
  failedSelected: {
    backgroundColor: "#e1c6c6",
  },
  incompleteSelected: {
    backgroundColor: "#e1d4c6",
  },
  skippedSelected: {
    backgroundColor: "#e3e1e1",
  },
  passedNotSelected: {
    color: "#c6e1d4",
  },
  failedNotSelected: {
    color: "#e1c6c6",
  },
  incompleteNotSelected: {
    color: "#e1d4c6",
  },
  skippedNotSelected: {
    color: "#e3e1e1",
  },
}))

type Props = {
  test_history: SuiteAndTest[]
}

function Tests(props: Props) {
  const classes = useStyles(props)

  // We are using two things here. State and var, they will hold the same value but used for different purposes
  // the way states work, `selectedStatus` state doesn't update immediately and it will have a old value inside the function, and correct value outside the function
  // So we use `selectedStatus` state for refreshing the component, and `statusArrayForEndpoint` var for enpoint
  let statusArrayForEndpoint = "1+2+3+5"
  const [selectedStatus, setSelectedStatus] = useState(["1", "2", "3", "5"])

  const [data, setData] = useState(props.test_history)

  async function handleStatusFilter(status, testRunId) {
    let previousArray = selectedStatus
    if (selectedStatus.includes(status) && selectedStatus.length != 1) {
      // to remove the item, if it was selected already and user clicks again
      setSelectedStatus(selectedStatus.filter(item => item !== status))
      statusArrayForEndpoint = selectedStatus
        .filter(item => item !== status)
        .toString()
    } else if (!selectedStatus.includes(status)) {
      // to add status to array
      setSelectedStatus(selectedStatus.concat(status))
      statusArrayForEndpoint = selectedStatus.concat(status).toString()
    } else {
      // if user tries to deselect all filters - don't allow and show previous result
      statusArrayForEndpoint = previousArray.toString()
    }

    // GET request using fetch with async/await
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
    console.log(requestOptions)

    const response = await fetch(
      `${process.env.publicDeltaCore}/api/v1/tests_history/test_status/${statusArrayForEndpoint}/test_run/${testRunId}`,
      requestOptions
    )
    // we refresh the props here
    setData(await response.json())
  }

  return (
    <BasePage className={classes.root}>
      <title>Δ | Tests</title>
      {props.test_history[0] ? ( // checking if props exist (if there are tests for this run)
        //  id needed here for scrolling to the top when needed
        <div id="page-top">
          <Breadcrumbs style={{ paddingLeft: "30px" }}>
            <Link color="inherit" href={`/`}>
              Projects
            </Link>
            <Link color="inherit" href={`/launches/${props.test_history[0].project_id}`}>
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
                  <div
                    style={{
                      display: "flex",
                      marginTop: "20px",
                      marginLeft: "300px",
                    }}
                  >
                    <p
                      style={{
                        marginTop: "-0.5px",
                      }}
                    >
                      {" "}
                      Filter by Status:{" "}
                    </p>
                    <Button
                      onClick={() =>
                        handleStatusFilter("2", props.test_history[0].test_run_id)
                      }
                      className={
                        selectedStatus.includes("2")
                          ? classes.passedSelected
                          : classes.passedNotSelected
                      }
                      style={{
                        width: "90px",
                        height: "30px",
                        marginLeft: "10px",
                        border: "1px #a7bab1 solid",
                        fontSize: "12px",
                      }}
                    >
                      passed
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusFilter("1", props.test_history[0].test_run_id)
                      }
                      className={
                        selectedStatus.includes("1")
                          ? classes.failedSelected
                          : classes.failedNotSelected
                      }
                      style={{
                        width: "90px",
                        height: "30px",
                        marginLeft: "10px",
                        border: "1px #c3acac solid",
                        fontSize: "12px",
                      }}
                    >
                      failed
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusFilter("3", props.test_history[0].test_run_id)
                      }
                      className={
                        selectedStatus.includes("3")
                          ? classes.incompleteSelected
                          : classes.incompleteNotSelected
                      }
                      style={{
                        width: "90px",
                        height: "30px",
                        marginLeft: "10px",
                        border: "1px #c5baae solid",
                        fontSize: "12px",
                      }}
                    >
                      incomplete
                    </Button>
                    <Button
                      onClick={() =>
                        handleStatusFilter("5", props.test_history[0].test_run_id)
                      }
                      className={
                        selectedStatus.includes("5")
                          ? classes.skippedSelected
                          : classes.skippedNotSelected
                      }
                      style={{
                        width: "90px",
                        height: "30px",
                        marginLeft: "10px",
                        border: "1px #c7c5c5 solid",
                        fontSize: "12px",
                      }}
                    >
                      skipped
                    </Button>
                  </div>
                  {data[0] ? ( // if there is no data returned from filtering - use initial props
                    <ListOfSuites
                      children={data}
                      stats={selectedStatus}
                    ></ListOfSuites>
                  ) : (
                    <div>
                      <Typography style ={{fontStyle:'italic', margin:"10px", color: "red"}}>Sorry, there was no matching tests for this filter, showing full list of tests</Typography>
                    <ListOfSuites
                      children={props.test_history}
                      stats={["1", "2", "3", "5"]}
                    ></ListOfSuites>
                    </div>
                  )}
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
