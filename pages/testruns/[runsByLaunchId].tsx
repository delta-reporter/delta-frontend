import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { TestRun } from "../index"
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

const useStyles = makeStyles(theme => ({
  rootLight: {
    flexGrow: 1,
    color: "#8c8d8d",
  },
  rootDark:{
    flexGrow: 1,
    backgroundColor: "#2a2a2a",
    color: "#8c8d8d",
  }, 
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  toggleModeDark: {
    backgroundColor: "#2a2a2a",
    color: "#8c8d8d",
    border: "1px grey solid",
    marginBottom: "15px",
  }, 
  toggleModeLight: {
    border: "1px grey solid",
    marginBottom: "15px",
  }, 
  textColorDarkMode: {
    color: "#8c8d8d",
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
    backgroundColor: "#2a2a2a",
    border: "1px grey solid",
  },
}))

function setTestTypeBadge(testType) {
  let badge
  if (/.*(\w*nit\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/unit.png" width="40" height="30" />
  } else if (/.*(\w*ntegration\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/api.png" width="40" height="30" />
  } else if (/.*(\w*nd\w*)\b/.test(testType)) {
    badge = <img alt={testType} src="/ui.png" width="40" height="30" />
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

type Props = {
  test_runs: TestRun[]
}

function Testruns(props: Props) {
  const classes = useStyles(props)

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
        {props.test_runs[0] ? ( // checking if props exist
          <div>
          <Breadcrumbs style={{ paddingLeft: "30px", marginTop: "20px"}}  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
              <Link color="inherit" href={`/`}>
                Projects
              </Link>
              <Link
                color="inherit"
                href={`/launches/${props.test_runs[0].project_id}`}
              >
                Launches
              </Link>
              <Typography color="textPrimary"  className={state.darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>Test Runs</Typography>
            </Breadcrumbs>
            <Container maxWidth="lg" className={classes.container}>
            <FormGroup row>
              <FormControlLabel
                control={<Switch checked={state.darkMode} onChange={handleDarkModeChange} name="darkMode" />}
                label="Dark Mode"
              />
            </FormGroup>              <Grid container spacing={3}>
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
                          {props.test_runs[0].launch_name}
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
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {props.test_runs.map(testRun => (
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
                                underline="none"
                                href={`/tests/${testRun.test_run_id}`}
                              >
                                View All tests
                              </Link>
                            </TableCell>
                            {testRun.test_run_status === "Passed" ? (
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
                            )}
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

Testruns.getInitialProps = async (context): Promise<Props> => {
  const { runsByLaunchId } = context.query
  const runsByLaunchIdReq = await fetch(
    `${process.env.deltaCore}/api/v1/test_run/launch/${runsByLaunchId}`,
    {
      method: "GET",
    }
  )
  const runs = await runsByLaunchIdReq.json()

  return {
    test_runs: runs,
  }
}

export default Testruns
