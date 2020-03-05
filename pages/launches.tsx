import {
  Container,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Link,
  Typography,
} from "@material-ui/core" // Link, Divider, List, ListItem, ListItemText,
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { BasePage } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { TestLaunch } from "."

const useStyles = makeStyles(theme => ({
  root: {},
  counter: {
    margin: 10,
  },
  title: {
    fontSize: "2em",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
}))

type Props = {
  test_launches: TestLaunch[]
}

function Launches(props: Props) {
  const classes = useStyles(props)

  return (
    <BasePage className={classes.root}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Recent Launches
              </Typography>{" "}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.test_launches.map(launch => (
                    <TableRow key={launch.id} hover>
                      {/* <Link underline="none" href="http://localhost:3000/testsuites"> </Link> */}
                      <TableCell>12:00 Mar 2</TableCell>
                      <TableCell>{launch.name}</TableCell>
                      <TableCell>Release</TableCell>
                      <TableCell>34 min</TableCell>
                      <TableCell>{launch.launch_status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className={classes.seeMore}>
                <Link color="primary" href="#">
                  See more launches
                </Link>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BasePage>
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
      method: "GET",
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
