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

export interface TestSuite {
  test_suite_id: number
  name: string
  start_datetime: string
  end_datetime: string
  test_suite_status: string
  duration: {
    days: number
    hours: number
    minutes: number
    months: number
    seconds: number
    years: number
  }
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

export interface TestHistory {
  duration: {
    days: number
    hours: number
    minutes: number
    months: number
    seconds: number
    years: number
  }
  id: number
  launch: string
  start_datetime: string
  end_datetime: string
  test_run_status: string
  test_type: string
  test_suites: [
    {
      id: number
      name: string
      start_datetime: string
      end_datetime: string
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
          end_datetime: string
          id: number
          name: string
          start_datetime: string
          resolution: string
          status: string
          data?: {}
        }
      ]
    }
  ]
}

type Props = {
  test_projects: TestProject[]
  test_launches: TestLaunch[]
  test_runs: TestRun[]
  test_suites: TestSuite[]
  tests_history: Test[]
}

function Index(props: Props) {
  const classes = useStyles(props)

  return (
    <BasePage className={classes.root}>
      <title>Δ | Homepage</title>
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
          <ListItem button href="http://localhost:5001/api/v1/launches">
            <ListItemText primary="Launcher Endpoint Example" />
          </ListItem>
          <Divider />
          <ListItem button href="http://localhost:5001/api/v1/projects">
            <ListItemText primary="Projects Endpoint Example" />
          </ListItem>
          <Divider />
          <ListItem button href="http://localhost:5001/api/v1/testruns">
            <ListItemText primary="Test Runs Endpoint Example" />
          </ListItem>
          <Divider />
          <ListItem button href="http://localhost:5001/api/v1/testsuites">
            <ListItemText primary="Test Suites Endpoint Example" />
          </ListItem>
        </List>
      </SpacingPaper>

      <SpacingPaper>
        <Typography variant="h5">Projects</Typography>
        {props.test_projects[0] ? ( // checking if props exist
          <div>
            {props.test_projects.map(project => (
              <List>
                <ListItem button>
                  <ListItemText primary={project.name} />
                </ListItem>
                <Divider />
              </List>
            ))}
          </div>
        ) : (
          // if props don't exist
          <h1>No projects were found! </h1>
        )}
      </SpacingPaper>

      <SpacingPaper>
        <Typography variant="h5">Launches</Typography>
        {props.test_launches[0] ? ( // checking if props exist
          <div>
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
          </div>
        ) : (
          // if props don't exist
          <h1>No launches were found! </h1>
        )}
      </SpacingPaper>

      <SpacingPaper>
        <Typography variant="h5">Runs</Typography>
        {props.test_runs[0] ? ( // checking if props exist
          <div>
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
          </div>
        ) : (
          // if props don't exist
          <h1>No runs were found! </h1>
        )}
      </SpacingPaper>

      <SpacingPaper>
        <Typography variant="h5">Suites</Typography>
        {props.test_suites[0] ? ( // checking if props exist
          <div>
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
          </div>
        ) : (
          // if props don't exist
          <h1>No suites were found! </h1>
        )}
      </SpacingPaper>

      <SpacingPaper noPadding>
        <Typography variant="h5">Tests History</Typography>
        {props.tests_history[0] ? ( // checking if props exist
          <div>
            {/* runs */}
            {props.tests_history.map(testHistory => (
              <div key={testHistory.id}>
                {/* suites */}
                {testHistory.test_suites.map(testSuite => (
                  <div key={testSuite.id}>
                    {/* tests */}
                    {testSuite.tests.map(test => (
                      <List key={test.id}>
                        <ListItem button>
                          <ListItemText primary={test.id} />
                          <br />
                          Test: {test.name}
                          <br />
                          Duration: {test.duration.minutes}
                          <br />
                          Status: {test.status}
                          <br />
                          Resolution: {test.resolution}
                        </ListItem>
                        <Divider />
                      </List>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          // if props don't exist
          <h1>No tests were found for test run 2! </h1>
        )}
      </SpacingPaper>
    </BasePage>
  )
}

/**
 * Server side rendering
 */
Index.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx
  const projectReq = await fetch(`${process.env.deltaCore}/api/v1/projects`, {
    method: "GET",
  })
  const projects = await projectReq.json()

  const launchesReq = await fetch(`${process.env.deltaCore}/api/v1/launches`, {
    method: "GET",
  })
  const launches = await launchesReq.json()

  const runsReq = await fetch(`${process.env.deltaCore}/api/v1/test_runs`, {
    method: "GET",
  })
  const runs = await runsReq.json()

  const suitesReq = await fetch(`${process.env.deltaCore}/api/v1/test_suites`, {
    method: "GET",
  })
  const suites = await suitesReq.json()

  const testsHistoryReq = await fetch(
    `${process.env.deltaCore}/api/v1/tests_history/test_run/2`,
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
  }
}

export default Index
