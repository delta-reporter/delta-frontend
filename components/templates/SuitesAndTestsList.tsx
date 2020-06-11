import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { SuiteAndTest } from "../../pages/index"
import { showStatusIcon, showTestStats } from "../templates"

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  List,
  ExpansionPanelDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { TestsList } from "./TestsList"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 3500,
  },
  suiteStatus: {
    paddingLeft: theme.spacing(4),
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}))

type Props = {
  children: SuiteAndTest[]
}

export const SuitesAndTestsList = function(props: Props) {
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

  function getTestName(testName) {
    if (testName.includes(":")) {
      return testName.split(":")[1]
    } else return testName
  }

  return (
    <div>
      {children.map(testRun => (
        <div key={testRun.test_run_id}>
          {testRun.test_suites.map(suite => (
            <ExpansionPanel
              key={suite.test_suite_history_id}
              expanded={expandedSuite === suite.name}
              onChange={expandCollapseSuite(suite.name)}
              TransitionProps={{ unmountOnExit: true }}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
              >
                {showStatusIcon(suite.test_suite_status)}
                <Typography className={classes.suiteStatus} color="textPrimary">
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
                <List
                  key={suite.test_suite_history_id}
                  className={classes.root}
                  dense
                >
                  <TestsList>{suite.tests}</TestsList>
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </div>
      ))}
    </div>
  )
}
