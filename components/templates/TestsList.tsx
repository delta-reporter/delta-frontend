import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Test } from "../../pages/index"
import { TestExpanded, showStatusIcon, showTestStats } from "../templates"

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ListItem,
  ExpansionPanelDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

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

export const TestsList = function(props) {
  const { children } = props
  const classes = useStyles(props)

  const [expandedTest, setExpandedTest] = React.useState<string | false>(false)
  const expandCollapseTest = (testPanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedTest(isExpanded ? testPanel : false)
  }

  return (
    <div>
      {children.map(test => (
        <ListItem key={test.test_history_id} className={classes.root}>
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
              {showStatusIcon(test.status)}
              <Typography className={classes.suiteStatus} color="textPrimary">
                {test.name}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TestExpanded>{test}</TestExpanded>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </ListItem>
      ))}
    </div>
  )
}
