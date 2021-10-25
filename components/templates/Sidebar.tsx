import React from "react"
import { ListItem, ListItemText, ListItemIcon, Link, ListSubheader } from "@material-ui/core/"
import HomeIcon from "@material-ui/icons/Home"
import InsertChartIcon from '@material-ui/icons/InsertChart';
import BarChartIcon from '@material-ui/icons/BarChart';

export const SideBarMainItems = (
  <div>
    <Link color="inherit" href="/">
      <ListItem button href="/">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Projects" />
      </ListItem>
    </Link>
    <ListItem button href="/charts">
      <ListItemIcon>
        <InsertChartIcon />
      </ListItemIcon>
      <ListItemText primary="Charts" />
    </ListItem>
  </div>
)

export const SideBarSecondaryItems = (
  <div>
    {/* for the later use */}
    <ListSubheader inset>Title</ListSubheader>
    <ListItem button disabled>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Text" />
    </ListItem>
  </div>
)
