import React, {useState} from "react"
import {makeStyles} from "@material-ui/core/styles"
import {showStatusIcon, showResolutionText} from "."
import {
    Typography,
    ListItem
} from "@material-ui/core"
import useSocket from '../../hooks/useSocket'
import { Test } from "../../pages"

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
    test => test.test_id === testResolution.test_id);
    if (filteredTest){
      let testIndex = tests.indexOf(filteredTest);
      if (filteredTest.test_history_id == testResolution.test_history_id){
        filteredTest.test_history_resolution = testResolution.test_history_resolution
        updateTest(testIndex, filteredTest)
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
      key={test.test_history_id}
      href="#page-top"
      style={{ textDecoration: "none", color: "black" }}
    >
      <ListItem
        button
        key={test.test_history_id}
        onClick={() => showTest(test, test.test_id)}
        className={setTextLineStyle(test.test_id === highlightedTest, darkMode)}
        >
        {showStatusIcon(test.status)}
        <Typography  className={darkMode ? classes.nameOfTestOrSuiteDark : classes.nameOfTestOrSuiteLight}>
          {test.name}
        </Typography>
        {/* if resolution for the current run exists - show it, otherwise - show the general resolution for this test */}
        {test.test_history_resolution != 1? (
          showResolutionText(test.test_history_resolution, darkMode)
        ) : (
          showResolutionText(test.test_resolution, darkMode)
        )}
      </ListItem>
    </a>
    ))}
    </div>
)}
