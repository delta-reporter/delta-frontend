import React from "react"
import { Button, ButtonGroup, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  root: {},
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
  },
}))

const Pagination = ({ itemsPerPage, totalNumber, paginate }) => {
  const pageNumbers = []
  const classes = useStyles(itemsPerPage)

  for (let i = 1; i <= Math.ceil(totalNumber / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <Paper>
      <ButtonGroup
        className={classes.paper}
        color="primary"
        aria-label="outlined primary button group"
      >
        {pageNumbers.map(num => (
          <Button key={num} onClick={() => paginate(num)} className="page-link">
            {num}
          </Button>
        ))}
      </ButtonGroup>
    </Paper>
  )
}
export default Pagination
