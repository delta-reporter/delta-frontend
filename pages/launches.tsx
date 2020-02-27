import { Typography } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import React from "react"
import ReactEcharts from "echarts-for-react"
import { AppContext } from "../components/AppContext"
import { SpacingPaper } from "../components/atoms"
import { HeaderArticleContainer } from "../components/organisms"
import { Layout } from "../components/templates"
import { Page } from "../constants"
import { IPagePayload, PageActions } from "../store/page"
import { TestLaunch } from "."

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    counter: {
      margin: 10,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
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
  const perfectDist = [
    { value: 20, name: "Apps Tests" },
    { value: 40, name: "Visual Regression Tests" },
    { value: 60, name: "End2End Tests" },
    { value: 80, name: "Integration Tests" },
    { value: 100, name: "Unit Tests" },
  ]

  const expectedDist = [
    { value: 0, name: "Apps Tests" },
    { value: 50, name: "Visual Regression Tests" },
    { value: 60, name: "End2End Tests" },
    { value: 40, name: "Integration Tests" },
    { value: 48, name: "Unit Tests" },
  ]

  const nighmareDist = [
    { value: 78, name: "Apps Tests" },
    { value: 66, name: "Visual Regression Tests" },
    { value: 52, name: "End2End Tests" },
    { value: 50, name: "Integration Tests" },
    { value: 40, name: "Unit Tests" },
  ]

  const normalQADist = [
    { value: 40, name: "Visual Regression Tests" },
    { value: 60, name: "End2End Tests" },
    { value: 80, name: "Integration Tests" },
  ]

  const end2endDist = [{ value: 100, name: "End2End Tests" }]

  const option = data => ({
    title: {
      text: "Release Zero",
      subtext: "DoneDeal Search",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}%",
    },
    toolbox: {
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {},
      },
    },
    legend: {
      data: [
        "Unit Tests",
        "Integration Tests",
        "End2End Tests",
        "Visual Regression Tests",
        "Apps Tests",
      ],
    },

    series: [
      {
        name: "Tests Distribution",
        type: "funnel",
        left: "10%",
        top: 40,
        // x2: 80,
        bottom: 50,
        width: "50%",
        // height: {totalHeight} - y - y2,
        min: 0,
        max: 100,
        minSize: "0%",
        maxSize: "80%",
        sort: "ascending",
        gap: 2,
        label: {
          show: true,
          position: "inside",
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: "solid",
          },
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
        },
        data: data,
      },
    ],
  })

  return (
    <Layout className={classes.root}>
      <HeaderArticleContainer>
        <SpacingPaper>
          <Typography variant="h2" gutterBottom className={classes.title}>
            Launch Zero - Perfect Distribution
          </Typography>
          <ReactEcharts option={option(perfectDist)} />
        </SpacingPaper>
        <SpacingPaper>
          <Typography variant="h2" gutterBottom className={classes.title}>
            Launch Zero - Expected Distribution
          </Typography>
          <ReactEcharts option={option(expectedDist)} />
        </SpacingPaper>
        <SpacingPaper>
          <Typography variant="h2" gutterBottom className={classes.title}>
            Launch Zero - Ho hell noo! Distribution
          </Typography>
          <ReactEcharts option={option(nighmareDist)} />
        </SpacingPaper>
        <SpacingPaper>
          <Typography variant="h2" gutterBottom className={classes.title}>
            Launch Zero - QA Tests Distribution
          </Typography>
          <ReactEcharts option={option(normalQADist)} />
        </SpacingPaper>
        <SpacingPaper>
          <Typography variant="h2" gutterBottom className={classes.title}>
            Launch Zero - Just WebdriverIO tests Distribution
          </Typography>
          <ReactEcharts option={option(end2endDist)} />
        </SpacingPaper>
      </HeaderArticleContainer>
    </Layout>
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
