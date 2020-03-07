import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import { AppContext } from "../components/AppContext"
import { SpacingPaper, BasePage } from "../components/templates"
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

export interface TestHistory {
  id: number
  start_datetime: string
  end_datetime: string
  launch: string
  test_run_status: string
  test_type: string
  test: {
    name: string
    start_datetime: string
    end_datetime: string
    resolution: string
    status: string
    data: any
  }
  test_suite: {
    name: string
    test_suite_status: string
    start_datetime: string
    end_datetime: string
  }
}

type Props = {
  test_projects: TestProject[]
  test_launches: TestLaunch[]
  test_runs: TestRun[]
  test_suites: TestSuite[]
  tests_history: TestHistory[]
  tests: Test[]
}

function Index(props: Props) {
  const classes = useStyles(props)
  return (
    <BasePage className={classes.root}>
      <SpacingPaper>
        <Typography>
          Each service its running isolated from each other, so its possible to
          scale each of them based on the demand.
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
            <ListItemText primary="Core Info (Home) Page" />
          </ListItem>
          <Divider />
          <ListItem button href="http://localhost:5001/launches">
            <ListItemText primary="Launcher Endpoint Example" />
          </ListItem>
          <Divider />
          <ListItem button href="http://localhost:5001/projects">
            <ListItemText primary="Projects Endpoint Example" />
          </ListItem>
          <Divider />
          <ListItem button href="http://localhost:5001/testruns">
            <ListItemText primary="Test Runs Endpoint Example" />
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
      <SpacingPaper noPadding>
        <Typography variant="h5">Tests History</Typography>
        {props.tests_history.map(testHistory => (
          <List>
            <ListItem button>
              <ListItemText primary={testHistory.id} />
              <br />
              {testHistory.launch}
              <br />
              {testHistory.start_datetime}
              <br />
              {testHistory.end_datetime}
              <br />
              {testHistory.test_type}
              <br />
              {testHistory.test_run_status}
              <br />
              {testHistory.test_suite.name}
              <br />
              {testHistory.test_suite.test_suite_status}
              <br />
              {testHistory.test_suite.start_datetime}
              <br />
              {testHistory.test_suite.end_datetime}
              <br />
              {testHistory.test.name}
              <br />
              {testHistory.test.status}
              <br />
              {testHistory.test.resolution}
            </ListItem>
            <Divider />
          </List>
        ))}
      </SpacingPaper>
    </BasePage>
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
      method: "GET",
    }
  )
  const projects = await projectReq.json()

  const launchesReq = await fetch(
    "http://delta_core_service:5000/get_launches",
    {
      method: "GET",
    }
  )
  const launches = await launchesReq.json()

  const runsReq = await fetch("http://delta_core_service:5000/get_test_runs", {
    method: "GET",
  })
  const runs = await runsReq.json()

  const suitesReq = await fetch(
    "http://delta_core_service:5000/get_test_suites",
    {
      method: "GET",
    }
  )
  const suites = await suitesReq.json()

  const testsReq = await fetch("http://delta_core_service:5000/get_tests", {
    method: "GET",
  })
  const tests = await testsReq.json()

  const testsHistoryReq = await fetch(
    "http://delta_core_service:5000/tests_history/test_run_id/1",
    {
      method: "GET",
    }
  )
  const testsHistory = await testsHistoryReq.json()

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
    tests_history: testsHistory,
    tests: tests,
  }
}

export default Index
