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
import { TestSuite } from "."

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
  test_suites: TestSuite[]
}

function Testsuites(props: Props) {
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
                Test suites for{" "}
                <Link underline="always" href="/testruns">
                  {props.test_suites[0].test_type}
                </Link>{" "}
                test run
              </Typography>{" "}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>

                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.test_suites.map(testSuite => (
                    <TableRow key={testSuite.id} hover>
                      <TableCell>{testSuite.name}</TableCell>
                      <TableCell>12 min</TableCell>
                      <TableCell>{testSuite.test_suite_status}</TableCell>
                      <TableCell>
                        {" "}
                        <Link underline="none" href="/tests">
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
Testsuites.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx

  const suitesReq = await fetch(
    "http://delta_core_service:5000/get_test_suites",
    {
      method: "GET",
    }
  )
  const suites = await suitesReq.json()

  const pagePayload: IPagePayload = {
    selectedPage: Page.TEST_SUITES,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    test_suites: suites,
  }
}
export default Testsuites
