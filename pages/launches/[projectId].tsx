import React, { useState, useEffect } from "react"
import fetch from "isomorphic-unfetch"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { GetServerSideProps } from "next"
import { InferGetServerSidePropsType } from "next"
import {
  BasePage,
} from "../../components/templates"
import { TestProject } from "../index"
import {
  Grid,
  Typography,
  Link,
  Breadcrumbs,
  NoSsr,
  Box,
  Tab,
  AppBar,
  Tabs,
} from "@material-ui/core"
import Switch from "@material-ui/core/Switch"
import WbSunnyIcon from "@material-ui/icons/WbSunny"
import Brightness2Icon from "@material-ui/icons/Brightness2"
import SwipeableViews from 'react-swipeable-views';
import QADashboard from "../../components/templates/QualityDashboard/QADashboard"
import LaunchesList from "../../components/templates/TestLaunches/LaunchesList"

const useStyles = makeStyles(theme => ({
  rootLight: {
    flexGrow: 1,
    color: theme.palette.secondary.light,
  },
  rootDark: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
  },
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
  },
  toggleModeDark: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.light,
    border: "1px grey solid",
    marginBottom: "15px",
  },
  toggleModeLight: {
    border: "1px grey solid",
    marginBottom: "15px",
  },
  textColorDarkMode: {
    color: theme.palette.secondary.light,
  },
  textColorLightMode: {},
}))

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function Launches({
  project,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const classes = useStyles(project)
  const theme = useTheme();

  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (_: React.ChangeEvent<unknown>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleTabChangeIndex = (index: number) => {
    setTabIndex(index);
  };

    // dark mode switch
    const [state, setState] = useState({
      darkMode: getInitialDarkModeState(),
    });

    const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [event.target.name]: event.target.checked });
    };

    useEffect(() => {
      localStorage.setItem("darkMode", JSON.stringify(state.darkMode)) //setting a variable in the browser storage
    }, [state.darkMode])

    function getInitialDarkModeState(): boolean {
      if (typeof window !== "undefined") {
        const savedColorMode = JSON.parse(localStorage.getItem("darkMode")) //checking the 'dark' var from browser storage
        return savedColorMode || false
      } else {
        return false
      }
    }

  return (
    <NoSsr>
      <BasePage
        className={state.darkMode ? classes.rootDark : classes.rootLight}
        darkMode={state.darkMode}
      >
        <title>Δ | Launches</title>
        <div>
          <div style={{ float: "left" }}>
            <Breadcrumbs
              style={{ paddingLeft: "30px", marginTop: "20px" }}
              className={
                state.darkMode
                  ? classes.textColorDarkMode
                  : classes.textColorLightMode
              }
            >
              <Link color="inherit" href={`/`}>
                Projects
              </Link>
              <Typography
                color="textPrimary"
                className={
                  state.darkMode
                    ? classes.textColorDarkMode
                    : classes.textColorLightMode
                }
              >
                {" "}
                {project.name} Launches
              </Typography>
            </Breadcrumbs>
          </div>

          <div style={{ float: "right", width: "15%", marginTop: "15px" }}>
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>
                <WbSunnyIcon></WbSunnyIcon>
              </Grid>
              <Grid item>
                <Switch
                  checked={state.darkMode}
                  onChange={handleDarkModeChange}
                  name="darkMode"
                  color="primary"
                />
              </Grid>
              <Grid item>
                <Brightness2Icon></Brightness2Icon>
              </Grid>
            </Grid>
          </div>
        </div>

        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Launches" {...a11yProps(0)} />
            <Tab label="Quality Dashboard" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={tabIndex}
          onChangeIndex={handleTabChangeIndex}
        >
          <TabPanel value={tabIndex} index={0} dir={theme.direction}>
           <LaunchesList project={project} darkMode={state.darkMode}/>
          </TabPanel>
          <TabPanel value={tabIndex} index={1} dir={theme.direction}>
            <QADashboard project={project.project_id} darkMode={state.darkMode}/>
          </TabPanel>
        </SwipeableViews>
      </BasePage>
    </NoSsr>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { projectId } = context.query
  console.log(projectId)
  console.log(context.query)
  const projectData = await fetch(
    `${process.env.deltaCore}/api/v1/project/${projectId}`,
    {
      method: "GET",
    }
  )
  const project: TestProject = await projectData.json()

  return {
    props: { project },
  }
}

export default Launches
