import { Typography, Container } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { BasePage } from "../components/templates/BasePage"

const useStyles = makeStyles(theme => ({
  root: {},
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))

type Props = {
  httpStatusCode: number
}

function Error(props: Props) {
  const { httpStatusCode } = props
  const classes = useStyles(props)
  return (
    <BasePage className={classes.root} darkMode={false}>
      <Container className={classes.container}>
        <Typography component="h3" variant="h6" color="error" gutterBottom>
          {" "}
          Http status code {httpStatusCode} error
        </Typography>
      </Container>
    </BasePage>
  )
}

/**
 * Server side rendering
 */
Error.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { res, store } = ctx

  const pagePayload: IPagePayload = {
    selectedPage: Page.ERROR,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    httpStatusCode: res.statusCode,
  }
}

export default Error
