import React from "react"
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button';
// import CloseIcon from '@material-ui/icons/Close';
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

    // const handleClick = (newState: SnackbarOrigin) => () => {
    //   setNotificationState({ open: true, ...newState });
    // };

    const handleReload = () => {
      setNotificationState({ ...notificationState, open: false });
      router.reload();
    };

    const handleClose = () => {
        setNotificationState({ ...notificationState, open: false });
      };
    console.log(open)
    console.log("Hola DOS")

  return (
    <div>
    {/* {buttons} */}
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
