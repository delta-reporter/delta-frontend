import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Test } from "../../pages/index"
import {
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  List,
  ListItem,
  ExpansionPanelDetails,
  withStyles,
  Box,
  AppBar,
  Tabs,
  Tab,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import TripOriginIcon from "@material-ui/icons/TripOrigin"
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
  tab: {
    width: "50%",
  },
}))

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}

type Props = {
  children: Test[]
}

export const TestsBlock = function(props: Props) {
  const { children } = props
  const classes = useStyles(props)

  const ErrorExpansionPanel = withStyles({
    root: {
      backgroundColor: "#ffa9a9",
      borderBottom: "1px solid #ec7d7d",
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
      backgroundColor: "#f0a9a9",
      borderBottom: "1px solid #ec7d7d",
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
      {test.message ? ( // if there is any error message - show the info, else - test passed
        <Paper className={classes.paper} elevation={0}>
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Tabs
                value={historyTabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="secondary"
                variant="fullWidth"
                aria-label="full width tabs example"
              >
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="History" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
            <TabPanel value={historyTabValue} index={0}>
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
              <Typography className={classes.bigMargin}>File Name: </Typography>{" "}
              <Typography component="h2" color="textSecondary">
                {test.file}
              </Typography>
            </TabPanel>
            <TabPanel value={historyTabValue} index={1}>
              TODO: Historical info for this test
            </TabPanel>
          </div>
        </Paper>
      ) : (
        <Typography>This test passed</Typography>
      )}
    </div>
  )

  function setStatusColor(status) {
    let statusIcon
    if (status === "Passed" || status === "Successful") {
      statusIcon = (
        <CheckIcon
          style={{
            color: "green",
          }}
        ></CheckIcon>
      )
    } else if (status === "Failed") {
      statusIcon = (
        <CloseIcon
          style={{
            color: "red",
          }}
        ></CloseIcon>
      )
    } else if (status === "Skipped" || status === "Incomplete") {
      statusIcon = (
        <TripOriginIcon
          style={{
            color: "grey",
          }}
        ></TripOriginIcon>
      )
    } else if (status === "Running") {
      statusIcon = (
        <UseAnimations
          animationKey="loading"
          style={{
            color: "orange",
          }}
        />
      )
    } else {
      statusIcon = (
        <Typography
          style={{
            color: "grey",
          }}
        >
          {status}
        </Typography>
      )
    }
    return statusIcon
  }

  const [historyTabValue, setHistoryTabValue] = React.useState(0)
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setHistoryTabValue(newValue)
  }

  return (
    <div>
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
                <Typography className={classes.suiteStatus} color="textPrimary">
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
    </div>
  )
}
