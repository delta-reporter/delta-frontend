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
  Dialog,
  DialogTitle,
  ListItemText,
  Button,
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
  testLine: {
    width: "100%",
    maxWidth: 3500,
    maxHeight: 50,
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
    marginTop: theme.spacing(1),
    marginButtom: theme.spacing(3),
  },
  marginBottom: {
    marginButtom: theme.spacing(3),
  },
  paperNoPadding: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  tabs: {
    marginTop: theme.spacing(1),
    width: "30%",
  },
  backgroundColor: {
    maxWidth: "50",
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
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  }
}

type Props = {
  children: Test[]
}

export const TestsBlock = function(props: Props) {
  const { children } = props
  const classes = useStyles(props)

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

  const [expandedErrorMessage, setExpandedErrorMessage] = React.useState<
    string | false
  >(false)
  const expandCollapseErrorMessage = (errorMessagePanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedErrorMessage(isExpanded ? errorMessagePanel : false)
  }

  const ErrorMessagePanel = withStyles({
    root: {
      backgroundColor: "#f9dbdb", // error message expanded color
      borderBottom: "1px solid #ffa7a7",
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

  const ErrorMessageCollapsedLineSummary = withStyles({
    root: {
      backgroundColor: "#f9e6e6", // error message color
      borderBottom: "1px solid #f9e6e6",
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

  const ErrorMessagePanelDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiExpansionPanelDetails)

  interface ResolutionProps {
    open: boolean
    selectedValue: string
    onClose: (value: string) => void
  }

  const testResolutions = [
    "Not set",
    "Test is flaky",
    "Product defect",
    "Test needs to be updated",
    "To investigate",
  ]

  const [openResolutionDialog, setOpenResolutionDialog] = React.useState(false)
  const [selectedResolutionValue, setSelectedResolutionValue] = React.useState(
    testResolutions[0]
  )

  const handleResolutionDialogOpen = () => {
    setOpenResolutionDialog(true)
  }

  const handleResolutionDialogClose = (value: string) => {
    setOpenResolutionDialog(false)
    setSelectedResolutionValue(value)
  }

  function SetTestResolution(props: ResolutionProps) {
    const { onClose, selectedValue, open } = props

    const handleClose = () => {
      onClose(selectedValue)
    }

    const handleListItemClick = (value: string) => {
      onClose(value)
    }

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Set resolution:</DialogTitle>
        <List>
          {testResolutions.map(resolution => (
            <ListItem
              button
              onClick={() => handleListItemClick(resolution)}
              key={resolution}
            >
              <ListItemText primary={resolution} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    )
  }

  const testsTab = test => (
    <div key={test.id} className={classes.root}>
      <Typography className={classes.bigMargin}>
        Full path:
        <span style={{ color: "grey" }}> {test.name.split(":")[0]}.</span>
        <span style={{ color: "grey", fontWeight: "bold" }}>
          {test.name.split(":")[1]}
        </span>
      </Typography>
      {test.message ? ( // if there is any error message - show the info, else - test passed
        <Paper className={classes.paperNoPadding} elevation={0}>
          <AppBar
            style={{ backgroundColor: "white", border: "none" }}
            variant="outlined"
            position="relative"
            className={classes.tabs}
          >
            <Tabs
              value={historyTabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="secondary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Error" {...a11yProps(0)} />
              <Tab label="Test History" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={historyTabValue} index={0}>
            <ErrorMessagePanel
              key={test.id}
              expanded={expandedErrorMessage === test.message}
              onChange={expandCollapseErrorMessage(test.message)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <ErrorMessageCollapsedLineSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
              >
                <Typography color="textPrimary">{test.message}</Typography>
              </ErrorMessageCollapsedLineSummary>
              <ErrorMessagePanelDetails>
                <List>
                  <ListItem button>
                    {" "}
                    {test.error_type}
                    {test.trace}
                    {test.retries}
                  </ListItem>
                </List>
              </ErrorMessagePanelDetails>
            </ErrorMessagePanel>
            <div>
              <Typography className={classes.bigMargin}>
                <Button
                  disabled
                  variant="outlined"
                  color="primary"
                  onClick={handleResolutionDialogOpen}
                  className={classes.bigMargin}
                >
                  Set test resolution
                </Button>{" "}
                {/* <span style={{ marginLeft: "15px" }}>Selected: </span>
                <span style={{ color: "grey", fontStyle: "italic" }}>
                  {selectedResolutionValue}
                </span> */}
                <span
                  style={{
                    color: "grey",
                    fontStyle: "italic",
                    marginLeft: "15px",
                  }}
                >
                  Coming Soon
                </span>
              </Typography>
              <SetTestResolution
                open={openResolutionDialog}
                selectedValue={selectedResolutionValue}
                onClose={handleResolutionDialogClose}
              />
            </div>
          </TabPanel>
          <TabPanel value={historyTabValue} index={1}>
            TODO: Historical info for this test
          </TabPanel>
        </Paper>
      ) : (
        <div></div>
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
              TransitionProps={{ unmountOnExit: true }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
              >
                {setStatusColor(suite.test_suite_status)}
                <Typography className={classes.suiteStatus} color="textPrimary">
                  {suite.name}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {/* Expanded tests list for each suite */}
                <List key={suite.id} className={classes.root} dense>
                  {suite.tests.map(test => (
                    <ListItem key={test.id} className={classes.root}>
                      <ExpansionPanel
                        className={classes.root}
                        key={test.id}
                        expanded={expandedTest === test.name}
                        onChange={expandCollapseTest(test.name)}
                        TransitionProps={{ unmountOnExit: true }}
                      >
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel2bh-content"
                        >
                          {setStatusColor(test.status)}
                          <Typography
                            className={classes.suiteStatus}
                            color="textPrimary"
                          >
                            {/* getting the name of the test */}
                            {test.name.split(":")[1]}
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          {testsTab(test)}
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    </ListItem>
                  ))}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </div>
      ))}
    </div>
  )
}
