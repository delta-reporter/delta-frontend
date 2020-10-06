import React from "react"
import {Typography, Tooltip} from "@material-ui/core"
import HistoryIcon from '@material-ui/icons/History'

export function showResolutionText(resolution, darkMode, historicalData) {

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
                <> 
                    { !historicalData ? (
                        <Tooltip title="Resolution for current test" >
                            <button style={
                                {
                                    color: "#dda057",
                                    margin: "5px",
                                    border: "1px #dda057 solid",
                                    backgroundColor: "#2a2a2a"
                                }
                            }> { resolution }
                            </button>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Historical resolution inherited from previous tests">
                        <button style={
                            {
                                color: "#dda057",
                                margin: "5px",
                                border: "1px #dda057 solid",
                                backgroundColor: "#2a2a2a"
                            }
                        }>
                            <HistoryIcon style={{color:"#dda057", fontSize: "small", marginTop:"3px", marginRight: "3px", marginBottom: "-2px"}}></HistoryIcon>
                            <span>{ resolution }</span>
                        </button>
                    </Tooltip>
                    )} 
                </>
            )
        }
        else 
        resolutionBadge = (
            <> 
                { !historicalData ? (
                    <Tooltip title="Resolution for current test" >
                        <button style={
                            {
                                color: "#dda057",
                                margin: "5px",
                                border: "1px #dda057 solid",
                                backgroundColor: "white"
                            }
                        }> { resolution }
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip title="Historical resolution inherited from previous tests">
                    <button style={
                        {
                            color: "#dda057",
                            margin: "5px",
                            border: "1px #dda057 solid",
                            backgroundColor: "white"
                        }
                    }>
                        <HistoryIcon style={{color:"#dda057", fontSize: "small", marginTop:"3px", marginRight: "3px", marginBottom: "-2px"}}></HistoryIcon>
                        <span>{ resolution }</span>
                    </button>
                </Tooltip>
                )} 
            </>
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
