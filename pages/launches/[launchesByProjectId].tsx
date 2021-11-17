import React, { useState, useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import {
  BasePage,
  showStatusAndEnableToStopRunningLaunch,
  InfoDashboard,
  // EventNotification
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
  NoSsr,
  Tooltip,
  Button,
} from "@material-ui/core"
import Pagination from "../../components/templates/Pagination"
import Switch from "@material-ui/core/Switch"
import {
  testRunButtonsDefaultView,
  testRunButtonsDeltaPyramidView,
  clearChartDataOnDeltaView,
} from "../../components/templates/DeltaViewForLaunches"
import ReplayIcon from '@material-ui/icons/Replay'
import WbSunnyIcon from '@material-ui/icons/WbSunny'
import Brightness2Icon from '@material-ui/icons/Brightness2'

const useStyles = makeStyles(theme => ({
  rootLight: {
    flexGrow: 1,
    color: theme.palette.secondary.light,
  },
  rootDark:{
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
  textColorLightMode: {
  },
}))

export interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  message: string;
}

function Launches({launches}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles(launches)
  const [launchesList, setLaunchesList] = useState([])
  const router = useRouter()

  useEffect(() => {
    const fetchLaunches = async () => {
      setLaunchesList(launches)
    }
    fetchLaunches()
  }, [])

  const [currentPage, setCurrentPage] = useState(1)
  const [launchesPerPage] = useState(20)
  const indexOfLastItem = currentPage * launchesPerPage
  const indexOfFirstItem = indexOfLastItem - launchesPerPage
  // pagination (first 20)
  const currentLaunches = launches.slice(
    indexOfFirstItem,
    indexOfLastItem
  )

  const [highlightedTest, setHighlightedTest] = useState(0)

  function paginate(pageNumber) {
    setCurrentPage(pageNumber)
    setHighlightedTest(pageNumber)
  }

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
    localStorage.setItem('deltaView', JSON.stringify(switchViews.deltaView)) //setting a variable in the browser storage
  }, [switchViews.deltaView])

  function getInitialDeltaViewState() :boolean {
    if (typeof window !== 'undefined') {
     const savedDeltaView = JSON.parse(localStorage.getItem('deltaView')) //checking the 'dark' var from browser storage
     return savedDeltaView || false
    }
    else {
      return false
    }
  }

  // dark mode switch
  const [state, setState] = useState({
    darkMode: getInitialDarkModeState(),
  });

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(state.darkMode)) //setting a variable in the browser storage
  }, [state.darkMode])

  function getInitialDarkModeState() :boolean {
    if (typeof window !== 'undefined') {
     const savedColorMode = JSON.parse(localStorage.getItem('darkMode')) //checking the 'dark' var from browser storage
     return savedColorMode || false
    }
    else {
      return false
    }
  }

  const [notificationState, setNotificationState] = React.useState<SnackbarState>({
    open: false,
    vertical: 'top',
    horizontal: 'right',
    message: '',
  });
  const { vertical, horizontal, open, message } = notificationState;

  const handleReloadPage = () => {
    setNotificationState({ ...notificationState, open: false });
    router.reload();
  };

  const handleCloseNotification = () => {
      setNotificationState({ ...notificationState, open: false });
    };

  return (
    <NoSsr>
      <BasePage className={state.darkMode ? classes.rootDark : classes.rootLight} darkMode={state.darkMode}>
      <title>Δ | Launches</title>
      <div>
        <div style={{ float: "left"}}>
        <Breadcrumbs style={{ paddingLeft: "30px", marginTop: "20px"}}  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
          <Link color="inherit" href={`/`}>
            Projects
          </Link>
          <Typography color="textPrimary" className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}> {launches[0].project} Launches</Typography>
        </Breadcrumbs>
        </div>

        <div style={{ float: "right", width: "15%", marginTop: "15px"}}>
        <Grid component="label" container alignItems="center" spacing={1}>
          <Grid item><WbSunnyIcon></WbSunnyIcon></Grid>
          <Grid item>
            <Switch checked={state.darkMode} onChange={handleDarkModeChange} name="darkMode" color="primary"/>
          </Grid>
          <Grid item><Brightness2Icon></Brightness2Icon></Grid>
        </Grid>
        </div>
      </div>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleCloseNotification}
          message={message}
          autoHideDuration={5000}
          action={
            <React.Fragment>
              <Tooltip title="Reload page">
              <Button color="secondary" size="small" onClick={handleReloadPage}>
              <ReplayIcon fontSize="small" color="primary"/>
              </Button>
              </Tooltip>
            </React.Fragment>
          }
          key={vertical + horizontal}
        />
        {/* Attempt to use notification as a component */}
        {/* {notification? EventNotification("There are new launches 🚀") : EventNotification("Connecting for events...") }  */}
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={4} >
            <Grid item xs={12} >
              <Paper className={state.darkMode ? classes.paperDark : classes.paperLight} elevation={3}>
                  <InfoDashboard project={launches[0].project_id} darkMode={state.darkMode}/>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={4} >
            <Grid item xs={12} >
              <Paper className={state.darkMode ? classes.paperDark : classes.paperLight} elevation={3}>
                <Grid container>
                  <Grid item xs={10}>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 400, margin: "5px" }}
                      className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}
                    >
                      Launches for{" "}
                      <Link
                        style={{ color: "#605959" }}
                        underline="none"
                      >
                        {" "}
                        {launches[0].project}
                      </Link>{" "}
                      project
                    </Typography>
                  </Grid>
                  <Grid item xs={2} style={{color:"grey"}}>
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
                  <div style={{paddingTop:"15px"}}>
                    <Table size="small" >
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody >
                        {currentLaunches.map(launch => (
                          <TableRow key={launch.launch_id} hover>
                            <TableCell>
                              {showStatusAndEnableToStopRunningLaunch(
                                launch.launch_status,
                                launch.launch_id
                              )}
                            </TableCell>
                            <TableCell style={{width: "500px"}} className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>{launch.name}</TableCell>
                            <TableCell>
                              {/* Switch option for Delta View (pyramid style) */}
                              {!switchViews.deltaView
                                ? testRunButtonsDefaultView(launch.test_run_stats, state.darkMode)
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
    </NoSsr>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { launchesByProjectId } = context.query
  const launchesByProjectIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/launch/project/${launchesByProjectId}`,
    {
      method: "GET",
    }
  )
  const launches: TestLaunch[] = await launchesByProjectIdReq.json()

  return {
    props: { launches },
  }
}

export default Launches
