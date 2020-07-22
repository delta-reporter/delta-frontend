import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Paper, Typography, Button } from "@material-ui/core"
import {
  TestErrorMessageExpansionPanel,
  TestMediaExpansionPanel,
} from "./TestExpandablePanels"
import { TestResolution } from "./TestResolution"
import { showStatusText, HistoricalTests } from "."
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

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
  paperNoPadding: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}))

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
      style={{ paddingLeft: "50px", paddingRight: "50px" }}
    >
      {children.name ? ( // when page is just loaded and no test selected - half page to be blank
        <Paper className={classes.paperNoPadding} elevation={0}>
          <Typography
            style={{
              padding: "10px",
              fontWeight: 580,
              fontSize: "18px",
              marginTop: "20px",
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
            }}
          >
            {showStatusText(children.status)}
            {children.name}
          </Typography>
          <Tabs style={{ marginTop: "20px" }}>
            <TabList>
              <Tab style={{ fontSize: "16px" }}>Info</Tab>
              <Tab style={{ fontSize: "16px" }}>Resolution</Tab>
              <Tab style={{ fontSize: "16px" }}>Test History</Tab>
            </TabList>
            {/* info tab */}
            <TabPanel>
              <Typography style={{ paddingTop: "20px" }}>
                Full path:
                <span style={{ color: "grey" }}> {children.file}</span>
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
              {children.retries ? ( // if there is any retries - show
                <Typography style={{ paddingTop: "20px" }}>
                  Retries:
                  <span style={{ color: "grey" }}> {children.retries}</span>
                </Typography>
              ) : (
                <div></div>
              )}
              {children.message ? ( // if there is any error message - show the info, else - test passed
                <div>
                  <Typography
                    style={{ paddingTop: "20px", paddingBottom: "20px" }}
                  >
                    Error type:
                    <span style={{ color: "grey" }}>
                      {" "}
                      {children.error_type}{" "}
                    </span>
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
                </div>
              ) : (
                <div></div>
              )}
            </TabPanel>
            <TabPanel>
              {/* set resolution tab */}
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
            </TabPanel>
            <TabPanel>
              {/* historical info tab */}
              <HistoricalTests>{children}</HistoricalTests>
            </TabPanel>
          </Tabs>
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