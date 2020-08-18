import React from "react"
import {Typography, Tooltip} from "@material-ui/core"

export function showResolutionText(resolution, darkMode) {
    let resolutionBadge
    if (resolution === "Not set") {
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
                    }>Test is flaky</button>
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
                    }>Test is flaky</button>
                </Tooltip>
        )
    return resolutionBadge
    }
}
