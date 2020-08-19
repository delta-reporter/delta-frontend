import React from "react"
import {Typography, Tooltip} from "@material-ui/core"

export function showDateText(date, darkMode) {
    let dateBadge
    let dateString = new Date(date).toUTCString();
    let day = dateString.split(' ').slice(0, 3).join(' ');
    let hour = dateString.split(' ').slice(-2)[0];
    dateString= day + ", " + hour
    if(darkMode) {
        dateBadge = (
            <Tooltip title="End date">
                <button style={
                    {
                        color: "#6B8E23",
                        margin: "5px",
                        backgroundColor: "#2a2a2a",
                        border: "1px solid",
                    }
                }>
                    {dateString} </button>
            </Tooltip>
        )
    } else
        dateBadge = (
            <Tooltip title="End date">
                <button style={
                    {
                        color: "#6B8E23",
                        margin: "5px",
                        backgroundColor: "white",
                        border: "none",
                    }
                }>
                    {dateString} </button>
            </Tooltip>
        )
    return dateBadge
}
