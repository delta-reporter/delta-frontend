import React from "react"
import { Typography, Tooltip } from "@material-ui/core"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import UseAnimations from "react-useanimations"
import SnoozeIcon from "@material-ui/icons/Snooze"
import WarningIcon from '@material-ui/icons/Warning'

export function showStatusIcon(status, isFlaky = false) {
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
        <CloseIcon style={{ color: "#d62727" }}></CloseIcon>
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
        <UseAnimations animationKey="loading" style={{ color: "orange" }} />
      </Tooltip>
    )
  } else {
    statusIcon = <Typography style={{ color: "grey" }}>{status}</Typography>
  }

  if (isFlaky && (status === "Passed" || status === "Failed")) {
    statusIcon = showIsFlakyBadgeList(status, isFlaky)
  }
  return statusIcon
}

export function showStatusText(status, darkMode) {
  let statusIcon
  if (status === "Passed" || status === "Successful") {
    if(darkMode) 
      statusIcon = (
        <button
          style={{
            color: "green",
            margin: "5px",
            border: "1px green solid",
            backgroundColor: "#2a2a2a",
            fontSize: "13px",
          }}
        >
          PASSED
        </button>
      )
    else 
      statusIcon = (
        <button
          style={{
            color: "green",
            margin: "5px",
            border: "1px green solid",
            backgroundColor: "white",
            fontSize: "13px",
          }}
        >
          PASSED
        </button>
      )
  } else if (status === "Failed" || status === "Incomplete") {
    if(darkMode) 
      statusIcon = (
        <button
          style={{
            color: "#d62727",
            margin: "5px",
            border: "1px #d62727 solid",
            backgroundColor: "#2a2a2a",
            fontSize: "13px",
            paddingRight: "6px",
          }}
        >
          FAILED
        </button>
      )
    else 
      statusIcon = (
        <button
          style={{
            color: "#d62727",
            margin: "5px",
            border: "1px #d62727 solid",
            backgroundColor: "white",
            fontSize: "13px",
            paddingRight: "6px",
          }}
        >
          FAILED
        </button>
      )
  } else if (status === "Skipped") {
    if(darkMode)
      statusIcon = (
        <button
          style={{
            color: "grey",
            margin: "5px",
            border: "1px grey solid",
            backgroundColor: "#2a2a2a",
            fontSize: "13px",
          }}
        >
          SKIPPED
        </button>
      )
    else
      statusIcon = (
        <button
          style={{
            color: "grey",
            margin: "5px",
            border: "1px grey solid",
            backgroundColor: "white",
            fontSize: "13px",
          }}
        >
          SKIPPED
        </button>
      )
  } else if (status === "Running" || status === "In Process") {
    if(darkMode)
      statusIcon = (
        <button
          style={{
            color: "orange",
            margin: "5px",
            border: "1px orange solid",
            backgroundColor: "#2a2a2a",
            fontSize: "13px",
          }}
        >
          RUNNING
        </button>
      )
    else
      statusIcon = (
        <button
          style={{
            color: "orange",
            margin: "5px",
            border: "1px orange solid",
            backgroundColor: "white",
            fontSize: "13px",
          }}
        >
          RUNNING
        </button>
      )
  } else {
    statusIcon = <Typography style={{ color: "grey" }}>{status}</Typography>
  }

  return statusIcon
}


export function showIsFlakyBadgeList(status, isFlaky) {
  let statusIcon

  if (isFlaky && status === "Failed") {
    statusIcon = (
      <Tooltip title="Test failed. Might be flaky. Failing more than 5/10 times">
        <WarningIcon style={{color: "#d62727", width:"30px", height:"25px", marginBottom:"3px", marginLeft:"-3px"}}></WarningIcon>  
      </Tooltip>
    )
  }
  if (isFlaky && status === "Passed") {
    statusIcon = (
      <Tooltip title="Test passed this time. But might be flaky, was failing in past">
        <WarningIcon style={{color: "green", width:"30px", height:"25px", marginBottom:"3px", marginLeft:"-3px"}}></WarningIcon>  
      </Tooltip>
    )
  }
  return statusIcon
}

export function showIsFlakyBadgeTestExpanded(status, isFlaky) {
  let statusIcon

  if (isFlaky && status === "Failed") {
    statusIcon = (
      <Tooltip title="Test failed. Might be flaky. Failing more than 5/10 times">
        <WarningIcon style={{color: "#d62727", width:"30px", height:"25px", marginBottom:"-7px"}}></WarningIcon>  
      </Tooltip>
    )
  }
  if (isFlaky && status === "Passed") {
    statusIcon = (
      <Tooltip title="Test passed this time. But might be flaky, was failing in past">
        <WarningIcon style={{color: "green", width:"30px", height:"25px", marginBottom:"-7px"}}></WarningIcon>  
      </Tooltip>
    )
  }
  return statusIcon
}
