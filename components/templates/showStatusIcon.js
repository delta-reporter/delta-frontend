import React from "react"
import {Typography} from "@material-ui/core"
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import UseAnimations from "react-useanimations"
import SnoozeIcon from "@material-ui/icons/Snooze"

export function showStatusIcon(status) {
  let statusIcon
  if (status === "Passed" || status === "Successful") {
    statusIcon = (
    <CheckIcon
          style={{
            color: "green",
          }}
    ></CheckIcon>
    )
  } else if (status === "Failed" || status === "Incomplete") {
      statusIcon = (
      <CloseIcon
            style={{
              color: "red",
            }}
        ></CloseIcon>
      )
    } else if (status === "Skipped") {
      statusIcon = (
        <SnoozeIcon
          style={{
            color: "grey",
          }}
        ></SnoozeIcon>
      )
    } else if (status === "Running" || status === "In Process") {
      statusIcon = (
        <UseAnimations
          animationKey="loading"
          style={{
            color: "orange",
          }}
        />
      )
    } else {
      statusIcon = (
        <Typography
          style={{
            color: "grey",
          }}
        >
          {status}
        </Typography>
      )
    }
    return statusIcon
  }