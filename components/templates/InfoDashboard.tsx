import React from 'react';
import { Grid, Link, makeStyles, Typography } from '@material-ui/core';
import ReactEcharts from "echarts-for-react"
import RealTimeChart from './RealTimeChart';

const useStyles = makeStyles((theme) => ({
  textColorDarkMode: {
    color: theme.palette.secondary.light,
  },
  textColorLightMode: {
  },
}))

interface DashboardProps {
  project: string
  darkMode: boolean
}

export const InfoDashboard = function(props: DashboardProps) {

  const classes = useStyles(props)
  const { project, darkMode} = props;

  const option = {
    title: {
      text: 'Project testing stability'
    },
    tooltip : {
      trigger: 'axis'
    },
    legend: {
      data:['Failures','N/A','Passing']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
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
        data : ['Monday','Tuesday','Wednesday','Thrusday','Friday','Saturday','Sunday']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name:'Failures',
        type:'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data:[120, 132, 101, 134, 90, 230, 210]
      },
      {
        name:'N/A',
        type:'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data:[220, 182, 191, 234, 290, 330, 310]
      },
      {
        name:'Passing',
        type:'line',
        stack: '总量',
        areaStyle: {normal: {}},
        data:[150, 232, 201, 154, 190, 330, 410]
      }
    ]
  };

  return (
    <>
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
      option={option}
      style={{ height: 400 }}
    />
    <RealTimeChart/>
      </div>
    </>
  )
}
