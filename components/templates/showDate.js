import React from "react"
import {Typography, Tooltip} from "@material-ui/core"

export function showDateText(date) {
    let dateBadge
    dateBadge = (
        <Tooltip title="End date">
            <button style={
                {
                    color: "#6B8E23",
                    margin: "5px",
                    border: "1px #6B8E23 solid",
                    backgroundColor: "white"
                }
            }>
                {date} </button>
        </Tooltip>
    )
    return dateBadge
}
