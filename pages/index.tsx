import { Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { AppContext } from "../components/AppContext"
import { SpacingPaper } from "../components/atoms"
import { HeaderArticleContainer } from "../components/organisms"
import { Layout } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import Link from "@material-ui/core/Link";
import fetch from 'isomorphic-unfetch';

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {},
  })
)

type Props = {}

function Index(props: Props) {
  const classes = useStyles(props)
  return (
    <Layout className={classes.root}>
      <HeaderArticleContainer>
        <SpacingPaper>
          <Typography variant="h5">
            Each service its running isolated from each other, so its possible
            to scale each of them based on the demand.
          </Typography>
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">WebSockets Service</Typography>
          <Typography variant="h6">
            <Link href="http://localhost:5000/">
              <a>WebSockets Info Page</a>
            </Link>
          </Typography>
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Core Service</Typography>
          <Typography variant="h6">
            <Link href="http://localhost:5001/">
              <a>Core Info Page</a>
            </Link>
            <br/>
            <Link href="http://localhost:5001/launches">
              <a>Launcher Endpoint Example</a>
            </Link>
            <br/>
            <Link href="http://localhost:5001/projects">
              <a>Projects Endpoint Example</a>
            </Link>
            <br/>
            <Link href="http://localhost:5001/tests">
              <a>Tests Endpoint Example</a>
            </Link>
            <br/>
            <Link href="http://localhost:5001/testsuites">
              <a>Test Suites Endpoint Example</a>
            </Link>
          </Typography>
        </SpacingPaper>
        <ul>
          {/* {props.projects.map(project => (
            <li key={project.id}>
              <Link href="/p/[id]" as={`/p/${project.id}`}>
                <a>{project.name}</a>
              </Link>
            </li>
          ))} */}
        </ul>
      </HeaderArticleContainer>
    </Layout>
  )
}

/**
 * Server side rendering
 */
Index.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx
  const res = await fetch("http://delta_core_service:5000/get_projects", {
    method: "POST",
  })
  const data = await res.json()

  console.log(`Show data fetched. Count: ${data.length}`)
  console.log(`Show data fetched. Count: ${data}`)
  console.log(`Show data fetched. Count: ${data.id}`)
  console.log(`Show data fetched. Count: ${data.name}`)
  console.log(`Show data fetched. Count: ${data.data}`)
  console.log(`Show data fetched. Count: ${data.project_status}`)

  const pagePayload: IPagePayload = {
    selectedPage: Page.TOP,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    projects: data.map(project => project.data)
  }
}

export default Index
