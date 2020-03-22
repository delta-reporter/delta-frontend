import { Container, Paper, Grid, Typography, Link } from "@material-ui/core"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { BasePage } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { TestProject } from "."
import fetch from "isomorphic-unfetch"

const useStyles = makeStyles(theme => ({
  root: {},
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
  fixedHeight: {
    height: 240,
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
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)

  return (
    <BasePage className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          {props.test_projects.map(project => (
            <Grid item xs={12} md={4} lg={3}>
              <Link underline="none" href={`/launches/${project.id}`}>
                <Paper className={fixedHeightPaper}>
                  <Typography
                    component="p"
                    variant="h4"
                    className={classes.title}
                  >
                    {project.name}
                  </Typography>
                  <Typography color="textSecondary" className={classes.context}>
                    {project.project_status}
                  </Typography>
                  <div>
                    <Link color="primary" href={`/launches/${project.id}`}>
                      View details
                    </Link>
                  </div>
                </Paper>
              </Link>
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
