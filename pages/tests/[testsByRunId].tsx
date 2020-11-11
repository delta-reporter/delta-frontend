import React, { useState, useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { TestRun } from "../index"
import { GetServerSideProps } from "next"
import { InferGetServerSidePropsType } from "next"
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
import WbSunnyIcon from "@material-ui/icons/WbSunny"
import Brightness2Icon from "@material-ui/icons/Brightness2"

const useStyles = makeStyles(theme => ({
  rootLight: {
    width: "100%",
    maxWidth: 3500,
    color: theme.palette.secondary.light,
  },
  rootDark: {
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
  textColorLightMode: {},
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
  },
}))

function Tests({
  test_run,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles(test_run)

  // We are using two things here. State and var, they will hold the same value but used for different purposes
  // the way states work, `selectedStatus` state doesn't update immediately and it will have a old value inside the function, and correct value outside the function
  // So we use `selectedStatus` state for refreshing the component, and `statusArrayForEndpoint` var for endpoint
  const [selectedStatus, setSelectedStatus] = useState([
    "1",
    "2",
    "3",
    "4",
    "5",
  ])

  async function handleStatusFilter(status) {
    if (selectedStatus.includes(status) && selectedStatus.length !== 1) {
      setSelectedStatus(selectedStatus.filter(item => item !== status))
    } else if (!selectedStatus.includes(status)) {
      setSelectedStatus(selectedStatus.concat(status))
    }
  }

  // dark mode switch
  const [state, setState] = useState({ darkMode: getInitialDarkModeState() })

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    })
  }

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(state.darkMode)) // setting a variable in the browser storage
  }, [state.darkMode])

  function getInitialDarkModeState(): boolean {
    if (typeof window !== "undefined") {
      const savedColorMode = JSON.parse(localStorage.getItem("darkMode")) // checking the 'dark' var from browser storage
      return savedColorMode || false
    } else {
      return false
    }
  }

  return (
    <NoSsr>
      <BasePage
        className={state.darkMode ? classes.rootDark : classes.rootLight}
        darkMode={state.darkMode}
      >
        <title>Δ | Tests</title>
        {test_run ? (
          // checking if there data for this test_run
          // id needed here for scrolling to the top when needed
          <div id="page-top">
            <div>
              <div style={{ float: "left" }}>
                <Breadcrumbs
                  style={{
                    paddingLeft: "30px",
                    marginTop: "20px",
                  }}
                  className={
                    state.darkMode
                      ? classes.textColorDarkMode
                      : classes.textColorLightMode
                  }
                >
                  <Link color="inherit" href={`/`}>
                    Projects
                  </Link>
                  <Link
                    color="inherit"
                    href={`/launches/${test_run.project_id}`}
                  >
                    Launches
                  </Link>
                  <Typography
                    color="textPrimary"
                    className={
                      state.darkMode
                        ? classes.textColorDarkMode
                        : classes.textColorLightMode
                    }
                  >
                    Tests
                  </Typography>
                </Breadcrumbs>
              </div>
              <div
                style={{
                  float: "right",
                  width: "15%",
                  marginTop: "15px",
                }}
              >
                <Grid
                  component="label"
                  container
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <WbSunnyIcon></WbSunnyIcon>
                  </Grid>
                  <Grid item>
                    <Switch
                      checked={state.darkMode}
                      onChange={handleDarkModeChange}
                      name="darkMode"
                      color="primary"
                    />
                  </Grid>
                  <Grid item>
                    <Brightness2Icon></Brightness2Icon>
                  </Grid>
                </Grid>
              </div>
            </div>
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Paper
                    className={
                      state.darkMode ? classes.paperDark : classes.paperLight
                    }
                    elevation={2}
                  >
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 400,
                        margin: "5px",
                      }}
                      className={
                        state.darkMode
                          ? classes.textColorDarkMode
                          : classes.textColorLightMode
                      }
                    >
                      Test suites for{" "}
                      <Link
                        style={{ color: "#605959" }}
                        underline="none"
                        color="secondary"
                      >
                        {" "}
                        {test_run.test_type}{" "}
                      </Link>{" "}
                      run of
                      <span style={{ color: "#605959" }}>
                        {" "}
                        {test_run.project_name}
                      </span>
                      project
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        marginTop: "30px",
                        alignItems: "baseline",
                      }}
                    >
                      {" "}
                      {test_run.test_run_data &&
                      test_run.test_run_data.spectre_test_run_url ? (
                        <div>
                          <Button
                            href={
                              test_run.test_run_data.spectre_test_run_url +
                              "?status=fail"
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
                        <p
                          className={
                            state.darkMode
                              ? classes.textColorDarkMode
                              : classes.textColorLightMode
                          }
                        >
                          Filter by Status:
                        </p>
                        <Button
                          onClick={() => handleStatusFilter("2")}
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
                          onClick={() => handleStatusFilter("1")}
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
                          onClick={() => handleStatusFilter("3")}
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
                          onClick={() => handleStatusFilter("4")}
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
                          onClick={() => handleStatusFilter("5")}
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
                    <div>
                      <ListOfSuites
                        test_run_id={test_run.test_run_id}
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
          <h1>There is no data for this test run!</h1>
        )}{" "}
      </BasePage>
    </NoSsr>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { testsByRunId } = context.query

  const t_run = await fetch(
    `${process.env.deltaCore}/api/v1/test_run/${testsByRunId}`,
    { method: "GET" }
  )
  const test_run: TestRun = await t_run.json()

  return {
    props: {
      test_run,
    },
  }
}

export default Tests
