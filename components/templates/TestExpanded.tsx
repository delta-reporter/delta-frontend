import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Paper,
  Typography,
  Box,
  AppBar,
  Tabs,
  Tab,
  Button,
} from "@material-ui/core"
import {
  TestErrorMessageExpansionPanel,
  TestMediaExpansionPanel,
} from "./TestExpansionPanel"
import { TestResolution } from "./TestResolution"
import { showStatusText } from "."

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
    width: "100%",
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

const testResolutions = [
  "Not set",
  "Test is flaky",
  "Product defect",
  "Test needs to be updated",
  "To investigate",
  "Environment issue",
]

interface TestProps {
  children: any
}

export const TestExpanded = function(props: TestProps) {
  const { children } = props
  const classes = useStyles(props)

  const [historyTabValue, setHistoryTabValue] = React.useState(0)
  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setHistoryTabValue(newValue)
  }

  const [openResolutionDialog, setOpenResolutionDialog] = React.useState(false)
  const [resolutionResponse, setResolutionResponse] = React.useState(
    testResolutions[0]
  )
  const handleResolutionDialogOpen = () => {
    setOpenResolutionDialog(true)
  }

  const handleResolutionDialogClose = (value: string) => {
    setOpenResolutionDialog(false)
    setResolutionResponse(value)
  }

  function convertToSeconds(microseconds: number) {
    return (microseconds / 1000).toString()[0]
  }
  return (
    <div
      key={children.test_history_id}
      className={classes.root}
      style={{ paddingLeft: "50px" }}
    >
      {children.name ? ( // when page is just loaded and no test selected - half page to be blank
        <Paper className={classes.paperNoPadding} elevation={0}>
          <Typography
            style={{
              padding: "10px",
              fontWeight: 580,
              fontSize: "18px",
              marginTop: "20px",
            }}
          >
            {showStatusText(children.status)}
            {children.name}
          </Typography>
          <AppBar
            style={{
              backgroundColor: "white",
              border: "none",
              paddingTop: "25px",
            }}
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
              <Tab label="Info" id="tab-0" />
              <Tab label="Test History" id="tab-1" />
            </Tabs>
          </AppBar>
          <TabPanel value={historyTabValue} index={0} >
            <Typography style={{ paddingTop: "20px"}}>
              Full path:
              <span style={{ color: "grey"}}> {children.file}</span>
            </Typography>
            <Typography style={{ paddingTop: "20px" }}>
              Duration:
              {children.duration.minutes === 0 ? (
                <span style={{ color: "grey" }}> </span>
              ) : (
                <span style={{ color: "grey" }}>
                  {" "}
                  {children.duration.minutes}m{" "}
                </span>
              )}
              <span style={{ color: "grey" }}>
                {" "}
                {children.duration.seconds}.
                {convertToSeconds(children.duration.microseconds)}s{" "}
              </span>
            </Typography>
            {children.message ? ( // if there is any error message - show the info, else - test passed
              <div>
                <Typography
                  style={{ paddingTop: "20px", paddingBottom: "20px" }}
                >
                  Error type:
                  <span style={{ color: "grey" }}> {children.error_type} </span>
                </Typography>

                <TestErrorMessageExpansionPanel>
                  {children}
                </TestErrorMessageExpansionPanel>
                {children.media ? ( // check if there is any media for this test
                  <TestMediaExpansionPanel key={children.file_id}>
                    {children}
                  </TestMediaExpansionPanel>
                ) : (
                  <div></div>
                )}
                <div style={{ paddingTop: "20px" }}>
                  {children.resolution === "Not set" ? ( // when resolution is not set - show button
                    <Typography className={classes.bigMargin}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleResolutionDialogOpen}
                        className={classes.bigMargin}
                      >
                        Set test resolution
                      </Button>{" "}
                      <span
                        style={{
                          color: "grey",
                          fontStyle: "italic",
                        }}
                      >
                        {resolutionResponse}
                      </span>
                    </Typography>
                  ) : (
                    <Typography style={{ paddingTop: "10px" }}>
                      Test Resolution:
                      <span style={{ color: "grey" }}>
                        {" "}
                        {children.resolution}{" "}
                      </span>
                    </Typography>
                  )}

                  <TestResolution
                    open={openResolutionDialog}
                    selectedValue={resolutionResponse}
                    onClose={handleResolutionDialogClose}
                    testHistoryId={children.test_history_id}
                    testResolutions={testResolutions}
                  />
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </TabPanel>
          <TabPanel value={historyTabValue} index={1}>
            <Typography style={{ padding: "10px" }}>
              {" "}
              COMING:
              <span
                style={{ color: "grey", fontStyle: "italic", padding: "10px" }}
              >
                Historical info for this test
              </span>
              {children.test_id}
            </Typography>
          </TabPanel>
        </Paper>
      ) : (
        <Typography
          style={{
            fontWeight: 300,
            margin: "50px",
            textAlign: "center",
            fontSize: "20px",
            fontStyle: "italic",
            color: "#605959",
          }}
        >
          Please select a test to view
        </Typography>
      )}
    </div>
  )
}
