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
        <Link color="inherit" href={`/projects`}>
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
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.test_runs.map(testRun => (
                      <TableRow key={testRun.id} hover>
                        <TableCell>{testRun.duration.minutes}</TableCell>
                        <TableCell>{testRun.test_type}</TableCell>
                        <TableCell>34 min</TableCell>
                        <TableCell>{testRun.test_run_status}</TableCell>
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
    `${process.env.deltaCore}/test_run/launch/${runsByLaunchId}`,
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
