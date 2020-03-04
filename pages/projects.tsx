import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Link,
} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { BasePage, SpacingPaper } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { TestProject } from "."
import fetch from "isomorphic-unfetch"

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {},
  })
)

type Props = {
  test_projects: TestProject[]
}

function Projects(props: Props) {
  const {} = props
  const classes = useStyles(props)

  return (
    <BasePage className={classes.root}>
      <SpacingPaper noPadding>
        {props.test_projects.map(project => (
          <div>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Link href="http://localhost:3000/launches">
                    <Typography gutterBottom variant="h5" component="h2">
                      {project.name}{" "}
                    </Typography>
                  </Link>
                </CardContent>
              </CardActionArea>
              <Divider variant="inset" />
            </Card>
          </div>
        ))}
      </SpacingPaper>
    </BasePage>
  )
}

/**
 * Server side rendering
 */
Projects.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx

  const projectReq = await fetch(
    "http://delta_core_service:5000/get_projects",
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
