import {
  Container,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Typography,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { BasePage } from "../components/templates/BasePage"
import { TestRun } from "."

const useStyles = makeStyles(theme => ({
  root: {},
  counter: {
    margin: 10,
  },
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
                <Link underline="always" href="/launches">
                  {props.test_runs[0].launch}
                </Link>{" "}
                launch
              </Typography>{" "}
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
                        <Link underline="none" href="/testsuites">
                          View{" "}
                        </Link>
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

/**
 * Server side rendering
 */
Testruns.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx

  const runsReq = await fetch("http://delta_core_service:5000/get_test_runs", {
    method: "GET",
  })
  const runs = await runsReq.json()

  const pagePayload: IPagePayload = {
    selectedPage: Page.TEST_RUNS,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    test_runs: runs,
  }
}
export default Testruns
