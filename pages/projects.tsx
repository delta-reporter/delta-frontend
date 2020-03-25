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
import { TestProject } from "."
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

type Props = {
  test_projects: TestProject[]
}

function Projects(props: Props) {
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
Projects.getInitialProps = async (ctx: AppContext): Promise<Props> => {
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

export default Projects
