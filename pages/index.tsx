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

        <SpacingPaper noPadding>
          <Typography variant="h5">Projects</Typography>
          {props.test_projects.map(project => (
            <Typography variant="h6">
              {project.id}
              <br/>
              {project.name}
              <br/>
              {project.project_status}
              <br/>
              {project.data.url}
            </Typography>
          ))}
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Launches</Typography>
          {props.test_launches.map(testLaunch => (
            <Typography variant="h6">
              {testLaunch.id}
              <br/>
              {testLaunch.name}
              <br/>
              {testLaunch.launch_status}
              <br/>
              {testLaunch.project}
              <br/>
              {testLaunch.data.url}
            </Typography>
          ))}
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Runs</Typography>
          {props.test_runs.map(testRun => (
            <Typography variant="h6">
              {testRun.id}
              <br/>
              {testRun.launch}
              <br/>
              {testRun.start_datetime}
              <br/>
              {testRun.end_datetime}
              <br/>
              {testRun.test_run_status}
              <br/>
              {testRun.test_type}
              <br/>
              {testRun.data.url}
            </Typography>
          ))}
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Suites</Typography>
          {props.test_suites.map(testSuite => (
            <Typography variant="h6">
              {testSuite.id}
              <br/>
              {testSuite.name}
              <br/>
              {testSuite.start_datetime}
              <br/>
              {testSuite.end_datetime}
              <br/>
              {testSuite.test_suite_status}
              <br/>
              {testSuite.test_type}
              <br/>
              {testSuite.data.url}
              <br/>
              {testSuite.test_run.id}
              <br/>
              {testSuite.test_run.launch}
              <br/>
              {testSuite.test_run.test_run_status}
              <br/>
              {testSuite.test_run.test_type}
              <br/>
            </Typography>
          ))}
        </SpacingPaper>
        
        <SpacingPaper noPadding>
          <Typography variant="h5">Tests</Typography>
          {props.tests.map(test => (
            <Typography variant="h6">
              {test.id}
              <br/>
              {test.name}
              <br/>
              {test.start_datetime}
              <br/>
              {test.end_datetime}
              <br/>
              {test.test_resolution}
              <br/>
              {test.test_status}
              <br/>
              {test.test_suite}
              <br/>
              {test.data.url}
            </Typography>
          ))}
        </SpacingPaper>
      </HeaderArticleContainer>
    </Layout>
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
  })
  const projects = await projectReq.json()

  const launchesReq = await fetch(
    "http://delta_core_service:5000/get_launches",
    {
    method: "POST",
  })
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
    tests: tests
  }
}

export default Index
