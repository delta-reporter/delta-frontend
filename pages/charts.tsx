import { Container, Typography } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import React from "react"
import { AppContext } from "../components/AppContext"
import { BasePage } from "../components/templates"
import fetch from "isomorphic-unfetch"
import {
  LineChart,
  XAxis,
  CartesianGrid,
  Line,
  Tooltip,
  AreaChart,
  Area,
  YAxis,
} from "recharts"
import { TestProject } from "."

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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
  fixedHeightAndWidth: {
    height: 240,
    width: 300,
  },
  projectStatus: {
    flex: 1,
    paddingTop: theme.spacing(1),
    textAlign: "center",
  },
  projectTitle: {
    paddingTop: theme.spacing(7),
    textAlign: "center",
  },
}))

type Props = {
  test_projects: TestProject[]
}

// Article on charts  https://medium.com/forepaas/react-making-recharts-easy-to-use-e3d99d0641ba

function Charts(props: Props) {
  const classes = useStyles(props)

  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ]
  //   const { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } = Recharts;

  return (
    <BasePage className={classes.root}>
      <title>Δ | Charts</title>
      <Container maxWidth="lg" className={classes.container}>
        <Typography style={{ fontWeight: "bold" }}>
          CHARTS TEMPLATE PAGE (MOCK DATA)
        </Typography>
        {props.test_projects[0] ? ( // checking if props exist (if there are projects)
          <div>
            <LineChart
              width={400}
              height={400}
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              style={{ padding: "30px" }}
            >
              <XAxis dataKey="name" />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" />
              <Line type="monotone" dataKey="uv" stroke="#ff7300" yAxisId={0} />
              <Line type="monotone" dataKey="pv" stroke="#387908" yAxisId={1} />
            </LineChart>

            <AreaChart
              width={600}
              height={400}
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              style={{ padding: "30px" }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="uv"
                stroke="#8884d8"
                fill="#8884d8"
              />
            </AreaChart>
          </div>
        ) : (
          <h1>No projects were found! </h1>
        )}
      </Container>
    </BasePage>
  )
}

// It runs  on the server-side, making a request before page is loaded.
// The data required to render the page is available at build time ahead of a user’s request
// https://nextjs.org/docs/api-reference/data-fetching/getInitialProps

Charts.getInitialProps = async (ctx: AppContext): Promise<Props> => {
  const { store } = ctx
  const projectReq = await fetch(`http://delta-core.dsch.dev/api/v1/projects`, {
    method: "GET",
  })
  const projects = await projectReq.json()

  return {
    test_projects: projects,
  }
}

export default Charts
