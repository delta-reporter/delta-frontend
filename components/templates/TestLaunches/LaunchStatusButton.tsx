import React, { useState } from "react"
import { Tooltip, IconButton, Snackbar } from "@material-ui/core"
import { showStatusIcon } from ".."
import StopIcon from "@material-ui/icons/Stop"
import CloseIcon from "@material-ui/icons/Close"

interface LaunchButtonProps {
  launch_id: number
  launch_status: string
}

// export function showStatusAndEnableToStopRunningLaunch(
const LaunchStatusButton = function(
  props: LaunchButtonProps
) {
  const { launch_id, launch_status} = props;
  const [openPopUp, setOpenPopUp] = useState(false)

  const handleStopButtonClick = async (launch_id: string | number) => {
    // PUT request using fetch with async/await
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        launch_id: launch_id,
      }),
    }
    console.log(requestOptions)

    const response = await fetch(
      `${process.env.publicDeltaCore}/api/v1/finish_launch`,
      requestOptions
    )
    await response.json()
    setOpenPopUp(true)
  }

  const handlePopUpClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return
    }

    setOpenPopUp(false)
  }

  const [isHovered, setIsHovered] = useState(false)

  const hoverOn = () => {
    setIsHovered(true)
  }

  const hoverOff = () => {
    setIsHovered(false)
  }

  let statusIcon = <div></div>
  if (launch_status === "Running" || launch_status === "In Process") {
    statusIcon = (
      <Tooltip title="Stop this launch">
        <div>
          <IconButton
            size="small"
            style={{
              blockSize: "1px",
              paddingLeft: "0px",
              paddingRight: "0px",
            }}
            onClick={() => handleStopButtonClick(launch_id)}
            onMouseEnter={hoverOn}
            onMouseLeave={hoverOff}
          >
            {isHovered ? (
              <StopIcon
                style={{
                  color: "grey",
                }}
              />
            ) : (
              showStatusIcon(launch_status)
            )}
          </IconButton>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={openPopUp}
            autoHideDuration={4000}
            message="Launch is marked as finished. Changes will be visible after page reload"
            onClose={handlePopUpClose}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={handlePopUpClose}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </div>
      </Tooltip>
    )
  } else statusIcon = showStatusIcon(launch_status)
  return statusIcon
}

export default LaunchStatusButton;
