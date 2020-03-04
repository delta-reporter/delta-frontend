import { Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { SpacingPaper } from "../components/atoms"
import { HeaderArticleContainer } from "../components/organisms"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { Dashboard } from "../components/templates/Dashboard"

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {},
  })
)

type Props = {
  httpStatusCode: number
}

function Error(props: Props) {
  const { httpStatusCode } = props
  const classes = useStyles(props)
  return (
    <Dashboard className={classes.root}>
      <HeaderArticleContainer>
        <SpacingPaper>
          <Typography variant="h5">
            Http status code {httpStatusCode} error !
          </Typography>
        </SpacingPaper>
      </HeaderArticleContainer>
    </Dashboard>
  )
}

/**
 * Server side rendering
 */
Error.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { res, store } = ctx

  const pagePayload: IPagePayload = {
    selectedPage: Page.TOP,
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
