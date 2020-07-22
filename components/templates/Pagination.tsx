import React from "react"
import { Button, ButtonGroup } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
  },
  backgroundGrey: {
    backgroundColor: "#d6d6d6",
  },
  backgroundWhite: {
    backgroundColor: "white",
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
    pageNumbers.push(i)
  }

  return (
    <div style={{ marginTop: "15px", width: "max-content" }}>
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
export default Pagination
