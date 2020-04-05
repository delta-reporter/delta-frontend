import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Test } from "../../pages/index"
import {
  Grid,
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  List,
  ListItem,
  ExpansionPanelDetails,
  withStyles,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked"
import UseAnimations from "react-useanimations"
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"

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
  bigMargin: {
    marginTop: theme.spacing(3),
  },
  smallMargin: {
    marginTop: theme.spacing(1),
  },
}))

type Props = {
  children: Test[]
}

export const TestsBlock = function(props: Props) {
  const { children } = props
  const classes = useStyles(props)

  const ErrorExpansionPanel = withStyles({
    root: {
      border: "1px solid rgba(0, 0, 0, .125)",
      boxShadow: "none",
      "&:not(:last-child)": {
        borderBottom: 0,
      },
      "&:before": {
        display: "none",
      },
      "&$expanded": {
        margin: "auto",
      },
    },
    expanded: {},
  })(MuiExpansionPanel)

  const ErrorExpansionPanelSummary = withStyles({
    root: {
      backgroundColor: "rgba(0, 0, 0, .03)",
      borderBottom: "1px solid rgba(0, 0, 0, .125)",
      marginBottom: -1,
      minHeight: 56,
      "&$expanded": {
        minHeight: 56,
      },
    },
    content: {
      "&$expanded": {
        margin: "12px 0",
      },
    },
    expanded: {},
  })(MuiExpansionPanelSummary)

  const ErrorExpansionPanelDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiExpansionPanelDetails)

  const [expandedSuite, setExpandedSuite] = React.useState<string | false>(
    false
  )
  const expandCollapseSuite = (suitePanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedSuite(isExpanded ? suitePanel : false)
  }

  const [expandedTest, setExpandedTest] = React.useState<string | false>(false)
  const expandCollapseTest = (testPanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedTest(isExpanded ? testPanel : false)
  }

  const [expandedTestMessage, setExpandedTestMessage] = React.useState<
    string | false
  >(false)
  const expandCollapseTestMessage = (testMessagePanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedTestMessage(isExpanded ? testMessagePanel : false)
  }

  const testsTab = test => (
    <div key={test.id} className={classes.root}>
      {/* TODO: To be used later when it's in a separate section */}
      {/* <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell>
                  {" "}
                  <h3 style={{ fontWeight: "normal" }}>{test.name}</h3>
                </TableCell>
                <TableCell>{setStatusColor(test.status)}</TableCell>
              </TableRow>
            </TableBody>
          </Table> */}
      {test.message ? ( // if there is any error message - show the info, else - test passed
        <Paper className={classes.paper} elevation={0}>
          <Typography
            component="h2"
            variant="h6"
            color="secondary"
            gutterBottom
          >
            Overview
          </Typography>
          <Typography className={classes.bigMargin}>Error: </Typography>{" "}
          <ErrorExpansionPanel
            key={test.id}
            expanded={expandedTestMessage === test.message}
            onChange={expandCollapseTestMessage(test.message)}
          >
            <ErrorExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color="textPrimary">{test.message}</Typography>
            </ErrorExpansionPanelSummary>
            <ErrorExpansionPanelDetails>
              <List>
                <ListItem button>
                  {" "}
                  {test.error_type}
                  {test.trace}
                  {test.retries}
                </ListItem>
              </List>
            </ErrorExpansionPanelDetails>
          </ErrorExpansionPanel>
          <Typography className={classes.bigMargin}>Location: </Typography>{" "}
          <Typography component="h2" color="textSecondary">
            {test.file}
          </Typography>
        </Paper>
      ) : (
        <Typography>This test passed</Typography>
      )}
    </div>
  )

  function setStatusColor(status) {
    let button
    switch (status) {
      case "Passed":
        button = (
          <RadioButtonCheckedIcon
            style={{
              color: "green",
            }}
          ></RadioButtonCheckedIcon>
        )
        break
      case "Failed":
        button = (
          <RadioButtonCheckedIcon
            style={{
              color: "red",
            }}
          ></RadioButtonCheckedIcon>
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
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Test suites for {children[0].test_type} run
            </Typography>
            {children.map(testRun => (
              <div key={testRun.id}>
                {testRun.test_suites.map(suite => (
                  <ExpansionPanel
                    key={suite.id}
                    expanded={expandedSuite === suite.name}
                    onChange={expandCollapseSuite(suite.name)}
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
                      <List key={suite.id} className={classes.root}>
                        {suite.tests.map(test => (
                          <div key={test.id}>
                            <ListItem className={classes.root} button>
                              <ExpansionPanel
                                className={classes.root}
                                key={test.id}
                                expanded={expandedTest === test.name}
                                onChange={expandCollapseTest(test.name)}
                              >
                                <ExpansionPanelSummary
                                  expandIcon={<ExpandMoreIcon />}
                                >
                                  {setStatusColor(test.status)}
                                  <Typography
                                    className={classes.suiteStatus}
                                    color="textPrimary"
                                  >
                                    {test.name}{" "}
                                  </Typography>{" "}
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                  {testsTab(test)}
                                </ExpansionPanelDetails>
                              </ExpansionPanel>
                            </ListItem>
                          </div>
                        ))}{" "}
                      </List>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                ))}
              </div>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}
