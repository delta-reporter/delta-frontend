import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { TestRun } from "../index"
import { BasePage } from "../../components/templates/BasePage"
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
import UseAnimations from "react-useanimations"
import TripOriginIcon from "@material-ui/icons/TripOrigin"

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

function setStatusColor(status) {
  let statusIcon
  if (/.*(\w*ass\w*)\b/.test(status)) {
    statusIcon = (
      <TripOriginIcon
        style={{
          color: "green",
        }}
      ></TripOriginIcon>
    )
  } else if (/.*(\w*ail\w*)\b/.test(status)) {
    statusIcon = (
      <TripOriginIcon
        style={{
          color: "red",
        }}
      ></TripOriginIcon>
    )
  } else if (/.*(\w*kip\w*)\b/.test(status)) {
    statusIcon = (
      <TripOriginIcon
        style={{
          color: "grey",
        }}
      ></TripOriginIcon>
    )
  } else if (/.*(\w*ess\w*)\b/.test(status)) {
    statusIcon = (
      <UseAnimations
        animationKey="loading"
        style={{
          color: "orange",
        }}
      />
    )
  } else {
    statusIcon = (
      <Typography
        style={{
          color: "grey",
        }}
      >
        {status}
      </Typography>
    )
  }
  return statusIcon
}

function setTestTypeBadge(testType) {
  let badge
  if (/.*(\w*nit\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/unit.png" width="40" height="30" />
  } else if (/.*(\w*ntegration\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/api.png" width="40" height="30" />
  } else if (/.*(\w*end\w*)\b/.test(testType)) {
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
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Delta Reporter
        </Link>
        <Link color="inherit" href={`/`}>
          Projects
        </Link>
        <Link color="inherit" href={`/launches/1`}>
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
                Test runs for {props.test_runs[0].launch_name} launch
              </Typography>
              {props.test_runs[0] ? ( // checking if props exist
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Duration</TableCell>
                      <TableCell>Test Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.test_runs.map(testRun => (
                      <TableRow key={testRun.id} hover>
                        {testRun.duration.minutes === 0 ? (
                          <TableCell>{testRun.duration.seconds} sec</TableCell>
                        ) : (
                          <TableCell>
                            {testRun.duration.minutes} min{" "}
                            {testRun.duration.seconds} sec
                          </TableCell>
                        )}
                        <TableCell>
                          {setTestTypeBadge(testRun.test_type)}
                        </TableCell>
                        <TableCell>
                          {setStatusColor(testRun.test_run_status)}
                        </TableCell>
                        <TableCell>
                          {" "}
                          <Link underline="none" href={`/tests/${testRun.id}`}>
                            {" "}
                            View{" "}
                          </Link>{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                // if props don't exist
                <h1>No runs were found for this launch! </h1>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
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
