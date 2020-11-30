// This file is not currently used, it is a failed attempt to create a notification component
import React from "react"
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import Tooltip from '@material-ui/core/Tooltip';

export interface State extends SnackbarOrigin {
    open: boolean;
  }

export const EventNotification = function(message: string) {

    const router = useRouter()

    const [notificationState, setNotificationState] = React.useState<State>({
      open: true,
      vertical: 'top',
      horizontal: 'right',
    });
    const { vertical, horizontal, open } = notificationState;

    const handleReload = () => {
      setNotificationState({ ...notificationState, open: false });
      router.reload();
    };

    const handleClose = () => {
        setNotificationState({ ...notificationState, open: false });
      };

  return (
    <div>
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message={message}
      autoHideDuration={3000}
      action={
        <React.Fragment>
          <Tooltip title="Reload page">
          <Button color="secondary" size="small" onClick={handleReload}>
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
