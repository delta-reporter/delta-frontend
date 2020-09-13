import React, { useState, useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { useRouter } from 'next/router'
import {
  BasePage,
  showStatusAndEnableToStopRunningLaunch,
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
  FormGroup,
} from "@material-ui/core"
import Pagination from "../../components/templates/Pagination"
import Switch from "@material-ui/core/Switch"
import useSocket from '../../hooks/useSocket'
import {
  testRunButtonsDefaultView,
  testRunButtonsDeltaPyramidView,
  clearChartDataOnDeltaView,
} from "../../components/templates/DeltaViewForLaunches"
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';

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
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  paperDark: {
    padding: theme.spacing(2),
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

type Props = {
  launches: TestLaunch[]
}

export interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  message: string;
}

function Launches(props: Props) {
  const classes = useStyles(props)
  const [launchesList, setLaunchesList] = useState([])
  const router = useRouter()

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

  // const [notification, setNotification] = useState(0)

  useSocket('delta_launch', testLaunch => {
    // setNotification(1);
    if (props.launches[0].project_id == testLaunch.project_id) {
      let msg = "🚀 There is a new launch:  " + testLaunch.name
      setNotificationState({ ...notificationState, open: true, message: msg });
    }
  })
  
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
        <Breadcrumbs style={{ paddingLeft: "30px", marginTop: "20px"}}  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
          <Link color="inherit" href={`/`}>
            Projects
          </Link>
          <Typography color="textPrimary" className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>Launches</Typography>
        </Breadcrumbs>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleCloseNotification}
          message={message}
          autoHideDuration={3000}
          action={
            <React.Fragment>
              <Tooltip title="Reload page">
              <Button color="secondary" size="small" onClick={handleReloadPage}>
              <ReplayIcon fontSize="small" />
              </Button>
              </Tooltip>
            </React.Fragment>
          }
          key={vertical + horizontal}
        />
        {/* Attempt to use notification as a component */}
        {/* {notification? EventNotification("There are new launches 🚀") : EventNotification("Connecting for events...") }  */}
        <Container maxWidth="lg" className={classes.container}>
            <FormGroup row>
              <FormControlLabel
                control={<Switch checked={state.darkMode} onChange={handleDarkModeChange} name="darkMode" />}
                label="Dark Mode"
              />
            </FormGroup>          <Grid container spacing={3} >
            <Grid item xs={12} >
              <Paper className={state.darkMode ? classes.paperDark : classes.paperLight}>
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
                        {props.launches[0].project}
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
                {props.launches[0] ? ( // checking if props exist
                  <div>
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
