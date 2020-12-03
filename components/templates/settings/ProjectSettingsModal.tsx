import React, { useEffect, useState } from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import SettingsIcon from "@material-ui/icons/Settings"
import { IconButton } from "@material-ui/core"
import ProjectSettingsTabs from "./ProjectSettingsTabs"
import SmartLinkOptions from "./SmartLinkOptions"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    frameLight: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      height: "90%",
      overflowY: "auto",
    },
    frameDark: {
      backgroundColor: theme.palette.secondary.main,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      height: "90%",
      overflowY: "auto",
    },
    settingsButton: {
      position: "absolute",
      right: "10%",
      top: "10%",
      width: "10%",
      height: "10%",
      color: "#bfbbbb",
    },
  })
)

export default function ProjectSettingsModal(children: any) {
  const { project_id, darkMode } = children
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
      <IconButton
        className={classes.settingsButton}
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
          <div className={ darkMode
            ? classes.frameDark
            : classes.frameLight} id="frame">
              <div id="scroll">
              <SmartLinkOptions project_id={project_id} darkMode={darkMode}/>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
