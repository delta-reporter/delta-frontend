import React from "react"
import {Typography, Tooltip} from "@material-ui/core"

export function showResolutionText(resolution, darkMode) {

    if(resolution == 1) resolution =  "Not set"
    else if(resolution == 2) resolution =  "Test is flaky"
    else if(resolution == 3) resolution =  "Product defect"
    else if(resolution == 4) resolution =  "Test needs to be updated"
    else if(resolution == 5) resolution =  "To investigate"
    else if(resolution == 6) resolution =  "Environment issue"

    let resolutionBadge
    if (resolution === "Not set" || resolution === null) {
        resolutionBadge = ""
    } else {
       
        if(darkMode) {
            resolutionBadge = (
                <Tooltip title="Resolution">
                    <button style={
                        {
                            color: "#dda057",
                            margin: "5px",
                            border: "1px #dda057 solid",
                            backgroundColor: "#2a2a2a"
                        }
                    }>{resolution}</button>
                </Tooltip>
            )
        }
        else 
            resolutionBadge = (
                <Tooltip title="Resolution">
                    <button style={
                        {
                            color: "#dda057",
                            margin: "5px",
                            border: "1px #dda057 solid",
                            backgroundColor: "white"
                        }
                    }>{resolution}</button>
                </Tooltip>
        )
    return resolutionBadge
    }
}

export function getResolutionName(resolution) {
    let resolutionName
    if(resolution == 1) resolutionName =  "Not set"
    else if(resolution == 2) resolutionName =  "Test is flaky"
    else if(resolution == 3) resolutionName =  "Product defect"
    else if(resolution == 4) resolutionName =  "Test needs to be updated"
    else if(resolution == 5) resolutionName =  "To investigate"
    else if(resolution == 6) resolutionName =  "Environment issue"
    else return ""
    return resolutionName
}
