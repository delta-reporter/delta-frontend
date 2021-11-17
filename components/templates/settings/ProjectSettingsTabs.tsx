import React from "react"
import SwipeableViews from "react-swipeable-views"
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import SmartLinkOptions from "./SmartLinkOptions"

interface TabPanelProps {
  children?: React.ReactNode
  dir?: string
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

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
  )
}

function a11yProps(index: any) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
}))

export default function ProjectSettingsTabs(children: any) {
  const { project_id } = children
  const classes = useStyles()
  const theme = useTheme()
  const [value, setValue] = React.useState(0)

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: number
  ) => {
    console.log(event)
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="SmartLinks" {...a11yProps(0)} />
          {/* <Tab label="Other menu" {...a11yProps(1)} />
          <Tab label="Other menu" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <SmartLinkOptions project_id={project_id} />
        </TabPanel>
        {/* <TabPanel value={value} index={1} dir={theme.direction}>
          Contents for second menu
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Contents for third menu
        </TabPanel> */}
      </SwipeableViews>
    </div>
  )
}
