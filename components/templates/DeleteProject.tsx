import React from "react"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import Modal from "@material-ui/core/Modal"
import Backdrop from "@material-ui/core/Backdrop"
import Fade from "@material-ui/core/Fade"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import { Button, IconButton, Typography } from "@material-ui/core"

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
    deleteButton: {
      position: "absolute",
      right: "10%",
      top: "10%",
      width: "10%",
      height: "10%",
      color: "#bfbbbb",
    },
    textDark: {
      color: theme.palette.secondary.light,
    },
    textLight: {
      color: "black",
    },
    button: {
      margin: theme.spacing(1),
      position: "relative",
      left: "30%",
    },
    textDeletionMessage: {
      color: "#fb4f14",
    },
  })
)

export default function DeleteProject(children: any) {
  const { project_id, darkMode } = children
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [showMessage, setShowMessage] = React.useState(null)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  async function deleteProject() {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
    await fetch(
      `${process.env.publicDeltaCore}/api/v1/project/${project_id}`,
      options
    )
      .catch(() => {
        setShowMessage("There was a problem deleting this project")
      })
      .then(() => {
        setShowMessage(
          "The project deletion was scheduled, all the data related to it will be removed in a few minutes"
        )
      })
  }

  return (
    <div>
      <IconButton
        className={classes.deleteButton}
        aria-label="Delete project"
        onClick={handleOpen}
      >
        <DeleteForeverIcon />
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
          <div id="scroll">
            <div
              className={darkMode ? classes.frameDark : classes.frameLight}
              id="frame"
            >
              <div className={darkMode ? classes.textDark : classes.textLight}>
                {showMessage ? (
                  <div
                    className={darkMode ? classes.textDark : classes.textLight}
                  >
                    <Typography
                      variant="h6"
                      className={classes.textDeletionMessage}
                    >
                      {showMessage}
                    </Typography>
                  </div>
                ) : (
                  <div
                    className={darkMode ? classes.textDark : classes.textLight}
                  >
                    <Typography variant="h6">
                      Deleting the project will also delete test runs, test
                      suites and tests.
                      <br />
                      Are you sure?
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      className={classes.button}
                      onClick={handleClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      className={classes.button}
                      onClick={() => deleteProject()}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}
