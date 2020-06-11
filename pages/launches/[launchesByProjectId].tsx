import React, { useState, useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { BasePage, showStatusIcon } from "../../components/templates"
import { TestLaunch } from "../index"
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
  Button,
} from "@material-ui/core"
import Pagination from "../../components/templates/Pagination"

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
  launches: TestLaunch[]
}

function Launches(props: Props) {
  const classes = useStyles(props)

  const [launchesList, setLaunchesList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [launchesPerPage] = useState(20)
  const indexOfLastItem = currentPage * launchesPerPage
  const indexOfFirstItem = indexOfLastItem - launchesPerPage
  const currentLaunches = props.launches.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  useEffect(() => {
    const fetchLaunches = async () => {
      setLaunchesList(props.launches)
    }
    fetchLaunches()
  }, [])
  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber)

  return (
    <BasePage className={classes.root}>
      <title>Δ | Launches</title>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href={`/`}>
          Projects
        </Link>
        <Typography color="textPrimary">Launches</Typography>
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
                Launches for{" "}
                <Link underline="always"> {props.launches[0].project}</Link>{" "}
                project
              </Typography>
              {props.launches[0] ? ( // checking if props exist
                <div>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentLaunches.map(launch => (
                        <TableRow key={launch.launch_id} hover>
                          <TableCell>
                            {" "}
                            {showStatusIcon(launch.launch_status)}
                          </TableCell>
                          <TableCell>{launch.name}</TableCell>
                          <TableCell>
                            {launch.test_run_stats.map(testRun => (
                              <Button
                                variant="contained"
                                href={`/tests/${testRun.test_run_id}`}
                                style={{
                                  fontSize: "12px",
                                  paddingLeft: "8px",
                                  paddingRight: "3px",
                                  paddingBottom: "0px",
                                  paddingTop: "0px",
                                  marginLeft: "5px",
                                }}
                              >
                                {testRun.test_type}{" "}
                                {testRun.tests_total ===
                                testRun.tests_passed + testRun.tests_skipped ? (
                                  <div> {showStatusIcon("Successful")} </div>
                                ) : (
                                  <div>{showStatusIcon("Failed")} </div>
                                )}{" "}
                              </Button>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>{" "}
                  </Table>
                  <Pagination
                    itemsPerPage={launchesPerPage}
                    totalNumber={launchesList.length}
                    paginate={paginate}
                  />
                </div>
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

// It runs  on the server-side, making a request before page is loaded.
// The data required to render the page is available at build time ahead of a user’s request
// https://nextjs.org/docs/api-reference/data-fetching/getInitialProps

Launches.getInitialProps = async (context): Promise<Props> => {
  const { launchesByProjectId } = context.query
  const launchesByProjectIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/launch/project/${launchesByProjectId}`,
    {
      method: "GET",
    }
  )
  const launches = await launchesByProjectIdReq.json()

  return {
    launches: launches,
  }
}

export default Launches
