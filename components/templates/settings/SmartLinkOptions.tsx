import {
  Typography,
  TextField,
  Grid,
  createStyles,
  makeStyles,
  Theme,
  Link,
  MenuItem,
  Select,
  Tooltip,
  Button,
  Checkbox,
} from "@material-ui/core"
import React from "react"
import SmartLinks from "./SmartLinks"
import HelpIcon from "@material-ui/icons/Help"

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
    textDark: {
      color: theme.palette.secondary.light,
    },
    textLight: {
      color: "black",
    },
    colorButton: {
      margin: "5px",
    },
  })
)

export default function SmartLinkOptions(children: any) {
  const { project_id, darkMode } = children
  const classes = useStyles()
  const [color, setColor] = React.useState("#eacba9")
  const [filtered, setFiltered] = React.useState(false)
  const [location, setLocation] = React.useState(1)

  const handleColourPicking = hex => {
    document.getElementById(color).style.color = color
    setColor(hex)
    document.getElementById(hex).style.color = "black"
  }

  const handleLinkLocationChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setLocation(event.target.value as number)
  }

  const colorSet1 = ["#eacba9", "#ecf6b6", "#d2d86f", "#b7eea6", "#88d86f"]
  const colorSet2 = ["#94CAF7", "#b7b6f6", "#dbbeff", "#f0b8f6", "#f6bdb6"]

  async function createSmartLink() {
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFiltered(event.target.checked)
  }

  return (
    <div className={darkMode ? classes.textDark : classes.textLight}>
      <Typography variant="h5" style={{ marginLeft: "19%" }}>
        Add useful links to test report
      </Typography>
      <div style={{ width: "100%", marginTop: "35px" }}>
        <Typography style={{ width: "60%", float: "left" }}>
          1. Where to display the button:
        </Typography>
        <Select
          value={location}
          onChange={handleLinkLocationChange}
          style={{ width: "25%", float: "right", marginLeft: "5px" }}
          className={darkMode ? classes.textDark : classes.textLight}
        >
          <MenuItem value="1">Test Level</MenuItem>
          <MenuItem value="2">Test Run Level</MenuItem>
        </Select>
      </div>

      <div style={{ width: "100%", marginTop: "100px" }}>
        <Typography style={{ width: "80%", float: "left" }}>
          2. Regular expression for the environment (optional):
        </Typography>
        <Tooltip
          title="Click this for help with the regular expression"
          id="environment"
          style={{ width: "20%", float: "right" }}
        >
          <Link href="https://pythex.org/">
            {" "}
            <HelpIcon style={{ color: "#bfbbbb" }} />{" "}
          </Link>
        </Tooltip>
      </div>
      <div style={{ width: "100%", paddingTop: "40px" }}>
        <Tooltip
          title="Check this box, if you want your env to be filtered"
          id="environment"
          style={{ width: "20%", float: "right" }}
        >
          <Checkbox
            checked={filtered}
            onChange={handleCheckboxChange}
            style={{
              width: "5%",
              float: "left",
              marginLeft: "-5px",
              color: "#bfbbbb",
            }}
          />
        </Tooltip>
        <TextField
          id="smart-link-environment"
          label="Environment regex"
          defaultValue=""
          inputProps={{ maxLength: 2000 }}
          style={{
            width: "80%",
            float: "left",
            marginLeft: "25px",
            marginTop: "-15px",
          }}
        />
      </div>

      <div style={{ width: "100%", marginTop: "70px" }}>
        <Typography style={{ width: "80%", float: "left" }}>
          3. Smart Link to anywhere you want (e.g. logs):
        </Typography>
        <Tooltip
          title="Include variables in this way  { foo }"
          style={{ width: "20%", float: "right" }}
        >
          <HelpIcon style={{ color: "#bfbbbb" }} />
        </Tooltip>
        <TextField
          required
          id="smart-link"
          label="Smart Link"
          defaultValue=""
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ width: "100%", marginTop: "40px" }}>
        <Typography style={{ width: "50%", float: "left" }}>
          4. Datetime format for start date:
        </Typography>
        <Tooltip
          title="Click this for help with time format"
          style={{ width: "3%", float: "left" }}
        >
          <Link href="http://www.strftime.net/">
            {" "}
            <HelpIcon style={{ color: "#bfbbbb" }} />{" "}
          </Link>
        </Tooltip>
        <TextField
          required
          id="smart-datetime-format"
          defaultValue="%Y-%m-%dT%H:%M:%SZ"
          inputProps={{ maxLength: 300 }}
          style={{
            width: "40%",
            float: "right",
            fontSize: "0.5em",
            marginTop: "-10px",
          }}
        />
      </div>

      <div style={{ width: "100%", marginTop: "90px" }}>
        <Typography style={{ width: "50%", float: "left" }}>
          5. Label to be set for this button:
        </Typography>
        <TextField
          required
          id="smart-label"
          label="Label"
          defaultValue=""
          inputProps={{ maxLength: 30 }}
          style={{
            width: "40%",
            float: "right",
            fontSize: "0.5em",
            marginTop: "-25px",
          }}
        />
      </div>

      <div style={{ width: "100%", marginTop: "140px", marginBottom: "10px" }}>
        <Typography>6. Choose the color for the button (optional):</Typography>
        <div style={{ paddingTop: "20px" }}>
          {colorSet1.map(color => (
            <Button
              id={color}
              className={classes.colorButton}
              style={{ backgroundColor: color, color: color }}
              onClick={() => handleColourPicking(color)}
              key={color}
            >
              ✓
            </Button>
          ))}
        </div>
        <div style={{ paddingBottom: "30px" }}>
          {colorSet2.map(color => (
            <Button
              id={color}
              className={classes.colorButton}
              style={{ backgroundColor: color, color: color }}
              onClick={() => handleColourPicking(color)}
              key={color}
            >
              ✓
            </Button>
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          onClick={() => createSmartLink()}
        >
          Save
        </Button>
      </div>
      {/* Existing links list */}
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <SmartLinks
            project_id={project_id}
            darkMode={darkMode}
            id="existing_smart_links"
          />
        </Grid>
      </Grid>
    </div>
  )
}
