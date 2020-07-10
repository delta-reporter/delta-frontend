import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { TestRun } from "../index"
import { BasePage, showStatusIcon } from "../../components/templates"
import {
  Container,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Link,
  Breadcrumbs,
} from "@material-ui/core"

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
}))

function setTestTypeBadge(testType) {
  let badge
  if (/.*(\w*nit\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/unit.png" width="40" height="30" />
  } else if (/.*(\w*ntegration\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/api.png" width="40" height="30" />
  } else if (/.*(\w*nd\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/ui.png" width="40" height="30" />
  } else {
    badge = (
      <Typography
        style={{
          color: "grey",
        }}
      >
        {testType}
      </Typography>
    )
  }
  return badge
}

type Props = {
  test_runs: TestRun[]
}

function Testruns(props: Props) {
  const classes = useStyles(props)
  return (
    <BasePage className={classes.root}>
      <title>Δ | Test Runs</title>
      {props.test_runs[0] ? ( // checking if props exist
        <div>
          <Breadcrumbs style={{ paddingLeft: "30px" }}>
            <Link color="inherit" href={`/`}>
              Projects
            </Link>
            <Link
              color="inherit"
              href={`/launches/${props.test_runs[0].project_id}`}
            >
              Launches
            </Link>
            <Typography color="textPrimary">Test Runs</Typography>
          </Breadcrumbs>
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Typography
                    component="h2"
                    variant="h6"
                    color="primary"
                    gutterBottom
                  >
                    Test runs for{" "}
                    <Link underline="always">
                      {" "}
                      {props.test_runs[0].launch_name}
                    </Link>
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.test_runs.map(testRun => (
                        <TableRow key={testRun.test_run_id} hover>
                          <TableCell>
                            {showStatusIcon(testRun.test_run_status)}
                          </TableCell>
                          <TableCell>
                            {setTestTypeBadge(testRun.test_type)}
                          </TableCell>
                          {testRun.duration.minutes === 0 ? (
                            <TableCell>
                              {testRun.duration.seconds} sec
                            </TableCell>
                          ) : (
                            <TableCell>
                              {testRun.duration.minutes} min{" "}
                              {testRun.duration.seconds} sec
                            </TableCell>
                          )}
                          <TableCell>
                            <Link
                              underline="none"
                              href={`/tests/${testRun.test_run_id}`}
                            >
                              View All tests
                            </Link>
                          </TableCell>
                          {testRun.test_run_status === "Passed" ? (
                            <TableCell></TableCell>
                          ) : (
                            <TableCell>
                              <Link
                                underline="none"
                                href={`/failedTests/${testRun.test_run_id}`}
                              >
                                View Failed tests
                              </Link>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </div>
      ) : (
        // if props don't exist
        <h1>No runs were found for this launch! </h1>
      )}
    </BasePage>
  )
}

Testruns.getInitialProps = async (context): Promise<Props> => {
  const { runsByLaunchId } = context.query
  const runsByLaunchIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/test_run/launch/${runsByLaunchId}`,
    {
      method: "GET",
    }
  )
  const runs = await runsByLaunchIdReq.json()

  return {
    test_runs: runs,
  }
}

export default Testruns
