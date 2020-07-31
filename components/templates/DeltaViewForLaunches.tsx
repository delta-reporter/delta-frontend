import { Button } from "@material-ui/core"
import { showStatusIcon } from "."
import ReactEcharts from "echarts-for-react"
import Router from "next/router"

let pyramidData = []
let roseData = []

export function testRunButtonsDefaultView(testRunStats: any) {
  return testRunStats.map(testRun => (
    <Button
      key={testRun.test_run_id}
      variant="contained"
      href={`/tests/${testRun.test_run_id}`}
      style={{
        fontSize: "12px",
        paddingLeft: "8px",
        paddingRight: "3px",
        paddingBottom: "0px",
        paddingTop: "0px",
        marginLeft: "5px",
      }}
    >
      {testRun.test_type}{" "}
      {testRun.tests_total === testRun.tests_passed + testRun.tests_skipped ? (
        <div> {showStatusIcon("Successful")} </div>
      ) : (
        <div>{showStatusIcon("Failed")} </div>
      )}{" "}
    </Button>
  ))
}

export function testRunButtonsDeltaPyramidView(testRunStats: any, launchId: number) {
  const deltaViewStyle = { height: "190px", width: "800px" }

  // The param echarts could be pass into this function as well
  const onChartClick = async param => {
    if (param.seriesType === "funnel") {
      await Router.push("/tests/" + param.data.test_run_id)
    } else if (param.seriesType === "pie") {
      await Router.push("/testruns/" + param.data.launch_id)
    }
  }

  let onChartEvents = {
    click: onChartClick,
  }

  const option = (pyramid, rose) => ({
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}",
    },
    toolbox: {
      show: false,
    },
    series: [
      {
        name: "Total tests",
        type: "funnel",
        top: "10%",
        width: "40%",
        height: "85%",
        minSize: "0%",
        maxSize: "80%",
        sort: "ascending",
        gap: 1,
        label: {
          show: true,
          position: "inside",
        },
        labelLine: {
          length: 2,
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
        data: pyramid,
      },
      {
        name: "Tests by status",
        type: "pie",
        radius: [10, 80],
        center: ["80%", "50%"],
        roseType: "area",
        data: rose,
      },
    ],
  })

  function insertChartDataDeltaView(key, value, name, itemId) {
    if (key === "pyramid") {
      pyramidData.push({ value: value, name: name, test_run_id: itemId })
    } else if (key === "rose") {
      let testTypeIndex = roseData.findIndex(arr => arr.name === name)
      if (testTypeIndex >= 0) {
        let newValue = roseData[testTypeIndex].value + value
        roseData[testTypeIndex] = {
          value: newValue,
          name: name,
          launch_id: itemId,
        }
      } else {
        roseData.push({ value: value, name: name, launch_id: itemId })
      }
    }
    return ""
  }

  testRunStats.map(
    trData => (
      insertChartDataDeltaView(
        "pyramid",
        trData.tests_total,
        trData.test_type,
        trData.test_run_id
      ),
      insertChartDataDeltaView("rose", trData.tests_failed, "Failed", launchId),
      insertChartDataDeltaView("rose", trData.tests_passed, "Passed", launchId),
      insertChartDataDeltaView(
        "rose",
        trData.tests_running,
        "Running",
        launchId
      ),
      insertChartDataDeltaView(
        "rose",
        trData.tests_incomplete,
        "Incomplete",
        launchId
      ),
      insertChartDataDeltaView(
        "rose",
        trData.tests_skipped,
        "Skipped",
        launchId
      )
    )
  )
  return (
    <ReactEcharts
      option={option(pyramidData, roseData)}
      style={deltaViewStyle}
      onEvents={onChartEvents}
    />
  )
}

export function clearChartDataOnDeltaView() {
  pyramidData = []
  roseData = []
  return ""
}
