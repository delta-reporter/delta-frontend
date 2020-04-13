import React from "react"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import DashboardIcon from "@material-ui/icons/Dashboard"
import BarChartIcon from "@material-ui/icons/Assignment" // AssignmentIcon, LayersIcon, BarChartIcon
import Link from "@material-ui/core/Link"

export const SideBarMainItems = (
  <div>
    <Link color="inherit" href="/">
      <ListItem button href="/">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Projects" />
      </ListItem>
    </Link>
  </div>
)

export const SideBarSecondaryItems = (
  <div>
    <ListSubheader inset>Charts</ListSubheader>
    <ListItem button disabled>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Coming Soon" />
    </ListItem>
  </div>
)
