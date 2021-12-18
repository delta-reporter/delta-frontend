import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Typography from '@material-ui/core/Typography';
import getTestHistory from '../../../data/TestsHistory';
import { Accordion, AccordionDetails, AccordionSummary, Container } from '@material-ui/core';
import { showDateText, showResolutionText, showStatusText, TestErrorMessageAccordion, TestMediaAccordion } from '..';


const useStyles = makeStyles((theme) => ({
  textColorDarkMode: {
    color: theme.palette.secondary.light,
  },
  textColorLightMode: {
  },
  container: {
    maxHeight: 400,
  },
}))

interface TestDetailMostProps {
  mother_test_id: number
  darkMode: boolean
}


export const TestDetail = function(props: TestDetailMostProps) {

  const classes = useStyles(props);
  const { mother_test_id, darkMode} = props;

  function getBackgroundColor(darkMode) {
    if (darkMode) return "#2a2a2a"
    else return "white"
  }

  function getTextColor(darkMode) {
    if (darkMode) return "#8c8d8d"
    else return "black"
  }

  const { loading, noData, test_history } = getTestHistory(mother_test_id)

  const [
    historicalTestsExpandedPanel,
    setHistoricalTestsExpandedPanel,
  ] = React.useState<string | false>(false)
  const expandCollapsePanel = (historicalTestsPanel: string) => (
    _event: React.ChangeEvent<unknown>,
    isExpanded: boolean
  ) => {
    setHistoricalTestsExpandedPanel(isExpanded ? historicalTestsPanel : false)
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
        No data available for this test...
        </Typography>
      </div>
    )
  } else {
    return (
      <>
        <div>
        {" "}
        {loading
            ? "Loading tests failing the most..."
            :
            <div>
            {
              test_history.map(test => (
                <Accordion
                  key={test.test_history_id}
                  expanded={historicalTestsExpandedPanel === test.test_history_id}
                  onChange={expandCollapsePanel(test.test_history_id)}
                  TransitionProps={{ unmountOnExit: true }}
                  style={{
                    backgroundColor: getBackgroundColor(darkMode),
                    color: getTextColor(darkMode),
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                      {showStatusText(test.status, darkMode)}{" "}
                      {showDateText(test.end_datetime, darkMode)}
                      {showResolutionText(test.resolution, darkMode, false)}{" "}
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
              )
              )
              }
            </div>
        }
        {" "}
        </div>
      </>
    )
  }
}
