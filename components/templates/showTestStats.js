import React from "react"
import { Tooltip } from "@material-ui/core"

export function showTestStats(passed, failed, incomplete, skipped) {
    return (
      <div style={{ position: "absolute", right: "120px" }}>
        {passed !== 0 ? (
          <Tooltip title="Passed">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "green",
                color: "green",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {passed}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
        {failed !== 0 ? (
          <Tooltip title="Failed">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "red",
                color: "red",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {failed}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
        {incomplete !== 0 ? (
          <Tooltip title="Incomplete">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "orange",
                color: "orange",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {incomplete}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
        {skipped !== 0 ? (
          <Tooltip title="Skipped">
            <span
              style={{
                borderStyle: "ridge",
                borderColor: "grey",
                color: "grey",
                padding: "3px",
                margin: "3px",
                fontWeight: "bold",
              }}
            >
              {skipped}
            </span>
          </Tooltip>
        ) : (
          <span></span>
        )}
      </div>
    )
  }