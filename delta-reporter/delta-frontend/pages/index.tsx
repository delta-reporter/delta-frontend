import { Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import { AppContext } from "../components/AppContext"
import { SpacingPaper } from "../components/atoms"
import { HeaderArticleContainer } from "../components/organisms"
import { Layout } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((_: Theme) =>
  createStyles({
    root: {},
  })
)

type Props = {}

function Index(props: Props) {
  const classes = useStyles(props)
  return (
    <Layout className={classes.root}>
      <HeaderArticleContainer>
        <SpacingPaper>
          <Typography variant="h5">
            Each service its running isolated from each other, so its possible
            to scale each of them based on the demand.
          </Typography>
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">WebSockets Service</Typography>
          <Typography variant="h6">
            <Link href="http://localhost:5000/">
              <a>WebSockets Info Page</a>
            </Link>
          </Typography>
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Launcher Service</Typography>
          <Typography variant="h6">
            <Link href="http://localhost:5001/">
              <a>Launcher Info Page</a>
            </Link>
            <br/>
            <Link href="http://localhost:5001/launches">
              <a>Launcher Endpoint Example</a>
            </Link>
          </Typography>
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Projects Service</Typography>
          <Typography variant="h6">
            <Link href="http://localhost:5002/">
              <a>Projects Info Page</a>
            </Link>
            <br/>
            <Link href="http://localhost:5002/projects">
              <a>Projects Endpoint Example</a>
            </Link>
          </Typography>
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Tests Service</Typography>
          <Typography variant="h6">
            <Link href="http://localhost:5003/">
              <a>Tests Info Page</a>
            </Link>
            <br/>
            <Link href="http://localhost:5003/tests">
              <a>Tests Endpoint Example</a>
            </Link>
          </Typography>
        </SpacingPaper>

        <SpacingPaper noPadding>
          <Typography variant="h5">Test Suites Service</Typography>
          <Typography variant="h6">
            <Link href="http://localhost:5004/">
              <a>Test Suites Info Page</a>
            </Link>
            <br/>
            <Link href="http://localhost:5004/testsuites">
              <a>Test Suites Endpoint Example</a>
            </Link>
          </Typography>
        </SpacingPaper>
      </HeaderArticleContainer>
    </Layout>
  )
}

/**
 * Server side rendering
 */
Index.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx

  const pagePayload: IPagePayload = {
    selectedPage: Page.TOP,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {}
}

export default Index
