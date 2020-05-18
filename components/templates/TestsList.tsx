import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Test } from "../../pages/index"
import { TestInfoSection } from "../templates"

import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ListItem,
  List,
  ExpansionPanelDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import CloseIcon from "@material-ui/icons/Close"

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

export const TestsList = function(props: Props) {
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
      <List>
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
                <CloseIcon
                  style={{
                    color: "red",
                  }}
                ></CloseIcon>
                <Typography className={classes.suiteStatus} color="textPrimary">
                  {test.name}
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <TestInfoSection>{test}</TestInfoSection>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </ListItem>
        ))}
      </List>
    </div>
  )
}
