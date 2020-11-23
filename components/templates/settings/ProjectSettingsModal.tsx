import React from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import SettingsIcon from "@material-ui/icons/Settings"
import {
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core"
import ProjectSettingsTabs from "./ProjectSettingsTabs"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    settingsButton: {
      position: "absolute",
      right: "10%",
      top: "10%",
      width: "10%",
      height: "10%",
    },
  })
)

export default function ProjectSettingsModal() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      {/* <button type="button" onClick={handleOpen}>
        react-transition-group
      </button> */}
      <IconButton
        className={classes.settingsButton}
        color="primary"
        aria-label="Project settings"
        onClick={handleOpen}
      >
        <SettingsIcon />
      </IconButton>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <ProjectSettingsTabs />
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
