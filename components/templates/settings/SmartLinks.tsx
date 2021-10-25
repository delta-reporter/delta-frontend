import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  createStyles,
  makeStyles,
  Theme,
  Divider,
  Tooltip,
} from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import LabelImportantIcon from "@material-ui/icons/LabelImportant"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import React from "react"
import getSmartLinks from "../../../data/SmartLinks"
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
    dark: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.light,
    },
    light: {},
  })
)

export default function SmartLinks(children: any) {
  const { project_id, darkMode } = children
  const classes = useStyles()

  const { loading, noData, smart_links, mutate } = getSmartLinks(project_id)

  async function deleteSmartLink(smart_link_id) {
    const options = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    }
    const postResponse = await fetch(
      `${process.env.publicDeltaCore}/api/v1/delete_smart_link/${smart_link_id}`,
      options
    )
    await postResponse.json()
    mutate()
  }

  if (noData) {
    return <></>
  } else {
    return (
      <div>
        {" "}
        {loading ? (
          "Loading smart links..."
        ) : (
          <div>
            <Divider style={{ marginTop: "5px" }} />
            <Typography
              variant="h5"
              style={{ marginLeft: "19%", marginTop: "25px" }}
            >
              Smart links for this project{" "}
              <ArrowDownwardIcon
                style={{ marginBottom: "-5px" }}
              ></ArrowDownwardIcon>
            </Typography>
            <div className={classes.demo} style={{ marginTop: "15px" }}>
              <List
                dense={true}
                className={darkMode ? classes.dark : classes.light}
              >
                {smart_links.map(smart_link => (
                  <ListItem key={smart_link.smart_link_id}>
                    <ListItemAvatar>
                      <Avatar>
                        <LabelImportantIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      className={darkMode ? classes.dark : classes.light}
                      primary={
                        smart_link.environment
                          ? smart_link.label +
                            " - " +
                            smart_link.environment.substring(0, 25)
                          : smart_link.label
                      }
                      secondary={smart_link.smart_link.substring(0, 40)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() =>
                          navigator.clipboard.writeText(smart_link.smart_link)
                        }
                        className={darkMode ? classes.dark : classes.light}
                      >
                        <Tooltip title="Copy the link to clipboard">
                          <FileCopyIcon />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          deleteSmartLink(smart_link.smart_link_id)
                        }
                        className={darkMode ? classes.dark : classes.light}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        )}{" "}
      </div>
    )
  }
}
