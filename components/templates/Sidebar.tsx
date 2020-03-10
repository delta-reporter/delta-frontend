import React from "react"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import DashboardIcon from "@material-ui/icons/Dashboard"
import Link from "@material-ui/core/Link"
import BarChartIcon from "@material-ui/icons/BarChart"
import LayersIcon from "@material-ui/icons/Layers"
import AssignmentIcon from "@material-ui/icons/Assignment"

export const SideBarMainItems = (
  <div>
    <Link color="inherit" href="/">
      <ListItem button href="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Homepage" />
      </ListItem>
    </Link>
    <Link color="inherit" href="/projects">
      <ListItem button href="/projects">
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Projects" />
      </ListItem>
    </Link>
    <Link color="inherit" href="/">
      <ListItem button>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Charts" />
      </ListItem>
    </Link>
  </div>
)

export const SideBarSecondaryItems = (
  <div>
    <ListSubheader inset>Reports</ListSubheader>
    <ListItem button disabled>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button disabled>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button disabled>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
  </div>
)
