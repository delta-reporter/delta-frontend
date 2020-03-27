import { Paper, Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { useSelector } from "react-redux"
import { selectedPageSelector } from "../../store/page"
import { Page } from "../../constants"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    headerContainer: {
      backgroundColor: theme.palette.primary.light,
      padding: theme.spacing(5),
      textAlign: "center",
    },
    title: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "3em",
      padding: theme.spacing(1),
    },
    description: {},
  })
)

type Props = {}

/**
 * Page header component
 * @param props Props
 */
export const PageHeader = function(props: Props) {
  const classes = useStyles(props)
  const selectedPage = useSelector(selectedPageSelector)
  return (
    <div>
      {/* show blue wide header only on info pages */}
      {selectedPage === Page.TOP ? (
        <div className={classes.root}>
          <h1> </h1>{" "}
        </div>
      ) : (
        <Paper square={true} className={classes.headerContainer}>
          <Typography variant="h1" color="inherit" className={classes.title}>
            {selectedPage.pageTitle}
          </Typography>
          <Typography
            variant="subtitle1"
            color="inherit"
            className={classes.description}
          >
            {selectedPage.pageDescription}
          </Typography>
        </Paper>
      )}
    </div>
  )
}
