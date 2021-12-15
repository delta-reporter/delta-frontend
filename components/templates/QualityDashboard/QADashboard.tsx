import { Container, Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { InfoDashboard } from './InfoDashboard';
import { TestsFailingTheMost } from './TestsFailingTheMost';


const useStyles = makeStyles(theme => ({

  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paperLight: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  paperDark: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    backgroundColor: theme.palette.secondary.main,
    border: "1px grey solid",
  }
}))

interface DashboardProps {
  project: number
  darkMode: boolean
}

export default function QADashboard(props: DashboardProps) {

  const classes = useStyles(props)
  const { project, darkMode} = props;

return (
<Container maxWidth="lg" className={classes.container}>
<Grid container spacing={4} >
  <Grid item xs={12} >
    <Paper
        className={
          darkMode ? classes.paperDark : classes.paperLight
        }
        elevation={3}
      >
        <InfoDashboard project={project} darkMode={darkMode}/>
        <TestsFailingTheMost project={project} darkMode={darkMode}/>
    </Paper>
  </Grid>
</Grid>
</Container>
)
}
