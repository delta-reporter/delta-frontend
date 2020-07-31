import React, { useState, useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import {
  BasePage,
  showStatusAndEnableToStopRunningLaunch,
} from "../../components/templates"
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
  FormControlLabel,
} from "@material-ui/core"
import Pagination from "../../components/templates/Pagination"
import Switch from "@material-ui/core/Switch"
import {
  testRunButtonsDefaultView,
  testRunButtonsDeltaPyramidView,
  clearChartDataOnDeltaView,
} from "../../components/templates/DeltaViewForLaunches"

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
  backgroundGrey: {
    backgroundColor: "#d6d6d6",
  },
  backgroundWhite: {
    backgroundColor: "white",
  },
}))

type Props = {
  launches: TestLaunch[]
}

function Launches(props: Props) {
  const classes = useStyles(props)
  const [launchesList, setLaunchesList] = useState([])

  useEffect(() => {
    const fetchLaunches = async () => {
      setLaunchesList(props.launches)
    }
    fetchLaunches()
  }, [])

  const [currentPage, setCurrentPage] = useState(1)
  const [launchesPerPage] = useState(20)
  const indexOfLastItem = currentPage * launchesPerPage
  const indexOfFirstItem = indexOfLastItem - launchesPerPage
  // pagination (first 20)
  const currentLaunches = props.launches.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const [highlightedTest, setHighlightedTest] = useState(0)

  function paginate(pageNumber) {
    setCurrentPage(pageNumber)
    setHighlightedTest(pageNumber)
  }

  const [switchViews, setSwitchViews] = React.useState({
    deltaView: false,
  })

  const handleSwitchViewsChange = event => {
    setSwitchViews({
      ...switchViews,
      [event.target.name]: event.target.checked,
    })
  }

  return (
    <BasePage className={classes.root}>
      <title>Δ | Launches</title>
      <Breadcrumbs style={{ paddingLeft: "30px" }}>
        <Link color="inherit" href={`/`}>
          Projects
        </Link>
        <Typography color="textPrimary">Launches</Typography>
      </Breadcrumbs>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Grid container>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    color="secondary"
                    style={{ fontWeight: 400, margin: "5px" }}
                  >
                    Launches for{" "}
                    <Link
                      style={{ color: "#605959" }}
                      underline="none"
                      color="secondary"
                    >
                      {" "}
                      {props.launches[0].project}
                    </Link>{" "}
                    project
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={switchViews.deltaView}
                        onChange={handleSwitchViewsChange}
                        name="deltaView"
                        color="primary"
                      />
                    }
                    label="Δ View"
                  />
                </Grid>
              </Grid>
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
                            {showStatusAndEnableToStopRunningLaunch(
                              launch.launch_status,
                              launch.launch_id
                            )}
                          </TableCell>
                          <TableCell>{launch.name}</TableCell>
                          <TableCell>
                            {/* Switch option for Delta View (pyramid style) */}
                            {!switchViews.deltaView
                              ? testRunButtonsDefaultView(launch.test_run_stats)
                              : testRunButtonsDeltaPyramidView(
                                  launch.test_run_stats,
                                  launch.launch_id
                                )}
                          </TableCell>
                          {clearChartDataOnDeltaView()}
                        </TableRow>
                      ))}
                    </TableBody>{" "}
                  </Table>

                  <Pagination
                    itemsPerPage={launchesPerPage}
                    totalNumber={launchesList.length}
                    paginate={paginate}
                    highlightedTest={highlightedTest}
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
