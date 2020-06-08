import React, { useState, useEffect } from "react"
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
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import axios from "axios"

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

  const [historyTabValue, setHistoryTabValue] = React.useState(0)

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setHistoryTabValue(newValue)
  }

  const [appState, setAppState] = useState({
    loading: false,
    resolution: null,
  })

  const showTheResolutionResponse = function(props) {
    const { resolution } = props

    useEffect(() => {
      axios
        .put("https://delta-core.dsch.dev/api/v1/test_history_resolution", {
          test_history_id: 1529,
          test_resolution: "Test Issue",
        })
        .then(resolution => {
          const allRepos = resolution.data
          setAppState({ loading: false, resolution: allRepos })
        })
    }, [setAppState])

    if (!resolution || resolution.length === 0) {
      return <p>No resolution available</p>
    }
    return <p>{resolution.message} </p>
  }

  function handleResolutionLoading(Component) {
    return function handleResolutionLoadingComponent({ isLoading, ...props }) {
      if (!isLoading) return <Component {...props} />
      return (
        <p style={{ textAlign: "center", fontSize: "30px" }}>
          Hold on, fetching data may take some time :)
        </p>
      )
    }
  }

  const LoadResolution = handleResolutionLoading(showTheResolutionResponse)

  return (
    <div key={children.test_history_id} className={classes.root}>
      <LoadResolution
        isLoading={appState.loading}
        resolution={appState.resolution}
      />
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
              <Tab label="Error" id="tab-0" />
              <Tab label="Test History" id="tab-1" />
            </Tabs>
          </AppBar>
          <TabPanel value={historyTabValue} index={0}>
            <ErrorMessagePanel
              key={children.test_history_id}
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
              <Typography className={classes.bigMargin}></Typography>
            </div>
          </TabPanel>
          <TabPanel value={historyTabValue} index={1}>
            Historical info for this test {children.test_id}
          </TabPanel>
        </Paper>
      ) : (
        <div></div>
      )}
    </div>
  )
}
