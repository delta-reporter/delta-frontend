import { Container, FormControlLabel, Grid, Link, makeStyles, Paper, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography, useTheme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { clearChartDataOnDeltaView, testRunButtonsDefaultView, testRunButtonsDeltaPyramidView } from './DeltaViewForLaunches';
// import { showStatusAndEnableToStopRunningLaunch } from './showAndChangeLaunchStatus'
import getTestLaunches from '../../../data/TestLaunches';
// import Pagination from '../Pagination';
import { TestProject } from '../../../pages';


const useStyles = makeStyles(theme => ({
  rootLight: {
    flexGrow: 1,
    color: theme.palette.secondary.light,
  },
  rootDark: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paperLight: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  paperDark: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.main,
    border: "1px grey solid",
  },
  toggleModeDark: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
    border: "1px grey solid",
    marginBottom: "15px",
  },
  toggleModeLight: {
    border: "1px grey solid",
    marginBottom: "15px",
  },
  textColorDarkMode: {
    color: theme.palette.secondary.light,
  },
  textColorLightMode: {},
}))

interface LaunchesProps {
  project: TestProject
  darkMode: boolean
}

export default function LaunchesList(props: LaunchesProps) {

  const classes = useStyles(props)
  const { project, darkMode} = props;
  // const theme = useTheme();
  const { loading, noData, launches } = getTestLaunches(project.project_id)
  // const [launchesList, setLaunchesList] = useState([])

  // useEffect(() => {
  //   const fetchLaunches = async () => {
  //     setLaunchesList(launches)
  //   }
  //   fetchLaunches()
  // }, [])

  // const [currentPage, setCurrentPage] = useState(1)
  // const [launchesPerPage] = useState(20)
  // const indexOfLastItem = currentPage * launchesPerPage
  // const indexOfFirstItem = indexOfLastItem - launchesPerPage
  // pagination (first 20)
  // const currentLaunches = launches.slice(indexOfFirstItem, indexOfLastItem)

  // const [highlightedTest, setHighlightedTest] = useState(0)

  // function paginate(pageNumber) {
  //   setCurrentPage(pageNumber)
  //   setHighlightedTest(pageNumber)
  // }

  // delta view switch
  const [switchViews, setSwitchViews] = useState({
    deltaView: getInitialDeltaViewState(),
  })

  const handleSwitchViewsChange = event => {
    setSwitchViews({
      ...switchViews,
      [event.target.name]: event.target.checked,
    })
  }

  useEffect(() => {
    localStorage.setItem("deltaView", JSON.stringify(switchViews.deltaView)) //setting a variable in the browser storage
  }, [switchViews.deltaView])

  function getInitialDeltaViewState(): boolean {
    if (typeof window !== "undefined") {
      const savedDeltaView = JSON.parse(localStorage.getItem("deltaView")) //checking the 'dark' var from browser storage
      return savedDeltaView || false
    } else {
      return false
    }
  }

    // // dark mode switch
    // const [state, setState] = useState({
    //   darkMode: getInitialDarkModeState(),
    // });

    // const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   setState({ ...state, [event.target.name]: event.target.checked });
    // };

    // useEffect(() => {
    //   localStorage.setItem("darkMode", JSON.stringify(state.darkMode)) //setting a variable in the browser storage
    // }, [state.darkMode])

    // function getInitialDarkModeState(): boolean {
    //   if (typeof window !== "undefined") {
    //     const savedColorMode = JSON.parse(localStorage.getItem("darkMode")) //checking the 'dark' var from browser storage
    //     return savedColorMode || false
    //   } else {
    //     return false
    //   }
    // }

    if (noData) {
      return (
        <div>
          <Typography
            style={{
              fontStyle: "italic",
              margin: "20px",
              color: "grey",
            }}
          >
          No failed tests were found...
          </Typography>
        </div>
      )
    } else {
      return (
        <>
          <div>
          {" "}
          {loading
            ? "Loading tests failing the most..."
            :
            <div>
  <Container maxWidth="lg" className={classes.container}>
  <Grid container spacing={4} >
    <Grid item xs={12} >
      <Paper className={darkMode ? classes.paperDark : classes.paperLight} elevation={3}>
        <Grid container>
          <Grid item xs={10}>
            <Typography
              variant="h6"
              style={{ fontWeight: 400, margin: "5px" }}
              className={
                darkMode
                  ? classes.textColorDarkMode
                  : classes.textColorLightMode
              }
            >
              Launches for{" "}
              <Link style={{ color: "#605959" }} underline="none">
                {" "}
                {project.name}
              </Link>{" "}
              project
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ color: "grey" }}>
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
        {launches[0] ? ( // checking if props exist
          <div style={{ paddingTop: "15px" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {currentLaunches.map(launch => ( */}
                {launches.map(launch => (
                  <TableRow key={launch.launch_id} hover>
                    {/* <TableCell>
                      {showStatusAndEnableToStopRunningLaunch(
                        launch.launch_status,
                        launch.launch_id
                      )}
                    </TableCell> */}
                    <TableCell
                      style={{ width: "500px" }}
                      className={
                        darkMode
                          ? classes.textColorDarkMode
                          : classes.textColorLightMode
                      }
                    >
                      {launch.name}
                    </TableCell>
                    <TableCell>
                      {/* Switch option for Delta View (pyramid style) */}
                      {!switchViews.deltaView
                        ? testRunButtonsDefaultView(
                            launch.test_run_stats,
                            darkMode
                          )
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

            {/* <Pagination
              itemsPerPage={launchesPerPage}
              totalNumber={launchesList.length}
              paginate={paginate}
              highlightedTest={highlightedTest}
            /> */}
          </div>
        ) : (
          // if props don't exist
          <h1>No runs were found for this launch! </h1>
        )}
      </Paper>
    </Grid>
  </Grid>
</Container>
</div>
        }
        {" "}
        </div>
      </>
    )
      }
    }
