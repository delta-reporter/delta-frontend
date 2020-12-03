import {
  Container,
  Paper,
  Grid,
  Typography,
  ListItem,
  List,
  NoSsr,
  Switch,
} from "@material-ui/core"
import { GetServerSideProps } from "next"
import { InferGetServerSidePropsType } from "next"
import { makeStyles } from "@material-ui/core/styles"
import React, { useState, useEffect } from "react"
import { BasePage } from "../components/templates"
import fetch from "isomorphic-unfetch"
import useSocket from "../hooks/useSocket"
import Router from "next/router"
import WbSunnyIcon from "@material-ui/icons/WbSunny"
import Brightness2Icon from "@material-ui/icons/Brightness2"
import ProjectSettingsModal from "../components/templates/settings/ProjectSettingsModal"

const useStyles = makeStyles(theme => ({
  rootLight: {
    flexGrow: 1,
    color: theme.palette.secondary.light,
  },
  rootSemiLight: {
    flexGrow: 1,
    backgroundColor: "#656464",
  },
  rootDark: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paperLight: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 240,
    width: 300,
  },
  paperDark: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.main,
    height: 240,
    width: 300,
    border: "1px grey solid",
    color: theme.palette.secondary.light,
  },
  projectStatusLight: {
    flex: 1,
    paddingTop: theme.spacing(1),
    textAlign: "center",
  },
  projectStatusDark: {
    flex: 1,
    paddingTop: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.secondary.light,
  },
  projectTitle: {
    padding: "60px 0",
    textAlign: "center",
  },
  pageTitleSectionDark: {
    backgroundColor: theme.palette.secondary.dark,
    padding: theme.spacing(5),
    textAlign: "center",
    color: theme.palette.secondary.light,
  },
  pageTitleSectionLight: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(5),
    textAlign: "center",
  },
  pageTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3em",
    padding: theme.spacing(1),
  },
  toggleModeDark: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
    border: "1px grey solid",
  },
  toggleModeLight: {
    border: "1px grey solid",
  },
  modalLight: {
    position: "absolute",
    width: 400,
    height: 300,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10, 15, 3),
  },
  modalDark: {
    position: "absolute",
    width: 400,
    height: 300,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(10, 15, 3),
  },
}))

export interface TestRun {
  test_run_id: number
  launch_id: number
  project_id: number
  project_name: string
  launch_name: string
  test_type: string
  start_datetime: string
  end_datetime: string
  duration: {
    days: number
    hours: number
    minutes: number
    months: number
    seconds: number
    years: number
  }
  test_run_status: string
  test_run_data: {
    spectre_test_run_url?: string
  }
}

export interface TestProject {
  project_id: number
  name: string
  project_status: string
  data: { url?: string }
}
export interface TestLaunch {
  launch_id: number
  name: string
  launch_status: string
  project: string
  project_id: number
  data: { url?: string }
  test_run_stats: [
    {
      test_run_id: number
      test_type: string
      tests_total: number
      tests_failed: number
      tests_passed: number
      tests_running: number
      tests_incomplete: number
      tests_skipped: number
    }
  ]
}

export interface SuiteAndTest {
  test_run_id: number
  launch_id: number
  project_id: number
  test_type: string
  project_name: string
  test_run_data?: { spectre_test_run_url: string }
  test_suites: [
    {
      test_suite_history_id: number
      test_suite_id: number
      name: string
      test_suite_status: string
      duration: {
        days: number
        hours: number
        minutes: number
        months: number
        seconds: number
        years: number
      }
      tests_total: number
      tests_failed: number
      tests_passed: number
      tests_running: number
      tests_incomplete: number
      tests_skipped: number
      tests: [
        {
          duration: {
            days: number
            hours: number
            minutes: number
            months: number
            seconds: number
            years: number
          }
          test_id: number
          mother_test_id: number
          name: string
          test_history_resolution: number
          test_resolution: number
          message: string
          status: string
          error_type: string
          trace: string
          file: string
          retries: string
          media: [
            {
              type: string
              filename: string
              file_id: string
            }
          ]
          is_flaky: boolean
        }
      ]
    }
  ]
}

export interface Suite {
  test_suite_history_id: number
  test_suite_id: number
  name: string
  test_suite_status: string
  duration: {
    days: number
    hours: number
    minutes: number
    months: number
    seconds: number
    years: number
  }
  tests_total: number
  tests_failed: number
  tests_passed: number
  tests_running: number
  tests_incomplete: number
  tests_skipped: number
  tests: [
    {
      duration: {
        days: number
        hours: number
        minutes: number
        months: number
        seconds: number
        years: number
      }
      test_id: number
      mother_test_id: number
      name: string
      test_history_resolution: number
      test_resolution: number
      message: string
      status: string
      error_type: string
      trace: string
      file: string
      retries: string
      media: [
        {
          type: string
          filename: string
          file_id: string
        }
      ]
      is_flaky: boolean
    }
  ]
}

export interface Test {
  duration: {
    days: number
    hours: number
    minutes: number
    months: number
    seconds: number
    years: number
  }
  test_id: number
  mother_test_id: number
  name: string
  test_history_resolution: number
  test_resolution: number
  message: string
  status: string
  error_type: string
  trace: string
  file: string
  retries: string
  media: [
    {
      type: string
      filename: string
      file_id: string
    }
  ]
  is_flaky: boolean
}

function Index({ projects }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles(projects)

  const [testProjects, setTestProjects] = useState(projects || [])

  useSocket("delta_project", testProject => {
    setTestProjects(testProjects => [...testProjects, testProject])
  })

  // dark mode switch
  const [state, setState] = useState({
    darkMode: getInitialDarkModeState(),
  })

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(state.darkMode)) //setting a variable in the browser storage
  }, [state.darkMode])

  function getInitialDarkModeState(): boolean {
    if (typeof window !== "undefined") {
      const savedColorMode = JSON.parse(localStorage.getItem("darkMode")) //checking the 'dark' var from browser storage
      return savedColorMode || false
    } else {
      return false
    }
  }

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  }

  return (
    <NoSsr>
      <BasePage
        className={state.darkMode ? classes.rootDark : classes.rootLight}
        darkMode={state.darkMode}
      >
        <title>Δ | Projects</title>
        <Paper
          square={true}
          className={
            state.darkMode
              ? classes.pageTitleSectionDark
              : classes.pageTitleSectionLight
          }
        >
          <Typography
            variant="h1"
            color="inherit"
            className={classes.pageTitle}
          >
            Projects
          </Typography>
          <Typography variant="subtitle1" color="inherit">
            Select a project to view latest test runs
          </Typography>
        </Paper>
        <Container maxWidth="lg" className={classes.container}>
          <div style={{ float: "right", width: "15%", marginTop: "15px" }}>
            <Grid component="label" container alignItems="center" spacing={1}>
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
          {testProjects[0] ? ( // checking if props exist (if there are projects)
            <Grid container spacing={3}>
              {testProjects.map(project => (
                <Grid item xs={12} sm={3} key={project.project_id}>
                  <List>
                    <ListItem button>
                      <ProjectSettingsModal project_id={project.project_id}  darkMode={state.darkMode}/>
                      <Paper
                        className={
                          state.darkMode
                            ? classes.paperDark
                            : classes.paperLight
                        }
                        id={`paper_${project.project_id}`}
                        onClick={() =>
                          Router.push(`/launches/${project.project_id}`)
                        }
                      >
                        <Typography
                          component="p"
                          variant="h4"
                          className={classes.projectTitle}
                        >
                          {project.name}
                        </Typography>
                      </Paper>{" "}
                    </ListItem>
                  </List>
                </Grid>
              ))}
            </Grid>
          ) : (
            <h1>No projects were found! </h1>
          )}
        </Container>
      </BasePage>
    </NoSsr>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const projectReq = await fetch(`${process.env.deltaCore}/api/v1/projects`, {
    method: "GET",
  })
  const projects: TestProject[] = await projectReq.json()

  return {
    props: { projects },
  }
}

export default Index
