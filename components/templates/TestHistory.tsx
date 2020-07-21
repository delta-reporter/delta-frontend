import React from "react"
import useSWR from "swr"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel"
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import Container from "@material-ui/core/Container"
import { Typography, withStyles } from "@material-ui/core"
import {
  showStatusText,
  showResolutionText,
  showDateText,
  TestErrorMessageExpansionPanel,
  TestMediaExpansionPanel,
} from "."

const fetcher = url => fetch(url).then(res => res.json())

const ExpandablePanel = withStyles({
  root: {
    width: "100%",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiExpansionPanel)

const CollapsedLineSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
    width: "100%",
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary)

const PanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    width: "100%",
  },
}))(MuiExpansionPanelDetails)

export const HistoricalTests = function(testId) {
  const { data, error } = useSWR(
    `${process.env.publicDeltaCore}/api/v1/test_history/test_id/${testId.children}`,
    fetcher
  )

  const loading = !data && !error
  const noData = !data
  const [
    historicalTestsExpandedPanel,
    setHistoricalTestsExpandedPanel,
  ] = React.useState<string | false>(false)
  const expandCollapsePanel = (historicalTestsPanel: string) => (
    _event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setHistoricalTestsExpandedPanel(isExpanded ? historicalTestsPanel : false)
  }

  if (noData) {
    return (
      <Typography
        align="center"
        variant="subtitle2"
        style={{
          paddingTop: "1em",
          paddingBottom: "1em",
          color: "#48D1CC",
          margin: "5px",
          border: "1px #48D1CC solid",
          backgroundColor: "white",
        }}
      >
        No historical data was found
      </Typography>
    )
  } else {
    return (
      <div style={{ paddingTop: "10px" }}>
        {loading
          ? "Loading historical tests..."
          : data.map(test => (
              <ExpandablePanel
                key={test.test_history_id}
                expanded={historicalTestsExpandedPanel === test.test_history_id}
                onChange={expandCollapsePanel(test.test_history_id)}
                TransitionProps={{ unmountOnExit: true }}
                style={{
                  backgroundColor: "#F3EFEE", // media block  expandable color
                  borderBottom: "1px solid #F3EFEE",
                }}
              >
                <CollapsedLineSummary
                  expandIcon={<ExpandMoreIcon />}
                  style={{
                    backgroundColor: "#F3EFEE", // media block collapsed color
                    borderBottom: "1px solid #F3EFEE",
                  }}
                >
                  <Typography color="textPrimary">
                    {showStatusText(test.status)}{" "}
                    {showResolutionText(test.resolution)}{" "}
                    {showDateText(test.end_datetime)}
                  </Typography>
                </CollapsedLineSummary>
                <PanelDetails>
                  <Container maxWidth="sm">
                    {test.error_type ? (
                      <Typography
                        align="center"
                        variant="subtitle2"
                        style={{
                          paddingTop: "1em",
                          paddingBottom: "1em",
                          color: "#C71585",
                          margin: "5px",
                          border: "1px #C71585 solid",
                          backgroundColor: "white",
                        }}
                      >
                        {test.error_type}
                      </Typography>
                    ) : (
                      <div></div>
                    )}
                    {test.trace ? (
                      <TestErrorMessageExpansionPanel>
                        {test}
                      </TestErrorMessageExpansionPanel>
                    ) : (
                      <div></div>
                    )}
                    {test.media ? (
                      <TestMediaExpansionPanel key={test.file_id}>
                        {test}
                      </TestMediaExpansionPanel>
                    ) : (
                      <div></div>
                    )}
                  </Container>
                </PanelDetails>
              </ExpandablePanel>
            ))}
      </div>
    )
  }
}
