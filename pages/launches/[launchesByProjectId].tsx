import fetch from "isomorphic-unfetch"
import { makeStyles } from "@material-ui/core/styles"
import { BasePage } from "../../components/templates/BasePage"
import { TestLaunch } from "../index"
import {
  Container,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Link,
  Breadcrumbs,
} from "@material-ui/core"
import TripOriginIcon from "@material-ui/icons/TripOrigin"
import UseAnimations from "react-useanimations"

const useStyles = makeStyles(theme => ({
  root: {},
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
}))

function setStatusColor(status) {
  let statusIcon
  if (/.*(\w*ass\w*)\b/.test(status)) {
    statusIcon = (
      <TripOriginIcon
        style={{
          color: "green",
        }}
      ></TripOriginIcon>
    )
  } else if (/.*(\w*ail\w*)\b/.test(status)) {
    statusIcon = (
      <TripOriginIcon
        style={{
          color: "red",
        }}
      ></TripOriginIcon>
    )
  } else if (/.*(\w*kip\w*)\b/.test(status)) {
    statusIcon = (
      <TripOriginIcon
        style={{
          color: "grey",
        }}
      ></TripOriginIcon>
    )
  } else if (/.*(\w*ess\w*)\b/.test(status)) {
    statusIcon = (
      <UseAnimations
        animationKey="loading"
        style={{
          color: "orange",
        }}
      />
    )
  } else {
    statusIcon = (
      <Typography
        style={{
          color: "grey",
        }}
      >
        {status}
      </Typography>
    )
  }
  return statusIcon
}

type Props = {
  launches: TestLaunch[]
}
function Launches(props: Props) {
  const classes = useStyles(props)

  return (
    <BasePage className={classes.root}>
      <title>Δ | Launches</title>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/">
          Delta Reporter
        </Link>
        <Link color="inherit" href={`/`}>
          Projects
        </Link>
        <Typography color="textPrimary">Launches</Typography>
      </Breadcrumbs>
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
                Launches for {props.launches[0].project} project
              </Typography>
              {props.launches[0] ? ( // checking if props exist
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {props.launches.map(launch => (
                      <TableRow key={launch.id} hover>
                        <TableCell>{launch.name}</TableCell>
                        <TableCell>
                          {" "}
                          {setStatusColor(launch.launch_status)}
                        </TableCell>

                        <TableCell>
                          {" "}
                          <Link
                            underline="none"
                            href={`/testruns/${launch.id}`}
                          >
                            {" "}
                            View{" "}
                          </Link>{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                // if props don't exist
                <h1>No runs were found for this launch! </h1>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </BasePage>
  )
}

Launches.getInitialProps = async (context): Promise<Props> => {
  const { launchesByProjectId } = context.query
  const launchesByProjectIdReq = await fetch(
    `http://delta_core_service:5000/api/v1/launch/project/${launchesByProjectId}`,
    {
      method: "GET",
    }
  )
  const launches = await launchesByProjectIdReq.json()

  return {
    launches: launches,
  }
}

export default Launches
