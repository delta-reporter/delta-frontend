import React from "react"
import { Tooltip, Chip } from "@material-ui/core"

export function showTestStats(passed, failed, incomplete, skipped) {
    return (
      <div style={{ position: "absolute", right: "120px" }}>
        {passed !== 0 ? (
          <Tooltip title="Tests Passed"> 
            <Chip size="small" variant="outlined" style={{
                backgroundColor: "#c6e1d4",  marginLeft:"3px" 
              }} label={passed} />
          </Tooltip>
        ) : (
          <span></span>
        )}
        {failed !== 0 ? (
          <Tooltip title="Tests Failed">
            <Chip size="small" variant="outlined" style={{
                backgroundColor: "#e1c6c6",  marginLeft:"3px"
              }} label={failed} />
          </Tooltip>
        ) : (
          <span></span>
        )}
        {incomplete !== 0 ? (
          <Tooltip title="Tests Incomplete">
            <Chip size="small" variant="outlined" style={{
                backgroundColor: "#e1d4c6", marginLeft:"3px"
              }} label={incomplete} />
          </Tooltip>
        ) : (
          <span></span>
        )}
        {skipped !== 0 ? (
          <Tooltip title="Tests Skipped">
            <Chip size="small" variant="outlined" style={{ 
              backgroundColor: "#e3e1e1", marginLeft:"3px"
            }} label={skipped} />
          </Tooltip>
        ) : (
          <span></span>
        )}
      </div>
    )
  }