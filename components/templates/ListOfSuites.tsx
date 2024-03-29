import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { showStatusIcon, showTestStats, TestExpanded, ListOfTests } from "."
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  List,
  Tooltip,
  FormControlLabel,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import UseAnimations from "react-useanimations"
import getTestSuites from "../../data/TestSuites"

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
    color: theme.palette.secondary.light,
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
    backgroundColor: theme.palette.secondary.main,
    border: "1px grey solid",
  },
  testBackgroundDark: {
    backgroundColor: theme.palette.secondary.main,
  },
  greyTick: {
    color: "#d4d3d3",
  },
}))

type Props = {
  test_run_id: number
  project_id: number
  environment: string
  stats
  darkMode: boolean
}

export const ListOfSuites = function(props: Props) {
  const { test_run_id, project_id, environment, stats, darkMode } = props
  const { loading, noData, testSuites } = getTestSuites(
    test_run_id,
    stats.toString()
  )

  const classes = useStyles(props)
  const [testInfoSection, setTestInfoSection] = useState(["No test selected"])
  const [highlightedTest, setHighlightedTest] = useState(0)

  function changeRightSide(value, testId) {
    setTestInfoSection(value)
    setHighlightedTest(testId)
  }

  function setStats() {
    const settingStats = []
    if (stats.includes("2")) settingStats.push("passed")

    if (stats.includes("1")) settingStats.push("failed")

    if (stats.includes("4")) settingStats.push("incomplete")

    if (stats.includes("3")) settingStats.push("running")

    if (stats.includes("5")) settingStats.push("skipped")

    return settingStats
  }
  const statsArray = setStats()

  const [expandedSuite, setExpandedSuite] = useState<string | false>(false)
  const expandCollapseSuite = (suitePanel: string) => (
    _event: React.ChangeEvent<unknown>,
    isExpanded: boolean
  ) => {
    setExpandedSuite(isExpanded ? suitePanel : false)
  }

  if (noData) {
    return (
      <div>
        <Typography
          style={{
            fontStyle: "italic",
            margin: "20px",
            color: "grey",
          }}
        >
          No test results yet. They either take some time to load or there are
          no matching tests for this filter
        </Typography>
      </div>
    )
  } else {
    return (
      <div>
        {" "}
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
          {" "}
          {loading
            ? "Loading test suites ..."
            : testSuites.map(suite => (
                <Accordion // list of expandable suites
                  key={suite.test_suite_history_id}
                  expanded={expandedSuite === suite.name}
                  onChange={expandCollapseSuite(suite.name)}
                  TransitionProps={{ unmountOnExit: true }}
                  className={
                    darkMode ? classes.backgroundDark : classes.backgroundWhite
                  }
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    {" "}
                    {showStatusIcon(suite.test_suite_status)}
                    <Typography
                      className={
                        darkMode
                          ? classes.nameOfTestOrSuiteDark
                          : classes.nameOfTestOrSuiteLight
                      }
                    >
                      {" "}
                      {suite.name}{" "}
                    </Typography>
                    {showTestStats(
                      suite.tests_passed,
                      suite.tests_failed,
                      suite.tests_incomplete,
                      suite.tests_skipped,
                      statsArray
                    )}
                    <FormControlLabel
                      aria-label="Reviewed"
                      onClick={event => event.stopPropagation()}
                      // to stop accordion from expanding
                      onFocus={event => event.stopPropagation()}
                      control={
                        <Tooltip title="Mark suite as reviewed">
                          <UseAnimations
                            animationKey="checkbox"
                            style={{
                              position: "absolute",
                              right: "55px",
                              width: "20px",
                            }}
                            className={classes.greyTick}
                          />
                        </Tooltip>
                      }
                      label=""
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    {" "}
                    {/* Expandable tests list for each suite */}
                    <List key={suite.test_suite_history_id} dense>
                      <ListOfTests
                        showTest={changeRightSide}
                        highlightedTest={highlightedTest}
                        darkMode={darkMode}
                        stats={stats.toString()}
                        test_suite_history_id={suite.test_suite_history_id}
                      ></ListOfTests>
                    </List>
                  </AccordionDetails>
                </Accordion>
              ))}{" "}
        </div>
        <div
          style={{
            float: "left",
            width: "45%",
            overflow: "hidden",
          }}
        >
          {/* right-hand side for test info */}
          <TestExpanded
            darkMode={darkMode}
            project_id={project_id}
            environment={environment}
          >
            {testInfoSection}
          </TestExpanded>
        </div>
      </div>
    )
  }
}
