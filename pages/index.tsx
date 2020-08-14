import {
  Container,
  Paper,
  Grid,
  Typography,
  ListItem,
  List,
  Button,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React, { useState, useEffect } from "react"
import { AppContext } from "../components/AppContext"
import { BasePage } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import fetch from "isomorphic-unfetch"
import Router from "next/router"
import NoSsr from '@material-ui/core/NoSsr'

const useStyles = makeStyles(theme => ({
  rootLight: {
    flexGrow: 1,
    color: "#aaadb0",
  },
  rootDark:{
    flexGrow: 1,
    backgroundColor: "#000000",
    color: "#aaadb0",
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
    backgroundColor: "#000000",
    height: 240,
    width: 300,
    border: "1px grey solid",
    color: "#aaadb0",
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
    color: "#aaadb0",
  },
  projectTitle: {
    paddingTop: theme.spacing(7),
    textAlign: "center",
  },
  pageTitleSectionDark: {
    backgroundColor: "#395265",
    padding: theme.spacing(5),
    textAlign: "center",
    color: "#aaadb0",
  },
  pageTitleSectionLight: {
    backgroundColor: theme.palette.primary.light,
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
    backgroundColor: "#000000",
    color: "#aaadb0",
    border: "1px grey solid",
  }, 
  toggleModeLight: {
    border: "1px grey solid",
  }, 
}))
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
export interface TestRun {
  test_run_id: number
  launch_id: number
  project_id: number
  launch_name: string
  duration: {
    days: number
    hours: number
    minutes: number
    months: number
    seconds: number
    years: number
  }
  test_run_status: string
  test_type: string
  data: { url?: string }
}
export interface SuiteAndTest {
  test_run_id: number
  launch_id: number
  project_id: number
  test_type: string
  test_run_data?: {spectre_test_run_url: string}
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
          test_history_id: number
          test_id: number
          name: string
          resolution: string
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
        }
      ]
    }
  ]
}

type Props = {
  test_projects: TestProject[]
}

function Index(props: Props) {
  const classes = useStyles(props)

  const [darkMode, setDarkMode] = useState(getInitialColorMode())

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode)) //setting a variable in the browser storage
  }, [darkMode])

  function getInitialColorMode() :boolean {
    if (typeof window !== 'undefined') {
     const savedColorMode = JSON.parse(localStorage.getItem('darkMode')) //checking the 'dark' var from browser storage
     return savedColorMode || false
    }
    else {
      return false
    }
 }

// https://www.npmjs.com/package/universal-cookie - cookie way

  return (
      <NoSsr>
        <BasePage className={darkMode ? classes.rootDark : classes.rootLight} darkMode={darkMode}>
        <title>Δ | Projects</title>
        <Paper square={true} className={darkMode ? classes.pageTitleSectionDark : classes.pageTitleSectionLight}>
              <Typography variant="h1" color="inherit" className={classes.pageTitle}>
              Projects
              </Typography>
              <Typography
                variant="subtitle1"
                color="inherit"
              >
                Select a project to view latest test runs
              </Typography>
            </Paper>
          <Container maxWidth="lg" className={classes.container}>
          <Button onClick={() => setDarkMode(prevMode => !prevMode)} className = {darkMode ? classes.toggleModeDark : classes.toggleModeLight}>Change color Mode</Button>
            {props.test_projects[0] ? ( // checking if props exist (if there are projects)
              <Grid container spacing={3}>
                {props.test_projects.map(project => (
                  <Grid item xs={12} sm={3} key={project.project_id}>
                    <List>
                      <ListItem
                        button
                        onClick={() =>
                          Router.push(`/launches/${project.project_id}`)
                        }
                      >
                        <Paper className={darkMode ? classes.paperDark : classes.paperLight}>
                          <Typography
                            component="p"
                            variant="h4"
                            className={classes.projectTitle}
                          >
                            {project.name}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            className={darkMode ? classes.projectStatusDark : classes.projectStatusLight}
                            component="p"
                          >
                            {project.project_status}
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

// It runs  on the server-side, making a request before page is loaded.
// The data required to render the page is available at build time ahead of a user’s request
// https://nextjs.org/docs/api-reference/data-fetching/getInitialProps

Index.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx
  const projectReq = await fetch(`${process.env.deltaCore}/api/v1/projects`, {
    method: "GET",
  })
  const projects = await projectReq.json()

  const pagePayload: IPagePayload = {
    selectedPage: Page.PROJECTS,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    test_projects: projects,
  }
}

export default Index
