import React from "react"
import { ListItem, ListItemText, ListItemIcon, Link } from "@material-ui/core/"
import DashboardIcon from "@material-ui/icons/Dashboard"
import BarChartIcon from "@material-ui/icons/Assignment" // AssignmentIcon, LayersIcon, BarChartIcon

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
    <ListItem button disabled>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Charts" />
    </ListItem>
  </div>
)

export const SideBarSecondaryItems = (
  <div>
    {/* for the later use */}
    {/* <ListSubheader inset>Title</ListSubheader>
    <ListItem button disabled>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Text" />
    </ListItem> */}
  </div>
)
