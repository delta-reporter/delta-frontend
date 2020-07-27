import React from "react"
import {Typography, Tooltip, Chip, Link} from "@material-ui/core"
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
        <button style={{color:"green", margin: "5px" , border: "1px green solid", backgroundColor: "white", fontSize: "13px"}}>PASSED</button>
      )
    } else if (status === "Failed" || status === "Incomplete") {
        statusIcon = (
          <button style={{color:"red", margin: "5px" , border: "1px red solid", backgroundColor: "white", fontSize: "13px", paddingRight:"14px"}}>FAILED</button>
        )
      } else if (status === "Skipped") {
        statusIcon = (
          <button style={{color:"grey", margin: "5px" , border: "1px grey solid", backgroundColor: "white", fontSize: "13px"}}>SKIPPED</button>
        )
      } else if (status === "Running" || status === "In Process") {
        statusIcon = (
          <button style={{color:"orange", margin: "5px" , border: "1px orange solid", backgroundColor: "white", fontSize: "13px"}}>RUNNING</button>
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


export function showAllStatusesLinks(testRunId) {

      let statusesLinks = (
        <div style={{display:"flex", marginTop: "20px", marginLeft: "350px" }}>
          <p> Filter by Status:  </p> 
          <div style={{margin: "10px" }}>
            <Tooltip title="Tests Passed"> 
              <Link color="inherit" href={`/tests/passedTests/${testRunId}`}> 
                <Chip size="small" variant="outlined" style={{backgroundColor: "#c6e1d4",  marginLeft:"10px"}} label="passed"/>
                </Link> 
            </Tooltip>
            <Tooltip title="Tests Failed">
              <Link color="inherit" href={`/tests/failedTests/${testRunId}`}> 
                <Chip size="small" variant="outlined" style={{backgroundColor: "#e1c6c6",  marginLeft:"10px"}} label="failed"/>
              </Link> 
            </Tooltip>
            <Tooltip title="Tests Incomplete">
              <Link color="inherit" href={`/tests/failedTests/${testRunId}`}> 
                <Chip size="small" variant="outlined" style={{backgroundColor: "#e1d4c6",  marginLeft:"10px"}} label="incomplete"/>
              </Link> 
            </Tooltip>
            <Tooltip title="Tests Skipped">
              <Link color="inherit" href={`/tests/skippedTests/${testRunId}`}> 
                <Chip size="small" variant="outlined" style={{backgroundColor: "#e3e1e1",  marginLeft:"10px"}} label="skipped"/>
              </Link> 
            </Tooltip>
          </div>
        </div>
      )
    return statusesLinks
}