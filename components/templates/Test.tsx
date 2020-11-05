import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Paper, Typography, Tooltip } from "@material-ui/core"
import {
  TestErrorMessageAccordion,
  TestMediaAccordion,
} from "./TestExpandablePanels"
import { TestResolution } from "./TestResolution"
import { showStatusText, HistoricalTests, showIsFlakyBadgeTestExpanded } from "."
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"
import { Notes } from "./Notes"

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
  paperNoPaddingDark: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor:"#2a2a2a",
  },
  paperNoPaddingLight: {
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  textColorDarkMode: {
    color: "#8c8d8d",
  },
  textColorLightMode: {
  },
}))

interface TestProps {
  children: any
  darkMode: boolean
}

export const TestExpanded = function(props: TestProps) {
  const { children, darkMode } = props
  const classes = useStyles(props)

  function convertToSeconds(microseconds: number) {
    return (microseconds / 1000).toString()[0]
  }

  function getBackgroundColorForTheTab(darkMode) {
    if(darkMode) return "#2a2a2a"
    else return "white"
  }

  function getTextColorForTheTab(darkMode) {
    if(darkMode) return "#8c8d8d"
    else return "black"
  }

  function setSlowTestBadge(duration) {
    // if longer than 1 min
    if (duration > "1") 
      return (
        <Tooltip title="This test took longer than 1 min to execute">
            <span style={{ border:"1px solid #d62727", padding: "2px 5px 2px 5px", color:"#d62727", marginLeft:"13px"}}>Potentially slow test</span>
        </Tooltip>
      )
  }

  return (
    <div
      key={children.test_history_id}
      className={classes.root}
      style={{ paddingLeft: "50px", paddingRight: "50px", paddingBottom: "50px", marginTop: "-20px"}}
    >
      {children.name ? ( // when page is just loaded and no test selected - half page to be blank
        <Paper className={darkMode ? classes.paperNoPaddingDark : classes.paperNoPaddingLight} elevation={0}>
          <Typography
            style={{
              padding: "10px",
              fontWeight: 580,
              fontSize: "18px",
              marginTop: "20px",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
            className={darkMode ? classes.textColorDarkMode : classes.textColorLightMode}
          >
            {showIsFlakyBadgeTestExpanded(children.status, children.is_flaky)} 
            {showStatusText(children.status, darkMode)} 
           <span style={{paddingLeft:"8px"}}> {children.name}</span>
          </Typography>
          <Tabs style={{ marginTop: "20px" }} className={darkMode ? classes.textColorDarkMode : classes.textColorLightMode}>
            <TabList>
              <Tab style={{ fontSize: "16px", backgroundColor: getBackgroundColorForTheTab(darkMode), color: getTextColorForTheTab(darkMode) }} >Info</Tab>
              <Tab style={{ fontSize: "16px", backgroundColor: getBackgroundColorForTheTab(darkMode), color: getTextColorForTheTab(darkMode)  }}>Resolution</Tab>
              <Tab style={{ fontSize: "16px", backgroundColor: getBackgroundColorForTheTab(darkMode), color: getTextColorForTheTab(darkMode)  }}>Test History</Tab>
              <Tab style={{ fontSize: "16px", backgroundColor: getBackgroundColorForTheTab(darkMode), color: getTextColorForTheTab(darkMode)  }}>Notes</Tab>
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
                {setSlowTestBadge(children.duration.minutes)} 
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
                <div style={{ paddingTop: "10px" }}>
                  <TestErrorMessageAccordion>
                    {children}
                  </TestErrorMessageAccordion>
                  {children.media ? ( // check if there is any media for this test
                    <TestMediaAccordion key={children.file_id}>
                      {children}
                    </TestMediaAccordion>
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
                  <TestResolution resolution = {children.test_history_resolution} motherTestId={children.mother_test_id} testId={children.test_id}></TestResolution>
              </div>
            </TabPanel>
            <TabPanel>
              {/* historical info tab */}
              <HistoricalTests darkMode={darkMode}>{children}</HistoricalTests>
            </TabPanel>
            <TabPanel>
              {/* notes tab */}
              <Notes darkMode={darkMode} mother_test_id={children.mother_test_id}></Notes>
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
