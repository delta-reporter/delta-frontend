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
  context: {
    flex: 1,
  },
  title: {
    paddingTop: theme.spacing(2),
  },
}))
export interface TestProject {
  id: number
  name: string
  project_status: string
  data: { url?: string }
}
export interface TestLaunch {
  id: number
  name: string
  launch_status: string
  project: string
  data: { url?: string }
}
export interface TestRun {
  id: number
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
export interface Test {
  id: number
  test_type: string
  test_suites: [
    {
      id: number
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
          id: number
          name: string
          resolution: string
          status: string
          trace: string
          file: string
          retries: string
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
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeightAndWidth)

  return (
    <BasePage className={classes.root}>
      <title>Δ | Projects</title>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {props.test_projects.map(project => (
            <Grid item xs={12} sm={3} key={project.id}>
              <List>
                <ListItem
                  button
                  onClick={() => Router.push(`/launches/${project.id}`)}
                >
                  <Paper className={fixedHeightPaper}>
                    <Typography
                      component="p"
                      variant="h4"
                      className={classes.title}
                    >
                      {project.name}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      className={classes.context}
                      component="p"
                    >
                      {project.project_status}
                    </Typography>
                    <Typography color="primary"> View details</Typography>
                  </Paper>{" "}
                </ListItem>
              </List>
            </Grid>
          ))}
        </Grid>
      </Container>
    </BasePage>
  )
}

/**
 * Server side rendering
 */
Index.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx
  const projectReq = await fetch(
    "http://delta_core_service:5000/api/v1/projects",
    {
      method: "GET",
    }
  )
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
