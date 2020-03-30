import React from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { Test } from "../index"
import { BasePage } from "../../components/templates/BasePage"
import {
  Container,
  Grid,
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ExpansionPanelDetails,
  Link,
  Breadcrumbs,
  Table,
  TableCell,
  TableBody,
  Box,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked"
import UseAnimations from "react-useanimations"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 3500,
  },
  counter: {
    margin: 10,
  },
  title: {
    fontSize: "2em",
  },
  suiteStatus: {
    paddingLeft: theme.spacing(4),
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
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
  paperWithSpace: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  list: {
    width: 700,
    padding: theme.spacing(2),
  },
}))

type Props = {
  test_history: Test[]
}

function Tests(props: Props) {
  const classes = useStyles(props)
  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleExpandCollapseEvent = (panel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded ? panel : false)
  }

  const [state, setState] = React.useState({
    right: false,
  })

  const expandSuite = open => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }
    setState({ ...state, ["right"]: open })
  }

  const testsTab = test => (
    <div
      key={test.id}
      className={classes.list}
      role="presentation"
      onClick={expandSuite(false)}
      onKeyDown={expandSuite(false)}
    >
      <Table size="small">
        <TableBody>
          <TableCell>
            {" "}
            <h3 style={{ fontWeight: "normal" }}>{test.name}</h3>
          </TableCell>
          <TableCell>
            <Typography>{setStatusColor(test.status)}</Typography>
          </TableCell>
        </TableBody>
      </Table>
      {test.message ? (
        <Paper className={classes.paper}>
          <ExpansionPanel
            key={test.id}
            expanded={expanded === test.message}
            onChange={handleExpandCollapseEvent(test.message)}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color="textPrimary">{test.message}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List>
                <ListItem button onClick={expandSuite(true)}>
                  {" "}
                  {test.error_type}
                  {test.trace}
                  {test.retries}
                </ListItem>
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Paper>
      ) : (
        <div></div>
      )}
      <Typography
        component="h2"
        variant="h6"
        color="secondary"
        gutterBottom
        className={classes.seeMore}
      >
        Overview
      </Typography>

      <Typography className={classes.seeMore}>
        Location:
        <Typography component="h2" color="textSecondary">
          {test.file}
        </Typography>{" "}
      </Typography>
    </div>
  )

  function setStatusColor(status) {
    let button
    switch (status) {
      case "Passed":
        button = (
          <Typography
            style={{
              color: "green",
            }}
          >
            Passed{" "}
          </Typography>
        )
        break
      case "Failed":
        button = (
          <Typography
            style={{
              color: "red",
            }}
          >
            Failed{" "}
          </Typography>
        )
        break
      case "Skipped":
        button = (
          <Typography
            style={{
              color: "grey",
            }}
          >
            Failed{" "}
          </Typography>
        )
        break
      case "Running":
        button = (
          <UseAnimations
            animationKey="loading"
            style={{
              color: "orange",
            }}
          />
        )
        break
      default:
        button = <RadioButtonCheckedIcon />
    }
    return button
  }

  return (
    <BasePage className={classes.root}>
      <title>Δ | Tests</title>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Delta Reporter
        </Link>
        <Link color="inherit" href={`/projects`}>
          Projects
        </Link>
        <Link color="inherit" href={`/launches/1`}>
          Launches
        </Link>
        <Link color="inherit" href={`/testruns/1`}>
          Test Runs
        </Link>
        <Typography color="textPrimary">Tests</Typography>
      </Breadcrumbs>
      <Container maxWidth="lg" className={classes.container}>
        <Grid xs={12}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Test suites for {props.test_history[0].test_type} run
            </Typography>
            {props.test_history[0] ? ( // checking if props exist
              <div>
                {props.test_history.map(testRun => (
                  <div key={testRun.id}>
                    {testRun.test_suites.map(suite => (
                      <ExpansionPanel
                        key={suite.id}
                        expanded={expanded === suite.name}
                        onChange={handleExpandCollapseEvent(suite.name)}
                      >
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                          {setStatusColor(suite.test_suite_status)}
                          <Typography
                            className={classes.suiteStatus}
                            color="textPrimary"
                          >
                            {suite.name}
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          {/* Expanded tests list for each suite */}
                          <List className={classes.root}>
                            {suite.tests.map(test => (
                              <div key={test.id}>
                                <ListItem
                                  className={classes.root}
                                  button
                                  onClick={expandSuite(true)}
                                >
                                  {test.name}
                                  <ListItemSecondaryAction>
                                    <Typography>{test.status}</Typography>
                                  </ListItemSecondaryAction>
                                </ListItem>
                                <Divider />
                                <Drawer
                                  anchor="right"
                                  open={state.right}
                                  onClose={expandSuite(false)}
                                >
                                  {testsTab(test)}
                                </Drawer>
                              </div>
                            ))}
                          </List>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              // if props don't exist
              <h1>No suites were found for this run! </h1>
            )}
          </Paper>
        </Grid>
      </Container>
    </BasePage>
  )
}

Tests.getInitialProps = async (context): Promise<Props> => {
  const { testsByRunId } = context.query

  // Suites and tests (inside suites)
  const testsByTestRunIdReq = await fetch(
    `http://delta_core_service:5000/api/v1/tests_history/test_run/${testsByRunId}`,
    {
      method: "GET",
    }
  )
  const tests = await testsByTestRunIdReq.json()

  return {
    test_history: tests,
  }
}

export default Tests
