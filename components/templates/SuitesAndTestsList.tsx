import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { SuiteAndTest } from "../../pages/index"
import { TestInfoSection } from "../templates"

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  List,
  ListItem,
  ExpansionPanelDetails,
  Tooltip,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import TripOriginIcon from "@material-ui/icons/TripOrigin"
import UseAnimations from "react-useanimations"

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

  function showStats(passed, failed, incomplete, skipped) {
    return (
      <div style={{ position: "absolute", right: "120px" }}>
        {passed !== 0 ? (
          <Tooltip title="Passed">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "green",
                color: "green",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {passed}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
        {failed !== 0 ? (
          <Tooltip title="Failed">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "red",
                color: "red",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {failed}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
        {incomplete !== 0 ? (
          <Tooltip title="Incomplete">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "orange",
                color: "orange",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {incomplete}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
        {skipped !== 0 ? (
          <Tooltip title="Skipped">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "grey",
                color: "grey",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {skipped}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
      </div>
    )
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
                {setStatusColor(suite.test_suite_status)}
                <Typography className={classes.suiteStatus} color="textPrimary">
                  {suite.name}
                </Typography>
                {showStats(
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
                  {suite.tests.map(test => (
                    <ListItem
                      key={test.test_history_id}
                      className={classes.root}
                    >
                      <ExpansionPanel
                        className={classes.root}
                        key={test.test_history_id}
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
                            {getTestName(test.name)}
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <TestInfoSection>{test}</TestInfoSection>
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
