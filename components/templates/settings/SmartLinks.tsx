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
} from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"
import LabelImportantIcon from "@material-ui/icons/LabelImportant"
import EditIcon from "@material-ui/icons/Edit"
import React from "react"
import getSmartLinks from "../../../data/SmartLinks"

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
  })
)

export default function SmartLinks(children: any) {
  const { project_id } = children
  const classes = useStyles()

  const { loading, noData, smart_links, mutate } = getSmartLinks(project_id)

  async function deleteSmartlink(smart_link_id) {
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
    return (
      <div>
        <Typography variant="h6" className={classes.title}>
          There are no Smart Links yet
        </Typography>
      </div>
    )
  } else {
    return (
      <div>
        {" "}
        {loading ? (
          "Loading smart links..."
        ) : (
          <div>
            <Typography variant="h6" className={classes.title}>
              Smart links enabled:
            </Typography>
            <div className={classes.demo}>
              <List dense={true}>
                {smart_links.map(smart_link => (
                  <ListItem key={smart_link.smart_link_id}>
                    <ListItemAvatar>
                      <Avatar>
                        <LabelImportantIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                          smart_link.environment
                          ? smart_link.label + " - " + smart_link.environment.substring(0, 25)
                          : smart_link.label
                      }
                      secondary={
                        smart_link.smart_link.substring(0, 40)
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() =>
                          deleteSmartlink(smart_link.smart_link_id)
                        }
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
