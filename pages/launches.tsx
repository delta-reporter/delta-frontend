import { Link, Divider, List, ListItem, ListItemText } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { HeaderArticleContainer } from "../components/organisms"
import { Dashboard } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { TestLaunch } from "."

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    counter: {
      margin: 10,
    },
    title: {
      fontSize: "2em",
    },
  })
)

type Props = {
  test_launches: TestLaunch[]
}

function Launches(props: Props) {
  const classes = useStyles(props)

  return (
    <Dashboard className={classes.root}>
      <HeaderArticleContainer>
        <List component="nav">
          {props.test_launches.map(launch => (
            <div>
              <ListItem button>
                <Link href="http://localhost:3000/testsuites">
                  <ListItemText primary={launch.name} />
                  <br />
                  {launch.launch_status}
                </Link>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </HeaderArticleContainer>
    </Dashboard>
  )
}

/**
 * Server side rendering
 */
Launches.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx

  const launchesReq = await fetch(
    "http://delta_core_service:5000/get_launches",
    {
      method: "POST",
    }
  )
  const launches = await launchesReq.json()

  const pagePayload: IPagePayload = {
    selectedPage: Page.LAUNCHES,
  }
  store.dispatch({
    type: PageActions.changePage.toString(),
    payload: pagePayload,
  })
  return {
    test_launches: launches,
  }
}

export default Launches
