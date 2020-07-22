import React from "react"
import { Tooltip, IconButton, Snackbar } from "@material-ui/core"
import { showStatusIcon } from "."
import StopIcon from "@material-ui/icons/Stop"
import CloseIcon from "@material-ui/icons/Close"

export function showStatusAndEnableToStopRunningLaunch(status, launchId) {
  const [openPopUp, setOpenPopUp] = React.useState(false)

  const handleStopButtonClick = async (launchId: string | number) => {
    // PUT request using fetch with async/await
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        launch_id: launchId,
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

  const [isHovered, setIsHovered] = React.useState(false)

  const hoverOn = () => {
    setIsHovered(true)
  }

  const hoverOff = () => {
    setIsHovered(false)
  }

  let statusIcon = <div></div>
  if (status === "Running" || status === "In Process") {
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
            onClick={() => handleStopButtonClick(launchId)}
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
              showStatusIcon(status)
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
  } else statusIcon = showStatusIcon(status)
  return statusIcon
}
