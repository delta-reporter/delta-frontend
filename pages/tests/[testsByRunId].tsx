import React, { useState, useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { SuiteAndTest } from "../index"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
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
  Switch,
} from "@material-ui/core"
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness2Icon from '@material-ui/icons/Brightness2';

const useStyles = makeStyles(theme => ({
  rootLight: {
    width: "100%",
    maxWidth: 3500,
    color: theme.palette.secondary.light,
  },
  rootDark:{
    width: "100%",
    maxWidth: 3500,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
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
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.main,
    border: "1px grey solid",
  },
  paperLight: {
    padding: theme.spacing(3),
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
    color: theme.palette.secondary.light,
  },
  textColorLightMode: {
  },
  toggleModeDark: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
    border: "1px grey solid",
    marginBottom: "15px",
  }, 
  toggleModeLight: {
    border: "1px grey solid",
    marginBottom: "15px",
  }, 
  spectreButton: {
      backgroundColor: theme.palette.primary.main,
      width: "90px",
      height: "30px",
      marginLeft: "10px",
      border: "1px #a7bab1 solid",
      fontSize: "12px",
  }
}))


function Tests({tests}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles(tests)

  // We are using two things here. State and var, they will hold the same value but used for different purposes
  // the way states work, `selectedStatus` state doesn't update immediately and it will have a old value inside the function, and correct value outside the function
  // So we use `selectedStatus` state for refreshing the component, and `statusArrayForEndpoint` var for endpoint
  let statusArrayForEndpoint = "1+2+3+4+5"
  const [selectedStatus, setSelectedStatus] = useState(["1", "2", "3", "4", "5"])

  // console.log(tests)
  const [data, setData] = useState(tests[0].test_suites)

  const updateSuites = (suites) => {
    // const newTests = [...tests];
    // newTests[index] = test;
    console.log(suites)
    setData(suites);
  }

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
    console.log("### MAIN STATS ###")
    console.log(statusArrayForEndpoint)
    // console.log(requestOptions)

    // const response = await fetch(
    //   `${process.env.publicDeltaCore}/api/v1/tests_history/test_status/${statusArrayForEndpoint}/test_run/${testRunId}`,
    //   requestOptions
    // )
    // we refresh the props here
    // let new_data = await response.json();
    // console.log("NEW DATA: ")
    // console.log(new_data)
    // console.log("NEW DATA TEST SUITES: ")
    // console.log(new_data.test_suites)
    // setData(new_data.test_suites)
    // updateSuites(await new_data.test_suites)
    // console.log("DATA: ")
    // console.log(data)
  }

  // dark mode switch
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
      {tests[0] ? ( // checking if props exist (if there are tests for this run)
        //  id needed here for scrolling to the top when needed
        <div id="page-top">
          <div>
            <div style={{ float: "left"}}>
              <Breadcrumbs style={{ paddingLeft: "30px", marginTop: "20px"}}  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
                <Link color="inherit" href={`/`}>
                  Projects
                </Link>
                <Link
                  color="inherit"
                  href={`/launches/${tests[0].project_id}`}
                >
                  Launches
                </Link>
                <Typography color="textPrimary" className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>Tests</Typography>
              </Breadcrumbs>
            </div>          
            <div style={{ float: "right", width: "15%", marginTop: "15px"}}>
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item><WbSunnyIcon></WbSunnyIcon></Grid>
                <Grid item>
                  <Switch checked={state.darkMode} onChange={handleDarkModeChange} name="darkMode" color="primary"/>
                </Grid>
                <Grid item><Brightness2Icon></Brightness2Icon></Grid>
              </Grid>
            </div>
          </div>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
              <Paper className={state.darkMode ? classes.paperDark : classes.paperLight} elevation={2}>
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
                      {tests[0].test_type}
                    </Link>{" "}
                    run of <span style={{ color: "#605959" }}>{tests[0].project_name}</span> project
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "30px",
                      alignItems: "baseline",
                    }}
                  >
                    {tests[0].test_run_data &&
                    tests[0].test_run_data.spectre_test_run_url ? (
                      <div>
                        <Button
                          href={
                            tests[0].test_run_data
                              .spectre_test_run_url + "?status=fail"
                          }
                          className={classes.spectreButton}
                          target="_blank"
                        >
                          Spectre
                        </Button>
                      </div>
                    ) : null}
                    <div
                      style={{
                        display: "flex",
                        paddingLeft: "145px",
                        alignItems: "baseline",
                      }}
                    >
                      <p className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}> Filter by Status: </p>
                      <Button
                        onClick={() =>
                          handleStatusFilter(
                            "2",
                            tests[0].test_run_id
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
                            tests[0].test_run_id
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
                            tests[0].test_run_id
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
                            tests[0].test_run_id
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
                            tests[0].test_run_id
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
                  {/* {data ? ( // if there is no data returned from filtering - show error message
                    <div>
                        <ListOfSuites
                          children={data}
                          stats={selectedStatus}
                          darkMode={state.darkMode}
                        ></ListOfSuites>
                    </div>
                  ) : (
                    <div>
                      <Typography
                        style={{
                          fontStyle: "italic",
                          margin: "20px",
                          color: "#d62727",
                        }}
                      >
                        Sorry, there are no matching tests for this filter
                      </Typography>
                    </div>
                  )} */}
                  <div>
                    <ListOfSuites
                      test_run_id={tests[0].test_run_id}
                      // children={data}
                      stats={selectedStatus}
                      darkMode={state.darkMode}
                    ></ListOfSuites>
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
    </NoSsr>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { testsByRunId } = context.query

  // Suites and tests (inside suites)
  const testsByTestRunIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/tests_history/test_run/${testsByRunId}`,
    {
      method: "GET",
    }
  )
  const tests: SuiteAndTest[] = await testsByTestRunIdReq.json()

  return {
    props: { tests },
  }
}

export default Tests
