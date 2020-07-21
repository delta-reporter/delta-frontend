import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  showStatusIcon,
  showTestStats,
  TestExpanded,
} from "../../components/templates"
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
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
  nameOfTestOrSuite: {
    paddingLeft: theme.spacing(4),
    fontSize: "0.875rem",
    textAlign: "left",
    fontFamily: "Roboto",
    fontWeight: 400,
  },
  backgroundGrey: {
    backgroundColor: "#d6d6d6",
  },
  backgroundWhite: {
    backgroundColor: "white",
  },
}))

type Props = {
    children: SuiteAndTest[]
}

export const ListOfSuites = function(props: Props) {
  const { children } = props
  const classes = useStyles(props)
  const [testInfoSection, setTestInfoSection] = useState(["No test selected"])
  const [highlightedTest, setHighlightedTest] = useState(0)

  function changeRightSide(value, testId) {
    setTestInfoSection(value)
    setHighlightedTest(testId)
  }

  const [expandedSuite, setExpandedSuite] = React.useState<string | false>(
    false
  )
  const expandCollapseSuite = (suitePanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedSuite(isExpanded ? suitePanel : false)
  }

  return (
    <div>
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
          <div key={testRun.test_run_id}>
            {testRun.test_suites.map(suite => (
              <ExpansionPanel
                key={suite.test_suite_history_id}
                expanded={expandedSuite === suite.name}
                onChange={expandCollapseSuite(suite.name)}
                TransitionProps={{ unmountOnExit: true }}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  {showStatusIcon(suite.test_suite_status)}
                  <Typography className={classes.nameOfTestOrSuite}>
                    {suite.name}
                  </Typography>
                  {showTestStats(
                    suite.tests_passed,
                    suite.tests_failed,
                    suite.tests_incomplete,
                    suite.tests_skipped
                  )}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  {/* Expanded tests list for each suite */}
                  <List key={suite.test_suite_history_id} dense>
                    {suite.tests.map(test => (
                      <ListItem
                        button
                        key={test.test_history_id}
                        onClick={() => changeRightSide(test, test.test_id)}
                        className={
                          test.test_id === highlightedTest
                            ? classes.backgroundGrey
                            : classes.backgroundWhite
                        }
                      >
                        {showStatusIcon(test.status)}
                        <Typography className={classes.nameOfTestOrSuite}>
                          {test.name}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
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
        <TestExpanded>{testInfoSection}</TestExpanded>
      </div>
    </div>
  )
}
