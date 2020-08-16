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
  NoSsr,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  rootLight: {
    width: "100%",
    maxWidth: 3500,
    color: "#8c8d8d",
  },
  rootDark:{
    width: "100%",
    maxWidth: 3500,
    backgroundColor: "#2a2a2a",
    color: "#8c8d8d",
  }, 
  title: {
    fontSize: "2em",
  },
  container: {
    paddingTop: theme.spacing(4),
    maxWidth: 3400,
    paddingBottom: theme.spacing(4),
  },
  paperDark: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: "#2a2a2a",
    border: "1px grey solid",
  },
  paperLight: {
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
  runningSelected: {
    backgroundColor: "#eabc89",
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
  runningNotSelected: {
    color: "#e1c5a6",
  },
  skippedNotSelected: {
    color: "#e3e1e1",
  },
  textColorDarkMode: {
    color: "#8c8d8d",
  },
  textColorLightMode: {
  },
  toggleModeDark: {
    backgroundColor: "#2a2a2a",
    color: "#8c8d8d",
    border: "1px grey solid",
    marginBottom: "15px",
  }, 
  toggleModeLight: {
    border: "1px grey solid",
    marginBottom: "15px",
  }, 
}))

type Props = {
  test_history: SuiteAndTest[]
}

function Tests(props: Props) {
  const classes = useStyles(props.test_history)

  // We are using two things here. State and var, they will hold the same value but used for different purposes
  // the way states work, `selectedStatus` state doesn't update immediately and it will have a old value inside the function, and correct value outside the function
  // So we use `selectedStatus` state for refreshing the component, and `statusArrayForEndpoint` var for endpoint
  let statusArrayForEndpoint = "1+2+3+4+5"
  const [selectedStatus, setSelectedStatus] = useState(["1", "2", "3", "4", "5"])

  const [data, setData] = useState(props.test_history)

  async function handleStatusFilter(status, testRunId) {
    let previousArray = selectedStatus
    if (selectedStatus.includes(status) && selectedStatus.length !== 1) {
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

  const [state, setState] = useState({
    darkMode: getInitialDarkModeState(),
  });
  
  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(state.darkMode)) //setting a variable in the browser storage
  }, [state.darkMode])

  function getInitialDarkModeState() :boolean {
    if (typeof window !== 'undefined') {
     const savedColorMode = JSON.parse(localStorage.getItem('darkMode')) //checking the 'dark' var from browser storage
     return savedColorMode || false
    }
    else {
      return false
    }
 }
  return (
    <NoSsr>
    <BasePage className={state.darkMode ? classes.rootDark : classes.rootLight} darkMode={state.darkMode}>
    <title>Δ | Tests</title>
      {props.test_history[0] ? ( // checking if props exist (if there are tests for this run)
        //  id needed here for scrolling to the top when needed
        <div id="page-top">
        <Breadcrumbs style={{ paddingLeft: "30px", marginTop: "20px"}}  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
            <Link color="inherit" href={`/`}>
              Projects
            </Link>
            <Link
              color="inherit"
              href={`/launches/${props.test_history[0].project_id}`}
            >
              Launches
            </Link>
            <Typography color="textPrimary" className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>Tests</Typography>
          </Breadcrumbs>
          <Container maxWidth="lg" className={classes.container}>
            <FormGroup row style={{paddingBottom: "10px"}}>
              <FormControlLabel
                control={<Switch checked={state.darkMode} onChange={handleDarkModeChange} name="darkMode" />}
                label="Dark Mode"
              />
            </FormGroup>            <Grid container spacing={3}>
              <Grid item xs={12}>
              <Paper className={state.darkMode ? classes.paperDark : classes.paperLight}>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 400, margin: "5px" }}
                    className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}
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
                      alignItems: "baseline",
                    }}
                  >
                    {props.test_history[0].test_run_data &&
                    props.test_history[0].test_run_data.spectre_test_run_url ? (
                      <div>
                        <Button
                          href={
                            props.test_history[0].test_run_data
                              .spectre_test_run_url
                          }
                          style={{
                            backgroundColor: "#90caf9",
                            width: "90px",
                            height: "30px",
                            marginLeft: "10px",
                            border: "1px #a7bab1 solid",
                            fontSize: "12px",
                          }}
                        >
                          Spectre
                        </Button>
                      </div>
                    ) : null}
                    <div
                      style={{
                        display: "flex",
                        paddingLeft: "100px",
                        alignItems: "baseline",
                      }}
                    >
                      <p className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}> Filter by Status: </p>
                      <Button
                        onClick={() =>
                          handleStatusFilter(
                            "2",
                            props.test_history[0].test_run_id
                          )
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
                          handleStatusFilter(
                            "1",
                            props.test_history[0].test_run_id
                          )
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
                          handleStatusFilter(
                            "3",
                            props.test_history[0].test_run_id
                          )
                        }
                        className={
                          selectedStatus.includes("3")
                            ? classes.runningSelected
                            : classes.runningNotSelected
                        }
                        style={{
                          width: "90px",
                          height: "30px",
                          marginLeft: "10px",
                          border: "1px #c5baae solid",
                          fontSize: "12px",
                        }}
                      >
                        running
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusFilter(
                            "4",
                            props.test_history[0].test_run_id
                          )
                        }
                        className={
                          selectedStatus.includes("4")
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
                          handleStatusFilter(
                            "5",
                            props.test_history[0].test_run_id
                          )
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
                  </div>
                  {data[0] ? ( // if there is no data returned from filtering - use initial props
                    <ListOfSuites
                      children={data}
                      stats={selectedStatus}
                      darkMode={state.darkMode}
                    ></ListOfSuites>
                  ) : (
                    <div>
                      <Typography
                        style={{
                          fontStyle: "italic",
                          margin: "20px",
                          color: "red",
                        }}
                      >
                        Sorry, there are no matching tests for this filter
                      </Typography>
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
    </NoSsr>
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
