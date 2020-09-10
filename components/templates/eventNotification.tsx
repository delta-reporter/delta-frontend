import React, { useState } from "react"
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
// import CloseIcon from '@material-ui/icons/Close';
import ReplayIcon from '@material-ui/icons/Replay';
import Tooltip from '@material-ui/core/Tooltip';

export interface State extends SnackbarOrigin {
    open: boolean;
  }

export const EventNotification = function(message: string) {

    const [notificationState, setNotificationState] = React.useState<State>({
      open: false,
      vertical: 'top',
      horizontal: 'center',
    });
    const { vertical, horizontal, open } = notificationState;

    const handleClick = (newState: SnackbarOrigin) => () => {
      setNotificationState({ open: true, ...newState });
    };

    const handleClose = () => {
      setNotificationState({ ...notificationState, open: false });
    };

    const buttons = (
      <React.Fragment>
        <Button onClick={handleClick({ vertical: 'top', horizontal: 'right' })}>Kick new launch</Button>
      </React.Fragment>
    );

  return (
    <div>
    {buttons}
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          <Tooltip title="Reload page">
          <Button color="secondary" size="small" onClick={handleClose}>
          <ReplayIcon fontSize="small" />
          </Button>
          </Tooltip>
        </React.Fragment>
      }
      key={vertical + horizontal}
    />
  </div>
  )
}
