import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  showStatusIcon,
  showTestStats,
  showResolutionText,
  TestExpanded,
} from "../../components/templates"
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  ListItem,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { SuiteAndTest } from "../../pages"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 3500,
  },
  title: {
    fontSize: "2em",
  },
  container: {
    paddingTop: theme.spacing(4),
    maxWidth: 3400,
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  padding: {
    marginBottom: "5px",
    marginLeft: "80%",
    color: "#353690",
  },
  nameOfTestOrSuiteDark: {
    paddingLeft: theme.spacing(4),
    fontSize: "0.875rem",
    textAlign: "left",
    fontFamily: "Roboto",
    fontWeight: 400,
    wordBreak: "break-all",
    whiteSpace: "pre-wrap",
    color: "#8c8d8d",
  },
  nameOfTestOrSuiteLight: {
    paddingLeft: theme.spacing(4),
    fontSize: "0.875rem",
    textAlign: "left",
    fontFamily: "Roboto",
    fontWeight: 400,
    wordBreak: "break-all",
    whiteSpace: "pre-wrap",
  },
  backgroundGrey: {
    backgroundColor: "#d6d6d6",
  },
  backgroundDarkGrey: {
    backgroundColor: "#474747",
  },
  backgroundWhite: {
    backgroundColor: "white",
  },
  backgroundDark: {
    backgroundColor: "#2a2a2a",
    border: "1px grey solid",
  },
  testBackgroundDark: {
    backgroundColor: "#2a2a2a",
  },
}))

type Props = {
  children: SuiteAndTest[]
  stats
  darkMode: boolean
}

export const ListOfSuites = function(props: Props) {
  const { children, stats, darkMode } = props
  const classes = useStyles(props)
  const [testInfoSection, setTestInfoSection] = useState(["No test selected"])
  const [highlightedTest, setHighlightedTest] = useState(0)

  function changeRightSide(value, testId) {
    setTestInfoSection(value)
    console.log(testId)
    setHighlightedTest(testId)
  }

  function setStats() {
    let settingStats = []
    if(stats.includes("2")) settingStats.push("passed")
    if(stats.includes("1")) settingStats.push("failed")
    if(stats.includes("4")) settingStats.push("incomplete")
    if(stats.includes("3")) settingStats.push("running")
    if(stats.includes("5")) settingStats.push("skipped")
    return settingStats
  }
  let statsArray = setStats()
  
  const [expandedSuite, setExpandedSuite] = useState<string | false>(
    false
  )
  const expandCollapseSuite = (suitePanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedSuite(isExpanded ? suitePanel : false)
  }

  function setTextLineStyle(isHighlighted, darkMode) {
    if(isHighlighted && !darkMode) //light mode - highlighted
     return classes.backgroundGrey
    else if(isHighlighted && darkMode) //dark mode - highlighted
      return classes.backgroundDarkGrey
    else if (isHighlighted && !darkMode) //light mode - not highlighted
    return classes.backgroundWhite
    else if (!isHighlighted && darkMode) //dark mode - not highlighted
    return classes.testBackgroundDark
  }

  return (
    <div>
      {/* left-hand side for suites list */}
      <div
        style={{
          float: "left",
          width: "55%",
          overflow: "hidden",
          height: "max-content",
          paddingRight: "20px",
          marginTop: "30px",
        }}
      >
        {children.map(testRun => (
          <div key={testRun.test_run_id} >
            {testRun.test_suites.map(suite => (
              <Accordion // list of expandable suites
                key={suite.test_suite_history_id}
                expanded={expandedSuite === suite.name}
                onChange={expandCollapseSuite(suite.name)}
                TransitionProps={{ unmountOnExit: true }}
                className={darkMode ? classes.backgroundDark : classes.backgroundWhite}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                  {showStatusIcon(suite.test_suite_status)}
                  <Typography className={darkMode ? classes.nameOfTestOrSuiteDark : classes.nameOfTestOrSuiteLight}>
                    {suite.name}
                  </Typography>
                  {showTestStats(
                    suite.tests_passed,
                    suite.tests_failed,
                    suite.tests_incomplete,
                    suite.tests_skipped,
                    statsArray
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  {/* Expandable tests list for each suite */}
                  <List key={suite.test_suite_history_id} dense>
                    {suite.tests.map(test => (
                      <a
                        key={test.test_history_id}
                        href="#page-top"
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <ListItem
                          button
                          key={test.test_history_id}
                          onClick={() => changeRightSide(test, test.test_id)}
                          className={setTextLineStyle(test.test_id === highlightedTest, darkMode)}
                          >
                          {showStatusIcon(test.status)}
                          <Typography  className={darkMode ? classes.nameOfTestOrSuiteDark : classes.nameOfTestOrSuiteLight}>
                            {test.name}
                          </Typography>
                          {/* if resolution for the current run exists - show it, otherwise - show the general resolution for this test */}
                          {test.test_history_resolution ? (
                            showResolutionText(test.test_history_resolution, darkMode)
                          ) : (
                            showResolutionText(test.test_resolution, darkMode)
                          )}
                        </ListItem>
                      </a>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          float: "left",
          width: "45%",
          overflow: "hidden",
        }}
      >
        {/* right-hand side for test info */}
        <TestExpanded darkMode={darkMode}>{testInfoSection}</TestExpanded>
      </div>
    </div>
  )
}
