import {
  Container,
  Paper,
  Grid,
  Typography,
  ListItem,
  List,
} from "@material-ui/core"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { BasePage } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import fetch from "isomorphic-unfetch"
import Router from "next/router"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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
  fixedHeightAndWidth: {
    height: 240,
    width: 300,
  },
  projectStatus: {
    flex: 1,
    paddingTop: theme.spacing(1),
    textAlign: "center",
  },
  projectTitle: {
    paddingTop: theme.spacing(7),
    textAlign: "center",
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
export interface Test {
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
  test_suite_id: number
  media: [
    {
      type: string
      filename: string
      file_id: string
    }
  ]
}

type Props = {
  test_projects: TestProject[]
}

function Index(props: Props) {
  const classes = useStyles(props)
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightAndWidth)

  return (
    <BasePage className={classes.root}>
      <title>Δ | Projects</title>
      <Container maxWidth="lg" className={classes.container}>
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
                    <Paper className={fixedHeightPaper}>
                      <Typography
                        component="p"
                        variant="h4"
                        className={classes.projectTitle}
                      >
                        {project.name}
                      </Typography>
                      <Typography
                        color="textSecondary"
                        className={classes.projectStatus}
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
