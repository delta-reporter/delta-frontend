import React, { useState, useEffect } from "react"
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
   marginLeft:"10px",
  },
  failedSelected: {
    backgroundColor: "#e1c6c6",  
    marginLeft:"10px",
  },
  incompleteSelected: {
    backgroundColor: "#e1d4c6",  
    marginLeft:"10px",
  },
  skippedSelected: {
    backgroundColor: "#e3e1e1",  
    marginLeft:"10px",
  },
  passedNotSelected: {
    color: "#c6e1d4",
    border: "1px #c6e1d4 solid",  
    marginLeft:"10px",
   },
   failedNotSelected: {
     color: "#e1c6c6",  
     border: "1px #e1c6c6 solid",  
     marginLeft:"10px",
   },
   incompleteNotSelected: {
     color: "#e1d4c6",  
     border: "1px #e1d4c6 solid",  
     marginLeft:"10px",
   },
   skippedNotSelected: {
     color: "#e3e1e1",  
     border: "1px #e3e1e1 solid",  
     marginLeft:"10px",
   },
}))

type Props = {
  test_history: SuiteAndTest[]
}

function Tests(props: Props) {
  const classes = useStyles(props)

  let statusArrayForEndpoint
  const [selectedStatus, setSelectedStatus] = useState(["1", "2", "3", "5"])

  async function handleStatusFilter(status, testRunId) {
    let previousArray = selectedStatus
    if(selectedStatus.includes(status) && selectedStatus.length!=1) { // to remove the item, if it was selected already and user clicks again
      setSelectedStatus(selectedStatus.filter(item => item !== status))
      // we need to set the value for endpoint separately, 
      // cause selectedStatus state doesn't update immediately and it will have a wrong value at this stage
      statusArrayForEndpoint = (selectedStatus.filter(item => item !== status)).toString() 
    }
    else if (!selectedStatus.includes(status)) { // to add status to array
      setSelectedStatus(selectedStatus.concat(status)) 
      statusArrayForEndpoint = (selectedStatus.concat(status)).toString() 
    }
    else { // if user tries to deselect all filters - don't allow and show previous result
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
    const data = await response.json()

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
        <div style={{display:"flex", marginTop: "20px", marginLeft: "300px" }}>
          <p> Filter by Status:  </p> 
              <Button onClick={() => handleStatusFilter("1", props.test_history[0].test_run_id)} className={
                            selectedStatus.includes("1")
                              ? classes.passedSelected
                              : classes.passedNotSelected
                          }>passed
                </Button> 
                <Button onClick={() => handleStatusFilter("2", props.test_history[0].test_run_id)} className={
                            selectedStatus.includes("2")
                            ? classes.failedSelected
                              : classes.failedNotSelected
                          }>failed
              </Button> 
              <Button onClick={() => handleStatusFilter("3", props.test_history[0].test_run_id)} 
              className={
                selectedStatus.includes("3")
                ? classes.incompleteSelected
                  : classes.incompleteNotSelected
              }>incomplete
              </Button> 
              <Button onClick={() => handleStatusFilter("5", props.test_history[0].test_run_id)} className={
                            selectedStatus.includes("5")
                            ? classes.skippedSelected
                  : classes.skippedNotSelected
              } >skipped
              </Button> 
        </div>
                  <ListOfSuites>{props.test_history}</ListOfSuites>
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
