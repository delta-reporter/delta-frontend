import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import getMostFailedTests from '../../../data/TestsFailingMost';
import UseAnimations from "react-useanimations"
import { Grid, Tooltip } from '@material-ui/core';
import { TestDetail } from './TestDetail';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  rootLight: {
    flexGrow: 1,
    color: theme.palette.secondary.light,
  },
  rootDark: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
  },
  textColorDarkMode: {
    color: theme.palette.secondary.light,
  },
  textColorLightMode: {
  },
  container: {
    maxHeight: 400,
  },
}))

function getBackgroundColor(darkMode) {
  if (darkMode) return "#2a2a2a"
  else return "white"
}

interface TestFailingMostProps {
  project: number
  darkMode: boolean
}

interface FailedTest {
  id: number
  name: string
  test_suite: string
  test_type: string
  is_flaky: boolean
  failed_count: number
  darkMode: boolean
}


function Row(props: FailedTest ) {
  const { id, name, test_suite, test_type, is_flaky, failed_count, darkMode } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {is_flaky?
            <Tooltip title="Test flaky. Failing more than 5/10 times">
              <UseAnimations animationKey="alertCircle" style={{ width:"30px", height:"25px", marginBottom:"3px", marginLeft:"-3px",color: "#d62727" }}/>
            </Tooltip>
            :
            <></>
          }
          {name}
        </TableCell>
        <TableCell align="right">{test_suite}</TableCell>
        <TableCell align="right">{test_type}</TableCell>
        <TableCell align="right">{failed_count}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Test Details
              </Typography>
              <TestDetail mother_test_id={id} darkMode={darkMode}/>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export const TestsFailingTheMost = function(props: TestFailingMostProps) {

  const classes = useStyles(props);
  const { project, darkMode} = props;

  const { loading, noData, most_failed_tests } = getMostFailedTests(project)

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
          {most_failed_tests.length == 0
            ?
                  <Grid item xs={10}>
                     <Typography
                      style={{
                        fontStyle: "italic",
                        margin: "20px",
                        color: "grey",
                      }}
                    >
                    No tests failing the most were found...
                    </Typography>
                  </Grid>
            :
                <div>
                  <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    style={{ fontWeight: 400, margin: "5px" }}
                    className={darkMode ? classes.textColorDarkMode : classes.textColorLightMode}
                  >
                    Tests failing the most
                  </Typography>
                  </Grid>
                  <TableContainer
                    component={Paper}
                    className={darkMode ? classes.rootDark : classes.rootLight}
                    style={{
                      backgroundColor: getBackgroundColor(darkMode)
                    }}
                    >
                    <Table aria-label="collapsible table">
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>Test</TableCell>
                          <TableCell align="right">Test Suite</TableCell>
                          <TableCell align="right">Type</TableCell>
                          <TableCell align="right">Times Failed</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {most_failed_tests.map((failed_test) => (
                          <Row
                            key={failed_test.id}
                            id={failed_test.id}
                            name={failed_test.name}
                            test_suite={failed_test.test_suite}
                            test_type={failed_test.test_type}
                            is_flaky={failed_test.is_flaky}
                            failed_count={failed_test.failed_count}
                            darkMode={darkMode}
                            />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
            }
          </div>
        }
        {" "}
        </div>
      </>
    )
  }
}
