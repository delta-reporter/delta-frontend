import React from "react"
import {Typography, Tooltip} from "@material-ui/core"

export function showDateText(date) {
    let dateBadge
    let dateString = new Date(date).toUTCString();
    let day = dateString.split(' ').slice(0, 3).join(' ');
    let hour = dateString.split(' ').slice(-2)[0];
    dateString= day + ", " + hour

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
