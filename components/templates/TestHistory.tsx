import React from "react"
import useSWR from "swr"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Container from "@material-ui/core/Container"
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
} from "@material-ui/core"
import {
  showStatusText,
  showResolutionText,
  showDateText,
  TestErrorMessageAccordion,
  TestMediaAccordion,
} from "."

const fetcher = url => fetch(url).then(res => res.json())

interface TestProps {
  children: any
  darkMode: boolean
}

export const HistoricalTests = function(props: TestProps) {
  const { children, darkMode } = props

  function getBackgroundColor(darkMode) {
    if(darkMode) return "#2a2a2a"
    else return "white"
  }

  function getTextColor(darkMode) {
    if(darkMode) return "#8c8d8d"
    else return "black"
  }

  const { data, error } = useSWR(
    `${process.env.publicDeltaCore}/api/v1/test_history/test_id/${children.mother_test_id}`,
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
              <Accordion
                key={test.test_history_id}
                expanded={historicalTestsExpandedPanel === test.test_history_id}
                onChange={expandCollapsePanel(test.test_history_id)}
                TransitionProps={{ unmountOnExit: true }}
                style={{backgroundColor: getBackgroundColor(darkMode), color: getTextColor(darkMode)}}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    {showStatusText(test.status, darkMode)}{" "}
                    {showDateText(test.end_datetime, darkMode)}
                    {showResolutionText(test.resolution, darkMode, false)}{" "}
                    {test.test_history_id === children.test_id ? ( // if it's current test - show the badge 
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
                </AccordionSummary>
                <AccordionDetails>
                  <Container maxWidth="sm">
                    {test.trace ? (
                      <TestErrorMessageAccordion>
                        {test}
                      </TestErrorMessageAccordion>
                    ) : (
                      <div>Happy days :)</div>
                    )}
                    {test.media ? (
                      <TestMediaAccordion key={test.file_id}>
                        {test}
                      </TestMediaAccordion>
                    ) : (
                      <div></div>
                    )}
                  </Container>
                </AccordionDetails>
              </Accordion>
            ))}
      </div>
    )
  }
}
