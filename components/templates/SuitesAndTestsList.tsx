import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Test } from "../../pages/index"
import { TestInfoSection } from "../templates"

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  List,
  ListItem,
  ExpansionPanelDetails,
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
  children: Test[]
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

  return (
    <div>
      {children.map(testRun => (
        <div key={testRun.id}>
          {testRun.test_suites.map(suite => (
            <ExpansionPanel
              key={suite.id}
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
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {/* Expanded tests list for each suite */}
                <List key={suite.id} className={classes.root} dense>
                  {suite.tests.map(test => (
                    <ListItem key={test.id} className={classes.root}>
                      <ExpansionPanel
                        className={classes.root}
                        key={test.id}
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