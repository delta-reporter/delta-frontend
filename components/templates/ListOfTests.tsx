import React, {useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import {showStatusIcon, showResolutionText} from "."
import {
    Typography,
    ListItem,
    Tooltip
} from "@material-ui/core"
import useSocket from '../../hooks/useSocket'
import { Test } from "../../pages"
import WarningIcon from '@material-ui/icons/Warning'

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        maxWidth: 3500
    },
    title: {
        fontSize: "2em"
    },
    container: {
        paddingTop: theme.spacing(4),
        maxWidth: 3400,
        paddingBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column"
    },
    padding: {
        marginBottom: "5px",
        marginLeft: "80%",
        color: "#353690"
    },
    nameOfTestOrSuiteDark: {
        paddingLeft: theme.spacing(4),
        fontSize: "0.875rem",
        textAlign: "left",
        fontFamily: "Roboto",
        fontWeight: 400,
        wordBreak: "break-all",
        whiteSpace: "pre-wrap",
        color: theme.palette.secondary.light
    },
    nameOfTestOrSuiteLight: {
        paddingLeft: theme.spacing(4),
        fontSize: "0.875rem",
        textAlign: "left",
        fontFamily: "Roboto",
        fontWeight: 400,
        wordBreak: "break-all",
        whiteSpace: "pre-wrap"
    },
    backgroundGrey: {
        backgroundColor: "#d6d6d6"
    },
    backgroundDarkGrey: {
        backgroundColor: "#474747"
    },
    backgroundWhite: {
        backgroundColor: "white"
    },
    backgroundDark: {
        backgroundColor: theme.palette.secondary.main,
        border: "1px grey solid"
    },
    testBackgroundDark: {
        backgroundColor: theme.palette.secondary.main
    }
}))


type Props = {
  showTest: Function
  highlightedTest: number
  children: Test[]
  darkMode: boolean
}

export const ListOfTests = function (props : Props) {
const {showTest, highlightedTest, children, darkMode} = props
const classes = useStyles(props)
const [tests, setTests] = useState(children || [])

function setTextLineStyle(isHighlighted, darkMode) {
    if (isHighlighted && ! darkMode)  // light mode - highlighted
        return classes.backgroundGrey
     else if (isHighlighted && darkMode)  // dark mode - highlighted
        return classes.backgroundDarkGrey
     else if (isHighlighted && ! darkMode)  // light mode - not highlighted
        return classes.backgroundWhite
     else if (! isHighlighted && darkMode)  // dark mode - not highlighted
        return classes.testBackgroundDark
}

const updateTest = (index, test) => {
  const newTests = [...tests];
  newTests[index] = test;
  setTests(newTests);
}

useSocket('delta_resolution', testResolution => {
  let filteredTest = tests.find(
    test => test.mother_test_id === testResolution.test_id);

    // We first verify that a test with the same test_id exists
    if (filteredTest){
      let testIndex = tests.indexOf(filteredTest);

      // If the test as the same test_history_is we update it right away
      if (filteredTest.test_id == testResolution.test_id){
        filteredTest.test_history_resolution = testResolution.test_history_resolution
        updateTest(testIndex, filteredTest)

      // Otherwise, we just update if the matched test, doesn't have a test_history_resolution yet
      // In the other words, we set the latest resolution regardless of the current run
      } else if (filteredTest.test_history_resolution == 1 || !filteredTest.test_history_resolution){
        filteredTest.test_resolution = testResolution.test_resolution
        updateTest(testIndex, filteredTest)
      }
    }
})

return(
  <div>
    {tests.map(test => (
      <a
      key={test.test_id}
      href="#page-top"
      style={{ textDecoration: "none", color: "black" }}
    >
      <ListItem
        button
        key={test.test_id}
        onClick={() => showTest(test, test.mother_test_id)}
        className={setTextLineStyle(test.mother_test_id === highlightedTest, darkMode)}
        >
          {showStatusIcon(test.status)}
          {test.is_flaky ? (
            <Tooltip title="Flaky test. Failed more than 5 out of 10 times.">
              <WarningIcon style={{color: "red", width:"30px"}}></WarningIcon>  
            </Tooltip>
          ) : (
            <></>
          )}
          <Typography  className={darkMode ? classes.nameOfTestOrSuiteDark : classes.nameOfTestOrSuiteLight}>
            {test.name}
          </Typography>
          {/* if resolution for the current run exists - show it, otherwise - show the historical resolution inherited from previous results */}
          {test.test_history_resolution != 1? (
            <>
            {showResolutionText(test.test_history_resolution, darkMode, false)}
            </>
          ) : (
            showResolutionText(test.test_resolution, darkMode, true)
          )}
      </ListItem>
    </a>
    ))}
    </div>
)}
