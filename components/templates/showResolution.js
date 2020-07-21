import React from "react"
import {Typography, Tooltip} from "@material-ui/core"

export function showResolutionText(resolution) {
    let resolutionBadge
    if (resolution === "Not set") {
        resolutionBadge = (
            <Tooltip title="Resolution">
                <button style={
                    {
                        color: "#008B8B",
                        margin: "5px",
                        border: "1px #008B8B solid",
                        backgroundColor: "white"
                    }
                }>Not set</button>
            </Tooltip>
        )
    } else if (resolution === "Test is flaky") {
        resolutionBadge = (
            <Tooltip title="Resolution">
                <button style={
                    {
                        color: "#FF8C00",
                        margin: "5px",
                        border: "1px #FF8C00 solid",
                        backgroundColor: "white"
                    }
                }>Test is flaky</button>
            </Tooltip>
        )
    } else if (resolution === "Product defect") {
        resolutionBadge = (
            <Tooltip title="Resolution">
                <button style={
                    {
                        color: "#800000",
                        margin: "5px",
                        border: "1px #800000 solid",
                        backgroundColor: "white"
                    }
                }>Product defect</button>
            </Tooltip>
        )
    } else if (resolution === "Test needs to be updated") {
        resolutionBadge = (
            <Tooltip title="Resolution">
                <button style={
                    {
                        color: "#66CDAA",
                        margin: "5px",
                        border: "1px #66CDAA solid",
                        backgroundColor: "white"
                    }
                }>Test needs to be updated</button>
            </Tooltip>
        )
    } else if (resolution === "To investigate") {
        resolutionBadge = (
            <Tooltip title="Resolution">
                <button style={
                    {
                        color: "#00FF7F",
                        margin: "5px",
                        border: "1px #00FF7F solid",
                        backgroundColor: "white"
                    }
                }>To investigate</button>
            </Tooltip>
        )
    } else if (resolution === "Environment issue") {
        resolutionBadge = (
            <Tooltip title="Resolution">
                <button style={
                    {
                        color: "#EE82EE",
                        margin: "5px",
                        border: "1px #EE82EE solid",
                        backgroundColor: "white"
                    }
                }>Environment issue</button>
            </Tooltip>
        )
    } else {
        resolutionBadge = (
            <Tooltip title="Resolution">
                <Typography style={
                    {color: "grey"}
                }>
                    {resolution} </Typography>
            </Tooltip>
        )
    }
    return resolutionBadge
}
