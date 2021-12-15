import React from 'react';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import ReactEcharts from "echarts-for-react"
// import RealTimeChart from './RealTimeChart';
import getWeeklyStats from '../../../data/WeeklyStats';

const useStyles = makeStyles((theme) => ({
  textColorDarkMode: {
    color: theme.palette.secondary.light,
  },
  textColorLightMode: {
  },
}))

interface DashboardProps {
  project: number
  darkMode: boolean
}

export const InfoDashboard = function(props: DashboardProps) {

  const classes = useStyles(props)
  const { project, darkMode} = props;

  const { loading, noData, weekly_stats } = getWeeklyStats(project)




  function getData(stats: any) {

    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "short", day: "numeric" }
    function getDays(): Array<string>{return stats.map(x => new Date(x.date).toLocaleString([], options))}
    // function getDays(): Array<string>{return stats.map(x => x.date)}
    const failed = []
    const incomplete = []
    const passed = []
    const running = []
    const skipped = []

    console.log(getDays().length);
    console.log(getDays());

    stats.forEach(day => {
      failed.push(day.tests_failed)
      incomplete.push(day.tests_incomplete)
      passed.push(day.tests_passed)
      running.push(day.tests_running)
      skipped.push(day.tests_skipped)
    });

    return {
      title: {
        text: 'Project testing stability'
      },
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['Failures','Incomplete','Passing', 'Running', 'Skipped']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : getDays()
        }
      ],
      yAxis : [
        {
          type : 'value'
        }
      ],
      series : [
        {
          name: 'Failures',
          type: 'line',
          areaStyle: {normal: {}},
          data: failed
        },
        {
          name: 'Incomplete',
          type: 'line',
          areaStyle: {normal: {}},
          data: incomplete
        },
        {
          name: 'Passing',
          type: 'line',
          areaStyle: {normal: {}},
          data: passed
        },
        {
          name: 'Running',
          type: 'line',
          areaStyle: {normal: {}},
          data: running
        },
        {
          name: 'Skipped',
          type: 'line',
          areaStyle: {normal: {}},
          data: skipped
        }
      ]
    };
  }

  if (noData) {
    return (
      <div>
        <Typography
          style={{
            fontStyle: "italic",
            margin: "20px",
            color: "grey",
          }}
        >
        No weekly statistics were found...
        </Typography>
      </div>
    )
  } else {
    return (
      <>
        <div>
        {" "}
        {loading
            ? "Loading weekly statistics..."
            :
            <div>
              <Grid item xs={10}>
                <Typography
                  variant="h6"
                  style={{ fontWeight: 400, margin: "5px" }}
                  className={darkMode ? classes.textColorDarkMode : classes.textColorLightMode}
                >
                  Statistics
                </Typography>
              </Grid>
              <ReactEcharts
                option={getData(weekly_stats)}
                style={{ height: 400 }}
              />
            </div>
        }
        {" "}
        </div>
      </>
    )
  }
}
