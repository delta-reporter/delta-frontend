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

  const perfectDist = [
    { value: 20, name: "Apps Tests" },
    { value: 40, name: "Visual Regression Tests" },
    { value: 60, name: "End2End Tests" },
    { value: 80, name: "Integration Tests" },
    { value: 100, name: "Unit Tests" },
  ]

  const pyramidStyle = {height: "250px", width: "280px"}

  const option = data => ({
    title: {
      text: "Release Zero",
      subtext: "DoneDeal Search",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} Tests executed",
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          title: "Save as image"
        }
      }
    },

    series: [
      {
        name: "Test Run",
        type: "funnel",
        left: "10%",
        // top: 40,
        // x2: 80,
        // bottom: 50,
        width: "80%",
        // height: {totalHeight} - y - y2,
        min: 0,
        max: 100,
        minSize: "0%",
        maxSize: "80%",
        sort: "ascending",
        gap: 2,
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
        data: data,
      },
    ],
  })

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
                            {launch.test_run_stats.map(testRun => (
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
                            ))}
                            <ReactEcharts option={option(perfectDist)} style={pyramidStyle} />
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
