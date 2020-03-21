import fetch from "../../node_modules/isomorphic-unfetch"
import { makeStyles } from "../../node_modules/@material-ui/core/styles"
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
} from "@material-ui/core"

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    fontSize: "2em",
  },
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
  seeMore: {
    marginTop: theme.spacing(3),
  },
}))

type Props = {
  test_runs: TestRun[]
}

function Testruns(props: Props) {
  const classes = useStyles(props)
  return (
    <BasePage className={classes.root}>
      <h1>Runs retrieved by launch id!!!! </h1>
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
                Test runs for (TODO) launch
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Test Type</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.test_runs.map(testRun => (
                    <TableRow key={testRun.id} hover>
                      <TableCell>{testRun.start_datetime}</TableCell>
                      <TableCell>{testRun.test_type}</TableCell>
                      <TableCell>34 min</TableCell>
                      <TableCell>{testRun.test_run_status}</TableCell>
                      <TableCell>
                        {" "}
                        <Link
                          underline="none"
                          href={`/testsuites/${testRun.id}`}
                        >
                          {" "}
                          View{" "}
                        </Link>{" "}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BasePage>
  )
}

Testruns.getInitialProps = async (context): Promise<Props> => {
  const { id } = context.query
  const runsByLaunchIdReq = await fetch(
    `http://delta_core_service:5000/api/v1/test_run/launch/${id}`,
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
