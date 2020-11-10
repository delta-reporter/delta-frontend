import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import {showStatusIcon, showResolutionText} from "."
import {
    Typography,
    ListItem
} from "@material-ui/core"
import getTests from "../../data/Tests"

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
  darkMode: boolean
  stats: string
  test_suite_history_id: number
}

export const ListOfTests = function (props : Props) {
const {showTest, highlightedTest, darkMode, stats, test_suite_history_id} = props
const classes = useStyles(props)
const { loading, noData, tests, mutate } = getTests(test_suite_history_id, stats);

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

if (noData) {
  return (
      <div>
      <Typography
        style={{
          fontStyle: "italic",
          margin: "20px",
          color: "#d62727",
        }}
      >
        Sorry, there are no matching tests for this suite
      </Typography>
    </div>
  )
} else {
  return(
    <div>
      {loading
          ? "Loading tests..."
      : tests.map(test => (
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
            {showStatusIcon(test.status, test.is_flaky)}
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
      ))
      }
      </div>
  )}
          }
