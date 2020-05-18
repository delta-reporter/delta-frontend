import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Typography,
  List,
  ListItem,
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
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 3500,
  },
  title: {
    fontSize: "2em",
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

interface TestProps {
  children: any
}

export const TestInfoSection = function(props: TestProps) {
  const { children } = props
  const classes = useStyles(props)

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

  function SetTestResolution(props: ResolutionProps, testHistoryId) {
    const { onClose, selectedValue, open } = props

    const handleClose = () => {
      onClose(selectedValue)
    }

    const handleListItemClick = async (resoluion: string) => {
      // POST request using fetch with async/await
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          test_history_id: testHistoryId,
          test_resolution: resoluion,
        }),
      }
      const response = await fetch(
        `${process.env.deltaCore}/api/v1/test_history_resolution`,
        requestOptions
      )
      const data = await response.json()
      onClose(data)
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

  const [historyTabValue, setHistoryTabValue] = React.useState(0)
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setHistoryTabValue(newValue)
  }

  return (
    <div key={children.id} className={classes.root}>
      <Typography className={classes.bigMargin}>
        Full path:
        <span style={{ color: "grey" }}> {children.name}</span>
      </Typography>
      {children.message ? ( // if there is any error message - show the info, else - test passed
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
              key={children.id}
              expanded={expandedErrorMessage === children.message}
              onChange={expandCollapseErrorMessage(children.message)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <ErrorMessageCollapsedLineSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3bh-content"
              >
                <Typography color="textPrimary">{children.message}</Typography>
              </ErrorMessageCollapsedLineSummary>
              <ErrorMessagePanelDetails>
                <List>
                  <ListItem button>
                    {" "}
                    {children.error_type}
                    {children.trace}
                    {children.retries}
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
                <span style={{ marginLeft: "15px" }}>Selected: </span>
                <span style={{ color: "grey", fontStyle: "italic" }}>
                  {selectedResolutionValue}
                </span>
              </Typography>
              <SetTestResolution
                open={openResolutionDialog}
                selectedValue={selectedResolutionValue}
                onClose={handleResolutionDialogClose}
                {...children.id}
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
}
