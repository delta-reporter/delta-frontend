import {
  Typography,
  Divider,
  Button,
  TextField,
  Grid,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core"
import SaveIcon from "@material-ui/icons/Save"
import { CirclePicker } from "react-color"
import React from "react"
import SmartLinks from "./SmartLinks"

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
      position: "relative",
      left: "80%",
    },
  })
)

export default function SmartLinkOptions(children: any) {
  const { project_id } = children
  const classes = useStyles()
  const [color, setColor] = React.useState("#fff")

  const handleChangeComplete = clr => {
    setColor(clr.hex)
  }

  console.log(project_id)

  async function createSmartlink() {
    const data = {
      project_id: project_id,
      environment: (document.getElementById(
        "smart-link-environment"
      ) as HTMLInputElement).value,
      smart_link: (document.getElementById("smart-link") as HTMLInputElement)
        .value,
      label: (document.getElementById("smart-label") as HTMLInputElement).value,
      color: color,
    }

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
    const postResponse = await fetch(
      `${process.env.publicDeltaCore}/api/v1/smart_link`,
      options
    )
    await postResponse.json()
  }

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
          <SmartLinks project_id={project_id} />
        </Grid>
      </Grid>
      <TextField
        required
        id="smart-link-environment"
        label="Environment"
        defaultValue=""
        helperText="Environment where this link will be activated, it could be a Python regular expression"
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
      <Typography variant="subtitle1" className={classes.title}>
        Color for this button
      </Typography>
      <CirclePicker color={color} onChangeComplete={handleChangeComplete} />
      <Button
        variant="contained"
        color="primary"
        size="small"
        className={classes.button}
        startIcon={<SaveIcon />}
        onClick={() => createSmartlink()}
      >
        Save
      </Button>
    </div>
  )
}
