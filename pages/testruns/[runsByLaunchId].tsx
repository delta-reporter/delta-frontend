import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { TestRun } from "../index"
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { BasePage, showStatusIcon } from "../../components/templates"
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
  NoSsr,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core"
import { useState, useEffect } from "react"
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness2Icon from '@material-ui/icons/Brightness2';

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
}))

function setTestTypeBadge(testType) {
  let badge
  if (/.*(\w*nit\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/unit.png" width="40" height="30" style={{marginTop:"3px"}}/>
  } else if (/.*(\w*ntegration\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/api.png" width="40" height="30" style={{marginTop:"3px"}}/>
  } else if (/.*(\w*nd\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/ui.png" width="40" height="30" style={{marginTop:"3px"}}/>
  } else {
    badge = (
      <Typography
        style={{
          color: "grey",
        }}
      >
        {testType}
      </Typography>
    )
  }
  return badge
}

function Testruns({runs}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles(runs)

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

  return (
    <NoSsr>
      <BasePage className={state.darkMode ? classes.rootDark : classes.rootLight} darkMode={state.darkMode}>
        <title>Δ | Test Runs</title>
        {runs[0] ? ( // checking if props exist
          <div>
            <div>
              <div style={{ float: "left"}}>
                <Breadcrumbs style={{ paddingLeft: "30px", marginTop: "20px"}}  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
                  <Link color="inherit" href={`/`}>
                    Projects
                  </Link>
                  <Link
                    color="inherit"
                    href={`/launches/${runs[0].project_id}`}
                  >
                    Launches
                  </Link>
                  <Typography color="textPrimary"  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>Test Runs</Typography>
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
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                <Paper className={state.darkMode ? classes.paperDark : classes.paperLight}>
                <Typography
                        variant="h6"
                        style={{ fontWeight: 400, margin: "5px" }}
                        className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}
                      >
                      Test runs for{" "}
                        <Link
                          style={{ color: "#605959" }}
                          underline="none"
                        >
                          {" "}
                          {runs[0].launch_name}
                        </Link>{" "}
                        launch
                      </Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          {/* <TableCell></TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {runs.map(testRun => (
                          <TableRow key={testRun.test_run_id} hover>
                            <TableCell>
                              {showStatusIcon(testRun.test_run_status)}
                            </TableCell>
                            <TableCell>
                              {setTestTypeBadge(testRun.test_type)}
                            </TableCell>
                            {testRun.duration.minutes === 0 ? (
                              <TableCell className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
                                {testRun.duration.seconds} sec
                              </TableCell>
                            ) : (
                              <TableCell  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
                                {testRun.duration.minutes} min{" "}
                                {testRun.duration.seconds} sec
                              </TableCell>
                            )}
                            <TableCell  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
                              <Link
                                underline="always"
                                href={`/tests/${testRun.test_run_id}`}
                                style={{color:"grey"}}
                              >
                                View All tests
                              </Link>
                            </TableCell>
                            {/* Commenting this section out as the page doesn't exits anymore */}
                            {/* {testRun.test_run_status === "Passed" ? (
                              <TableCell></TableCell>
                            ) : (
                              <TableCell  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
                                <Link
                                  underline="none"
                                  href={`/tests/failedTests/${testRun.test_run_id}`}
                                >
                                  View Failed tests
                                </Link>
                              </TableCell>
                            )} */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </div>
        ) : (
          // if props don't exist
          <h1>No runs were found for this launch! </h1>
        )}
      </BasePage>
    </NoSsr>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { runsByLaunchId } = context.query
  const runsByLaunchIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/test_run/launch/${runsByLaunchId}`,
    {
      method: "GET",
    }
  )
  const runs: TestRun[] = await runsByLaunchIdReq.json()

  return {
    props: { runs },
  }
}

export default Testruns
