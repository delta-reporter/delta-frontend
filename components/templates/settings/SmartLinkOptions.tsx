import {
  Typography,
  Divider,
  Button,
  TextField,
  Grid,
  createStyles,
  makeStyles,
  Theme,
  ButtonGroup,
  Link,
  Popper,
  Grow,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"
import SaveIcon from "@material-ui/icons/Save"
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown"
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

const locations = ["Test", "Test Run"]

export default function SmartLinkOptions(children: any) {
  const { project_id } = children
  const classes = useStyles()
  const [color, setColor] = React.useState("#fff")
  const [filtered, setFiltered] = React.useState(false)
  const [location, setLocation] = React.useState(1)

  const handleChangeComplete = clr => {
    setColor(clr.hex)
  }

  async function createSmartlink() {
    const data = {
      project_id: project_id,
      smart_link: (document.getElementById("smart-link") as HTMLInputElement)
        .value,
      label: (document.getElementById("smart-label") as HTMLInputElement).value,
      datetime_format: (document.getElementById(
        "smart-datetime-format"
      ) as HTMLInputElement).value,
      color: color,
      filtered: filtered,
      location: location,
    }

    if (filtered)
      data["environment"] = (document.getElementById(
        "smart-link-environment"
      ) as HTMLInputElement).value

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

  // States and methods for Location selector

  const [openLocation, setOpenLocation] = React.useState(false)
  const anchorRefLocation = React.useRef<HTMLDivElement>(null)
  const [selectedIndexLocation, setSelectedIndexLocation] = React.useState(0)

  const handleMenuItemClickLocation = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndexLocation(index)
    setOpenLocation(false)
    setLocation(index + 1)
  }

  const handleToggleLocation = () => {
    setOpenLocation(prevOpen => !prevOpen)
  }

  const handleCloseLocation = (
    event: React.MouseEvent<Document, MouseEvent>
  ) => {
    if (
      anchorRefLocation.current &&
      anchorRefLocation.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpenLocation(false)
  }

  const handleFiltered = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltered(event.target.checked)
  }

  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <SmartLinks project_id={project_id} />
        </Grid>
      </Grid>
      <Typography color="textSecondary" variant="body2">
        Where you want to show this link
      </Typography>
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRefLocation}
        aria-label="location button"
      >
        <Button>{locations[selectedIndexLocation]}</Button>
        <Button
          color="primary"
          size="small"
          aria-controls={openLocation ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="Select location"
          aria-haspopup="menu"
          onClick={handleToggleLocation}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={openLocation}
        anchorEl={anchorRefLocation.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 1500 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseLocation}>
                <MenuList id="split-button-menu">
                  {locations.map((cation, index) => (
                    <MenuItem
                      key={cation}
                      disabled={index === 2}
                      selected={index === selectedIndexLocation}
                      onClick={event =>
                        handleMenuItemClickLocation(event, index)
                      }
                    >
                      {cation}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      <FormControlLabel
        value="Filter by environment"
        control={<Checkbox color="primary" />}
        label="Filter by environment"
        labelPlacement="end"
        checked={filtered}
        onChange={handleFiltered}
      />
      {filtered ? (
        <div>
          <TextField
            required
            id="smart-link-environment"
            label="Environment"
            defaultValue=""
            helperText="Use a regular expression to filter the environment where this link will be activated"
          />
          <br />
          <Link href="https://pythex.org/">
            Check this for help with the regular expression
          </Link>
          <Divider variant="middle" />
        </div>
      ) : null}
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
        id="smart-datetime-format"
        label="Datetime Format"
        defaultValue="%Y-%m-%dT%H:%M:%SZ"
        helperText="Set the format for {start_datetime} and {end_datetime}"
      />
      <br />
      <Link href="http://www.strftime.net/">
        Check this for help with the format
      </Link>
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
