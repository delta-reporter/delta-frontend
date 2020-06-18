import React from "react"
import {Typography, Tooltip} from "@material-ui/core"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import UseAnimations from "react-useanimations"
import SnoozeIcon from "@material-ui/icons/Snooze"

export function showStatusIcon(status) {
  let statusIcon
  if (status === "Passed" || status === "Successful") {
    statusIcon = (
      <Tooltip title="Passed">
        <CheckIcon style={{ color: "green" }}></CheckIcon>
      </Tooltip>
    )
  } else if (status === "Failed" || status === "Incomplete") {
      statusIcon = (
        <Tooltip title="Failed">
          <CloseIcon style={{ color: "red" }}></CloseIcon>
        </Tooltip>
      )
    } else if (status === "Skipped") {
      statusIcon = (
        <Tooltip title="Skipped">
          <SnoozeIcon style={{ color: "grey" }}></SnoozeIcon>
        </Tooltip>
      )
    } else if (status === "Running" || status === "In Process") {
      statusIcon = (
        <Tooltip title="Running">
          <UseAnimations
            animationKey="loading"
            style={{ color: "orange" }}/>
        </Tooltip>
      )
    } else {
      statusIcon = (
        <Typography
          style={{ color: "grey" }}>
          {status}
        </Typography>
      )
    }
    return statusIcon
  }