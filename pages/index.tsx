import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { AppContext } from "../components/AppContext"
import { SpacingPaper } from "../components/atoms"
import { HeaderArticleContainer } from "../components/organisms"
import { Dashboard } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import fetch from "isomorphic-unfetch"

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    counter: {
      margin: 10,
    },
    title: {
      fontSize: "2em",
    },
  })
)
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
  launch: string
  start_datetime: string
  end_datetime: string
  test_run_status: string
  test_type: string
  data: { url?: string }
}

export interface TestSuite {
  id: number
  name: string
  start_datetime: string
  end_datetime: string
  test_suite_status: string
  test_type: string
  data: { url?: string }
  test_run: {
    id: number
    launch: string
    test_run_status: string
    test_type: string
  }
}

export interface Test {
  id: number
  name: string
  start_datetime: string
  end_datetime: string
  test_resolution: string
  test_status: string
  test_suite: string
  data: { url?: string }
}

type Props = {
  test_projects: TestProject[]
  test_launches: TestLaunch[]
  test_runs: TestRun[]
  test_suites: TestSuite[]
  tests: Test[]
}

function Index(props: Props) {
  const classes = useStyles(props)
  return (
    <Dashboard className={classes.root}>
      <HeaderArticleContainer>
        <SpacingPaper>
          <Typography>
            Each service its running isolated from each other, so its possible
            to scale each of them based on the demand.
          </Typography>
        </SpacingPaper>

        <SpacingPaper>
          <Typography variant="h5">WebSockets Service</Typography>
          <List>
            <ListItem button href="http://localhost:5000/">
              <ListItemText primary="WebSockets Info Page" />
            </ListItem>
          </List>
        </SpacingPaper>

        <SpacingPaper>
          <Typography variant="h5">Core Service</Typography>
          <List>
            <ListItem button href="http://localhost:5001/">
              <ListItemText primary="Core Info Page" />
            </ListItem>
            <Divider />
            <ListItem button href="http://localhost:5001/launches">
              <ListItemText primary="Launcher Endpoint Example" />
            </ListItem>
            <Divider />
            <ListItem button href="http://localhost:5001/launches">
              <ListItemText primary="Projects Endpoint Example" />
            </ListItem>
            <Divider />
            <ListItem button href="http://localhost:5001/launches">
              <ListItemText primary="Tests Endpoint Example" />
            </ListItem>
            <Divider />
            <ListItem button href="http://localhost:5001/testsuites">
              <ListItemText primary="Test Suites Endpoint Example" />
            </ListItem>
          </List>
        </SpacingPaper>

        <SpacingPaper>
          <Typography variant="h5">Projects</Typography>
          {props.test_projects.map(project => (
            <List>
              <ListItem button>
                <ListItemText primary={project.name} />
              </ListItem>
              <Divider />
            </List>
          ))}
        </SpacingPaper>

        <SpacingPaper>
          <Typography variant="h5">Launches</Typography>
          {props.test_launches.map(launch => (
            <List>
              <ListItem button>
                <ListItemText primary={launch.name} />
                <br />
                {launch.launch_status}
              </ListItem>
              <Divider />
            </List>
          ))}
        </SpacingPaper>

        <SpacingPaper>
          <Typography variant="h5">Runs</Typography>
          {props.test_runs.map(testRun => (
            <List>
              <ListItem button>
                <ListItemText primary={testRun.id} />
                <br />
                {testRun.test_run_status}
                <br />
                {testRun.test_type}
              </ListItem>
              <Divider />
            </List>
          ))}
        </SpacingPaper>

        <SpacingPaper>
          <Typography variant="h5">Suites</Typography>
          {props.test_suites.map(testSuite => (
            <List>
              <ListItem button>
                <ListItemText primary={testSuite.name} />
                <br />
                {testSuite.start_datetime}
                <br />
                {testSuite.end_datetime}
              </ListItem>
              <Divider />
            </List>
          ))}
        </SpacingPaper>

        <SpacingPaper>
          <Typography variant="h5">Tests</Typography>
          {props.tests.map(test => (
            <List>
              <ListItem button>
                <ListItemText primary={test.name} />
                <br />
                {test.test_status}
                <br />
                {test.test_resolution}
              </ListItem>
              <Divider />
            </List>
          ))}
        </SpacingPaper>
      </HeaderArticleContainer>
    </Dashboard>
  )
}

/**
 * Server side rendering
 */
Index.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx
  const projectReq = await fetch(
    "http://delta_core_service:5000/get_projects",
    {
      method: "POST",
    }
  )
  const projects = await projectReq.json()

  const launchesReq = await fetch(
    "http://delta_core_service:5000/get_launches",
    {
      method: "POST",
    }
  )
  const launches = await launchesReq.json()

  const runsReq = await fetch("http://delta_core_service:5000/get_test_runs", {
    method: "POST",
  })
  const runs = await runsReq.json()

  const suitesReq = await fetch(
    "http://delta_core_service:5000/get_test_suites",
    {
      method: "POST",
    }
  )
  const suites = await suitesReq.json()

  const testsReq = await fetch("http://delta_core_service:5000/get_tests", {
    method: "POST",
  })
  const tests = await testsReq.json()

  const pagePayload: IPagePayload = {
    selectedPage: Page.TOP,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    test_projects: projects,
    test_launches: launches,
    test_runs: runs,
    test_suites: suites,
    tests: tests,
  }
}

export default Index
