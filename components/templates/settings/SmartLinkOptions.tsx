import {
  Typography,
  Divider,
  ButtonGroup,
  Button,
  TextField,
  Grid,
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
import SaveIcon from '@material-ui/icons/Save';
import React from "react"

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
    button: {
        margin: theme.spacing(1),
        position: "absolute",
        right: "5%",
        // top: "10%",
        // width: "10%",
        // height: "10%",
      },
  })
)

function generate(element: React.ReactElement) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    })
  )
}

export default function SmartLinkOptions() {
  const classes = useStyles()
  const [dense, setDense] = React.useState(false)
  const [secondary, setSecondary] = React.useState(false)

  return (
    <div>
      {/* <Typography color="textSecondary" variant="body2">
             Where you want to show this link
            </Typography>
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button>Launch</Button>
              <Button>Test Run</Button>
              <Button>Test Suite</Button>
              <Button>Test</Button>
            </ButtonGroup> */}
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Typography variant="h6" className={classes.title}>
            Smart links enabled:
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {/* {generate( */}
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <LabelImportantIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Kibana - https://load.*.donedeal.ninja/"
                    secondary={ "https://kibana.dsch.services/app/ki..."}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            {/* //   )} */}
            </List>
          </div>
        </Grid>
      </Grid>
      <TextField
        required
        id="smart-link-environment"
        label="Environment"
        defaultValue=""
        helperText="Environment where this link will be activated, it could a  Python regular expression"
      />
      <Divider variant="middle" />
      <TextField
        required
        id="smart-link"
        label="Smart Link"
        defaultValue=""
        helperText="Link to anywhere you want, include variables in this way {test_run_id}"
      />
      <Divider variant="middle" />
      <TextField
        required
        id="smart-label"
        label="Label"
        defaultValue=""
        helperText="Label to be set into this button"
      />
      <Divider variant="middle" />
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        startIcon={<SaveIcon />}
      >
        Save
      </Button>
    </div>
  )
}
