import React from "react"
import useSWR from "swr"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Container from "@material-ui/core/Container"
import {
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Tooltip,
} from "@material-ui/core"
import {
  showStatusText,
  showResolutionText,
  showDateText,
  TestErrorMessageExpansionPanel,
  TestMediaExpansionPanel,
} from "."

const fetcher = url => fetch(url).then(res => res.json())

interface TestProps {
  children: any
}

export const HistoricalTests = function(props: TestProps) {
  const { children } = props

  const { data, error } = useSWR(
    `${process.env.publicDeltaCore}/api/v1/test_history/test_id/${children.test_id}`,
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
              <ExpansionPanel
                key={test.test_history_id}
                expanded={historicalTestsExpandedPanel === test.test_history_id}
                onChange={expandCollapsePanel(test.test_history_id)}
                TransitionProps={{ unmountOnExit: true }}
              >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography color="textPrimary">
                    {showStatusText(test.status)}{" "}
                    {showDateText(test.end_datetime)}
                    {showResolutionText(test.resolution)}{" "}
                    {test.test_history_id === children.test_history_id ? ( // if it's current test - show the badge 
                      <Tooltip title="Current test">
                        <button
                          style={{
                            margin: "5px",
                            border: "none",
                            backgroundColor: "#ece6e6",
                          }}
                        >
                          Current test{" "}
                        </button>
                      </Tooltip>
                    ) : (
                      <div></div>
                    )}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
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
                      <div>Happy days :)</div>
                    )}
                    {test.media ? (
                      <TestMediaExpansionPanel key={test.file_id}>
                        {test}
                      </TestMediaExpansionPanel>
                    ) : (
                      <div></div>
                    )}
                  </Container>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
      </div>
    )
  }
}
