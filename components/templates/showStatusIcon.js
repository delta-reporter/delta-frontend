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


  export function showStatusText(status) {
    let statusIcon
    if (status === "Passed" || status === "Successful") {
      statusIcon = (
        <button style={{color:"green", margin: "5px" , border: "1px green solid", backgroundColor: "white"}}>PASSED</button>
      )
    } else if (status === "Failed" || status === "Incomplete") {
        statusIcon = (
          <button style={{color:"red", margin: "5px" , border: "1px red solid", backgroundColor: "white"}}>FAILED</button>
        )
      } else if (status === "Skipped") {
        statusIcon = (
          <button style={{color:"grey", margin: "5px" , border: "1px grey solid", backgroundColor: "white"}}>SKIPPED</button>

        )
      } else if (status === "Running" || status === "In Process") {
        statusIcon = (
          <button style={{color:"orange", margin: "5px" , border: "1px orange solid", backgroundColor: "white"}}>RUNNING</button>
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