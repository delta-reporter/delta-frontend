import React from "react"
import { Button, ButtonGroup } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import PropTypes from "prop-types"

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
  },
  backgroundGrey: {
    backgroundColor: "#adb1b6",
  },
  backgroundWhite: {
    backgroundColor: "#d4dbe3",
  },
}))

const Pagination = ({
  itemsPerPage,
  totalNumber,
  paginate,
  highlightedTest,
}) => {
  const pageNumbers = []
  const classes = useStyles(itemsPerPage)

  for (let i = 1; i <= Math.ceil(totalNumber / itemsPerPage); i++) {
    if (i > 29) break
    pageNumbers.push(i)
  }

  return (
    <div style={{ marginTop: "15px" }}>
      <ButtonGroup className={classes.paper}>
        {pageNumbers.map(num => (
          <Button
            key={num}
            onClick={() => paginate(num)}
            className={
              highlightedTest === num
                ? classes.backgroundGrey
                : classes.backgroundWhite
            }
          >
            {num}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  )
}

Pagination.propTypes = {
  itemsPerPage: PropTypes.number,
  totalNumber: PropTypes.number,
  paginate: PropTypes.any,
  highlightedTest: PropTypes.number,
}

export default Pagination
