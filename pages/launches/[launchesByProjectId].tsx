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
  Tooltip,
  Snackbar,
  IconButton,
} from "@material-ui/core"
import Pagination from "../../components/templates/Pagination"
import StopIcon from "@material-ui/icons/Stop"
import CloseIcon from "@material-ui/icons/Close"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Router from 'next/router'
import ReactEcharts from "echarts-for-react"

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

  let pyramidData = []

  let roseData = []

  const deltaViewStyle = {height: "190px", width: "800px"}

  let onChartClick = (param, echarts) => {
    if(param.seriesType === "funnel"){
      Router.push('/tests/' + param.data.test_run_id)
    } else if (param.seriesType === "pie") {
      Router.push('/testruns/' + param.data.launch_id)
    }
 }

  let onChartEvents = {
    'click': onChartClick
  }

  const option = (pyramid, rose) => ({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}",
    },
    toolbox: {
      show: false
    },
    series: [
      {
        name: "Total tests",
        type: "funnel",
        top: "10%",
        width: "40%",
        height: "85%",
        minSize: "0%",
        maxSize: "80%",
        sort: "ascending",
        gap: 1,
        label: {
          show: true,
          position: "inside",
        },
        labelLine: {
          length: 2,
          lineStyle: {
            width: 1,
            type: "solid",
          },
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
        },
        data: pyramid,
      },
      {
        name: 'Tests by status',
        type: 'pie',
        radius: [10, 80],
        center: ['80%', '50%'],
        roseType: 'area',
        data: rose
    }
    ],
  })

  const [launchesList, setLaunchesList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [launchesPerPage] = useState(20)
  const indexOfLastItem = currentPage * launchesPerPage
  const indexOfFirstItem = indexOfLastItem - launchesPerPage
  // pagination (first 20)
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

  const [openPopUp, setOpenPopUp] = React.useState(false)

  const handleStopButtonClick = async (launchId: string | number) => {
    // PUT request using fetch with async/await
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        launch_id: launchId,
      }),
    }
    console.log(requestOptions)

    const response = await fetch(
      `${process.env.publicDeltaCore}/api/v1/finish_launch`,
      requestOptions
    )
    await response.json()
    setOpenPopUp(true)
  }

  const handlePopUpClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return
    }

    setOpenPopUp(false)
  }

  const [isHovered, setIsHovered] = React.useState(false)

  const hoverOn = () => {
    setIsHovered(true)
  }

  const hoverOff = () => {
    setIsHovered(false)
  }

  function showStatusAndEnableToStopRunningLaunch(status, launchId) {
    let statusIcon = <div></div>
    if (status === "Running" || status === "In Process") {
      statusIcon = (
        <Tooltip title="Stop this launch">
          <div>
            <IconButton
              size="small"
              style={{
                blockSize: "1px",
                paddingLeft: "0px",
                paddingRight: "0px",
              }}
              onClick={() => handleStopButtonClick(launchId)}
              onMouseEnter={hoverOn}
              onMouseLeave={hoverOff}
            >
              {isHovered ? (
                <StopIcon
                  style={{
                    color: "grey",
                  }}
                />
              ) : (
                showStatusIcon(status)
              )}
            </IconButton>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              open={openPopUp}
              autoHideDuration={4000}
              message="Launch is marked as finished. Changes will be visible after page reload"
              onClose={handlePopUpClose}
              action={
                <React.Fragment>
                  <IconButton
                    size="small"
                    color="inherit"
                    onClick={handlePopUpClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </React.Fragment>
              }
            />
          </div>
        </Tooltip>
      )
    } else statusIcon = showStatusIcon(status)
    return statusIcon
  }

  function insertChartData(key, value, name, item_id) {
    if (key == 'pyramid'){
      pyramidData.push({value: value, name: name, test_run_id: item_id})
    } else if (key == 'rose'){
      let testTypeIndex = roseData.findIndex(arr => arr.name === name)
      if (testTypeIndex >= 0) {
        let newValue = roseData[testTypeIndex].value + value;
        roseData[testTypeIndex] = {value: newValue, name: name, launch_id: item_id}
      } else {
        roseData.push({value: value, name: name, launch_id: item_id})
      }
    }
    return ""
  }

  function clearChartData() {
    pyramidData = []
    roseData = []
    return ""
  }

  function testRunButtons(test_run_stats: any) {
    return test_run_stats.map(testRun => (
      <Button
        key={testRun.test_run_id}
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
    ))
  }

  function testRunDelta(test_run_stats: any, launch_id: number) {
    test_run_stats.map(
      tr_data => (
        insertChartData("pyramid", tr_data.tests_total, tr_data.test_type, tr_data.test_run_id),
        insertChartData("rose", tr_data.tests_failed, "Failed", launch_id),
        insertChartData("rose", tr_data.tests_passed, "Passed", launch_id),
        insertChartData("rose", tr_data.tests_running, "Running", launch_id),
        insertChartData("rose", tr_data.tests_incomplete, "Incomplete", launch_id),
        insertChartData("rose", tr_data.tests_skipped, "Skipped", launch_id)
      )
    )
    return <ReactEcharts option={option(pyramidData, roseData)} style={deltaViewStyle} onEvents={onChartEvents}/>

  }

  const [switchState, setSwitchState] = React.useState({
    deltaView: false
  });

  const handleSwitchChange = (event) => {
    setSwitchState({ ...switchState, [event.target.name]: event.target.checked });
  };

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
                      checked={switchState.deltaView}
                      onChange={handleSwitchChange}
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
                            {!switchState.deltaView? (
                              testRunButtons(launch.test_run_stats)
                            ) : (
                              testRunDelta(launch.test_run_stats, launch.launch_id)
                            )}
                          </TableCell>
                              {clearChartData()}
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
